# AWS & Terraform Infrastructure Learnings

A focused reference guide on AWS services, Terraform concepts, and cloud infrastructure patterns learned while building and deploying the job-hunt-tracker project.

---

## 1. AWS Networking

### VPC (Virtual Private Cloud)

- Your own isolated private network inside AWS.
- All resources (RDS, ECS, etc.) live inside a VPC.
- Key settings:
  - `enable_dns_hostnames = true` — allows AWS resources to get DNS names
  - `enable_dns_support = true` — allows DNS resolution inside the VPC
- CIDR block defines the IP range of the VPC (e.g., `10.0.0.0/16` = 65,536 IPs).

### Subnets

- Subdivisions of a VPC, each tied to a specific **Availability Zone (AZ)**.

| Type               | Description                         | Use for                             |
| ------------------ | ----------------------------------- | ----------------------------------- |
| **Public Subnet**  | Has a route to the internet via IGW | Load Balancers, NAT Gateways        |
| **Private Subnet** | No direct internet access           | RDS, ECS tasks, application servers |

- `map_public_ip_on_launch = true` automatically assigns public IPs to resources in the public subnet.
- For **high availability**, create subnets in multiple AZs (e.g., `ap-southeast-2a`, `ap-southeast-2b`).

### Internet Gateway (IGW)

- Allows resources in **public subnets** to communicate with the internet.
- Attach to the VPC, then add a route in a Route Table: `0.0.0.0/0 → IGW`.

### Route Tables

- Define where network traffic is directed.
- Public Route Table: has a route `0.0.0.0/0 → IGW`.
- Private Route Table: has no internet route (or routes through NAT Gateway).
- Must be **associated** with subnets to take effect (`aws_route_table_association`).

### Security Groups

- Virtual firewalls applied to individual AWS resources.
- **Stateful** — if you allow inbound traffic, the response is automatically allowed outbound.
- **Ingress rules** — control who can connect _in_ (source IP or another security group).
- **Egress rules** — control where traffic can go _out_.
- `protocol = "-1"` means **all protocols** (used for broad egress allow-all rules).
- `from_port = 0, to_port = 0` with `protocol = "-1"` = allow all traffic.

#### Best Practice: Security Group Chaining

Instead of opening ports to `0.0.0.0/0`, restrict access to another security group:

```hcl
ingress {
  from_port       = 5432
  to_port         = 5432
  protocol        = "tcp"
  security_groups = [aws_security_group.ecs_sg.id]  # only ECS can talk to RDS
}
```

---

## 2. AWS RDS (Relational Database Service)

### Key Concepts

- Managed PostgreSQL (or other engines) — AWS handles patching, backups, failover.
- Lives in **private subnets** — never expose RDS to the internet.
- Connects to your app via an **endpoint** (hostname) that AWS assigns.

### Subnet Group

- Required to place RDS in specific subnets.
- Should include **multiple private subnets in different AZs** for high availability.

```hcl
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "my-app-prod-rds-subnet-group"
  subnet_ids = [var.private_subnet_id_az1, var.private_subnet_id_az2]
}
```

### Important Settings

| Setting                   | Dev           | Prod                    |
| ------------------------- | ------------- | ----------------------- |
| `publicly_accessible`     | `false`       | `false`                 |
| `skip_final_snapshot`     | `true`        | `false`                 |
| `multi_az`                | `false`       | `true`                  |
| `instance_class`          | `db.t3.micro` | `db.t3.small` or larger |
| `backup_retention_period` | `0`           | `7` (days)              |

### db_host

- When RDS is created, AWS assigns it an **endpoint/hostname** — this is the `db_host`.
- Format: `my-app-prod-rds.abc123.ap-southeast-2.rds.amazonaws.com`
- Your backend app uses this in `DATABASE_URL` to connect.
- Output it from the RDS module so ECS can consume it:

```hcl
output "db_host" {
  value = aws_db_instance.rds_instance.address
}
```

---

## 3. AWS ECR (Elastic Container Registry)

### Key Concepts

- Managed Docker image registry in AWS (like Docker Hub, but private and AWS-native).
- ECS pulls images from ECR to run containers.

### One Repo, Multiple Environments

- Use **one ECR repo per app** — differentiate environments by image **tags**:
  - `my-app-backend:dev-latest`
  - `my-app-backend:prod-v1.2.3`
  - `my-app-backend:prod-abc1234` (git commit SHA for traceability)
- This avoids duplicating repos and keeps images centralised.
- ECR is a **global/shared resource** — don't include `environment` in the repo name.

---

## 4. AWS ECS (Elastic Container Service) with Fargate

### Fargate vs EC2

- **Fargate** — serverless, AWS manages the underlying infrastructure. You just define CPU/memory.
- **EC2** — you manage the EC2 instances that run containers. More control, more responsibility.
- For most web apps, Fargate is the right choice.

### ECS Building Blocks

#### Cluster

- Logical grouping of ECS services and tasks.

```hcl
resource "aws_ecs_cluster" "main" {
  name = "my-app-prod-cluster"
}
```

#### Task Definition

- Blueprint that defines _what_ to run and _how_ to run it.
- Versioned — each update creates a new revision.

| Field                                    | Purpose                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `family`                                 | Name/version group for the task                                           |
| `network_mode = "awsvpc"`                | Each task gets its own ENI and private IP (required for Fargate)          |
| `requires_compatibilities = ["FARGATE"]` | Run serverless                                                            |
| `cpu / memory`                           | Resources allocated — fixed Fargate combinations (e.g., 256 CPU / 512 MB) |
| `execution_role_arn`                     | IAM role ECS uses to set up the container                                 |
| `task_role_arn`                          | IAM role your app code uses at runtime                                    |
| `container_definitions`                  | JSON array defining the container(s)                                      |
| `environment`                            | Plain text env vars (non-sensitive, e.g., `DB_HOST`)                      |
| `secrets`                                | Sensitive values from Secrets Manager, injected as env vars at startup    |

#### Service

- Keeps a desired number of tasks running, handles restarts, integrates with ALB.

```hcl
resource "aws_ecs_service" "backend" {
  name            = "my-app-prod-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [var.private_subnet_id]
    security_groups  = [var.ecs_sg_id]
    assign_public_ip = false
  }
}
```

---

## 5. AWS IAM (Identity and Access Management)

### Core Concepts

- **IAM Role** — a set of permissions that can be assumed by an AWS service or user.
- **Trust Policy** (`assume_role_policy`) — defines _who_ can assume the role (e.g., ECS tasks).
- **Permissions Policy** — defines _what_ the role can do (e.g., read secrets, pull from ECR).

### The Badge Analogy

| Concept            | Analogy                            |
| ------------------ | ---------------------------------- |
| Trust Policy       | Who can pick up the security badge |
| Permissions Policy | What doors the badge opens         |

### ECS Execution Role vs Task Role

| Role               | Used By       | Purpose                                                                           |
| ------------------ | ------------- | --------------------------------------------------------------------------------- |
| **Execution Role** | AWS/ECS       | Pull image from ECR, fetch secrets from Secrets Manager, write logs to CloudWatch |
| **Task Role**      | Your app code | Call AWS services at runtime (e.g., write to S3, read DynamoDB)                   |

#### Execution Role setup

```hcl
resource "aws_iam_role" "ecs_execution_role" {
  name = "my-app-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# AWS managed policy — grants ECR pull + CloudWatch Logs access
resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
```

### Important: Always output role ARNs from the IAM module

```hcl
output "ecs_execution_role_arn" {
  value = aws_iam_role.ecs_execution_role.arn
}
```

---

## 6. AWS Secrets Manager

### Why Use It

- Securely store sensitive values (DB passwords, API keys, JWT secrets).
- Automatically inject secrets into ECS containers as environment variables.
- Supports automatic rotation.

### Secret Format

- Secrets are stored as **JSON strings**:
  ```json
  { "POSTGRES_PASSWORD": "mypassword" }
  ```

### Referencing in Terraform

```hcl
data "aws_secretsmanager_secret" "db_password" {
  name = "my-app/prod/db_password"
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = data.aws_secretsmanager_secret.db_password.id
}

locals {
  # jsondecode converts the JSON string to a map, then extract the key
  db_password = jsondecode(
    data.aws_secretsmanager_secret_version.db_password.secret_string
  )["POSTGRES_PASSWORD"]
}
```

### Common Mistake

```hcl
# ❌ WRONG — you cannot index a string directly
local.db_password["POSTGRES_PASSWORD"]

# ✅ CORRECT — decode the JSON string first, then index
jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string)["POSTGRES_PASSWORD"]
```

### Injecting into ECS Task Definition

```hcl
secrets = [
  {
    name      = "DB_PASSWORD"   # env var name inside the container
    valueFrom = var.db_secret_arn  # ARN of the secret in Secrets Manager
  }
]
```

---

## 7. AWS Route53

### Key Concepts

- Managed DNS service — translates domain names to IP addresses.
- **Hosted Zone** — a container for DNS records for a domain.
- **Nameservers** — after creating a hosted zone, delegate to it by updating your domain registrar (e.g., GoDaddy) with Route53's nameservers.

---

## 8. Terraform Core Concepts

### Module Structure

```
terraform/
  main.tf          # root — instantiates all modules
  variables.tf     # root-level input variables
  outputs.tf       # root-level outputs
  providers.tf     # AWS provider + S3 backend config
  modules/
    igw/           # internet gateway + route table
    rds/           # RDS instance + subnet group + security group
    ecr/           # ECR repository
    ecs/           # ECS cluster + task definition + service
    iam/           # IAM roles and policies
    route53/       # hosted zone + DNS records
```

### Cross-Module References

Modules are **isolated** — they cannot directly reference resources in other modules.

**The only valid pattern:**

```
Module A (outputs value)
    ↓
Root main.tf (reads output, passes as variable)
    ↓
Module B (receives as variable)
```

**Exception:** Resources defined directly in root `main.tf` can be referenced directly:

```hcl
# These are in root main.tf — can reference directly
resource "aws_vpc" "main" { ... }
resource "aws_subnet" "private" { ... }

module "rds" {
  vpc_id            = aws_vpc.main.id           # ✅ direct reference
  private_subnet_id = aws_subnet.private.id     # ✅ direct reference
}
```

### Outputs

- Always output values from modules that other modules need:

```hcl
# modules/rds/outputs.tf
output "db_host" {
  value = aws_db_instance.rds_instance.address
}

# modules/ecr/outputs.tf
output "repository_url" {
  value = aws_ecr_repository.ecr_repo.repository_url
}

# modules/iam/outputs.tf
output "ecs_execution_role_arn" {
  value = aws_iam_role.ecs_execution_role.arn
}
```

### Variables

- Declare all inputs in `variables.tf`.
- Mark sensitive variables:

```hcl
variable "db_password" {
  type      = string
  sensitive = true
}
```

- Never default `environment` to `prod` — dangerous if you accidentally apply:

```hcl
variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  # no default — must be explicitly set
}
```

### Naming Conventions

- Pattern: `{app_name}-{environment}-{resource_type}`
- Examples:
  - `job-hunt-tracker-prod-rds`
  - `job-hunt-tracker-dev-ecs-cluster`
  - `job-hunt-tracker-prod-rds-subnet-group`
- Exception: **shared resources** like ECR — no environment in name.

### Resource Tagging

Always tag every resource:

```hcl
tags = {
  Name        = "${var.app_name}-${var.environment}-rds"
  Environment = var.environment
}
```

Tags are critical for cost allocation, filtering in AWS Console, and auditing.

### Remote State (S3 + DynamoDB)

- Store state in S3 so CI/CD pipelines and teammates can access it.
- Use DynamoDB for **state locking** — prevents two `terraform apply` runs at the same time.

```hcl
backend "s3" {
  bucket         = "my-app-tfstate"
  key            = "prod/terraform.tfstate"
  region         = "ap-southeast-2"
  dynamodb_table = "my-app-tfstate-lock"
  encrypt        = true
}
```

- **Never commit** `.tfstate` files — they contain secrets.
- **Always commit** `.terraform.lock.hcl` — ensures consistent provider versions across team.

### `.tfvars` Files

- Use for environment-specific values:

```hcl
# prod.tfvars
environment  = "prod"
instance_class = "db.t3.small"
desired_count  = 2
```

- Never commit `.tfvars` containing secrets — add to `.gitignore`.

### Backend Config and Multi-Environment

- Variable interpolation is **not allowed** in `backend` blocks.
- Use partial backend config with `-backend-config` flag:

```bash
terraform init -backend-config=environments/prod/backend.hcl
terraform apply -var-file=environments/prod/terraform.tfvars
```

### Common Gotchas

| Mistake                                       | Fix                                    |
| --------------------------------------------- | -------------------------------------- |
| `db_subnet_group` resource type               | Use `aws_db_subnet_group`              |
| Cross-module direct reference                 | Output from source, pass as variable   |
| `local.db_password["key"]` without jsondecode | Use `jsondecode(secret_string)["key"]` |
| Defaulting `environment = "prod"`             | Remove default — force explicit value  |
| Passing `public_subnet_id` to RDS             | RDS only needs private subnets         |
| `module.iam.role.arn` inside another module   | Pass ARN as a variable from root       |

---

## 9. Multi-Environment Strategy

### Recommended: Directory-Based

```
terraform/
  modules/           # reusable modules (no environment-specific code here)
  environments/
    dev/
      main.tf        # calls modules with dev-specific values
      terraform.tfvars
      backend.hcl    # key = "dev/terraform.tfstate"
    prod/
      main.tf        # calls modules with prod-specific values
      terraform.tfvars
      backend.hcl    # key = "prod/terraform.tfstate"
```

### Dev vs Prod Resource Differences

| Resource                  | Dev                                | Prod           |
| ------------------------- | ---------------------------------- | -------------- |
| RDS instance class        | `db.t3.micro`                      | `db.t3.small`+ |
| RDS Multi-AZ              | `false`                            | `true`         |
| RDS `skip_final_snapshot` | `true`                             | `false`        |
| ECS `desired_count`       | `1`                                | `2`+           |
| ECS CPU/Memory            | `256/512`                          | `512/1024`+    |
| ECR                       | Shared (same repo, different tags) | Shared         |

### ECR: One Repo for All Environments

- Single ECR repo — use image tags to differentiate:
  - `my-app-backend:dev-latest`
  - `my-app-backend:prod-v1.2.3`
  - `my-app-backend:prod-abc1234` (git SHA for traceability)
- ECS task definition references the tag: `"${var.ecr_repo_url}:${var.environment}-latest"`

---

## 10. AWS CLI & SSO Authentication

### How AWS Credential Priority Works

AWS looks for credentials in a fixed priority order. The first valid source wins:

1. Environment variables (`AWS_ACCESS_KEY_ID`, etc.)
2. `~/.aws/credentials` file (`[default]` profile)
3. `~/.aws/config` file (named profiles)
4. IAM role (on EC2/ECS instances)

### The SSO + Stale Credentials Problem

A common issue: you run `aws sso login` but commands still fail with `InvalidClientTokenId`.

**Why it happens:**

- `~/.aws/credentials` has **expired static/session credentials** under `[default]`.
- `~/.aws/config` has your valid **SSO profile** under a named profile (e.g., `[profile chapman]`).
- Because `[default]` in `credentials` wins the priority race, AWS uses the expired credentials instead of your SSO.

**Diagnose it:**

```bash
aws configure list   # shows which source is being used
```

If `TYPE` shows `shared-credentials-file`, your old credentials file is winning.

### Fixes

**Option A — Set `AWS_PROFILE` for your shell session:**

```bash
export AWS_PROFILE=chapman
aws sts get-caller-identity  # ✅ now uses SSO profile
```

To make it permanent, add to `~/.bashrc`:

```bash
echo 'export AWS_PROFILE=chapman' >> ~/.bashrc
source ~/.bashrc
```

**Option B — Clear the stale credentials file:**

```bash
> ~/.aws/credentials   # empties the file, SSO profile becomes the only option
```

**Option C — Use `--profile` flag every time:**

```bash
aws sts get-caller-identity --profile chapman
```

### Verifying You're Authenticated

```bash
aws sts get-caller-identity
```

Returns your AWS account ID, IAM user/role, and ARN if credentials are valid.

### Terraform + AWS Profile

If you set `AWS_PROFILE`, Terraform will automatically pick it up — no changes needed in Terraform config.

---

## 11. Infrastructure Checklist (What We've Built)

- [x] S3 + DynamoDB remote state
- [x] Route53 hosted zone
- [x] VPC + public/private subnets + IGW
- [x] RDS (PostgreSQL) with Secrets Manager password
- [x] ECR repository
- [x] IAM roles (execution + task) with policy attachments
- [ ] ECS cluster + task definition + service _(in progress)_
- [ ] ALB (Application Load Balancer)
- [ ] S3 + CloudFront (frontend hosting)
- [ ] ACM certificate (HTTPS)
- [ ] DNS records (Route53 → ALB, Route53 → CloudFront)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Multi-environment structure (`environments/dev`, `environments/prod`)

export interface JobApplication {
  id: number;
  company: string;
  position: string;
  applicationDate: string;
  status: "applied" | "interviewing" | "rejected" | "offer" | "withdrawn";
  applicationUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobApplication {
  company: string;
  position: string;
  applicationDate: string;
  status: JobApplication["status"];
  applicationUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}

export interface UpdateJobApplication extends Partial<CreateJobApplication> {
  id: number;
}

import type { JobApplication } from "../types/job";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";

interface JobTableProps {
  jobs: JobApplication[];
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (id: number) => void;
}

export default function JobTable({
  jobs,
  onEditJob,
  onDeleteJob,
}: JobTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: JobApplication["status"]) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      interviewing:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      offer:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      withdrawn:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[status];
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No job applications yet. Click "Add New Job" to get started!
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{job.company}</span>
                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        🔗
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>{job.position}</TableCell>
                <TableCell>{formatDate(job.applicationDate)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {job.contactPerson && (
                      <div className="font-medium">{job.contactPerson}</div>
                    )}
                    {job.contactEmail && (
                      <a
                        href={`mailto:${job.contactEmail}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {job.contactEmail}
                      </a>
                    )}
                    {job.contactPhone && (
                      <div className="text-muted-foreground">
                        {job.contactPhone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditJob(job)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteJob(job.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

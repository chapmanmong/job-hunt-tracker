import { useState, useEffect } from "react";
import JobTable from "../components/JobTable";
import JobModal from "../components/JobModal";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { getJobs, createJob, updateJob, deleteJob } from "../api";
import type {
  JobApplication,
  CreateJobApplication,
  UpdateJobApplication,
} from "../types/job";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Load jobs from API
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobsData = await getJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error("Failed to load jobs:", error);
      }
    };
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddJob = () => {
    setEditingJob(undefined);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (id: number) => {
    if (confirm("Are you sure you want to delete this job application?")) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter((job) => job.id !== id));
      } catch (error) {
        console.error("Failed to delete job:", error);
      }
    }
  };

  const handleSubmitJob = async (
    jobData: CreateJobApplication | UpdateJobApplication
  ) => {
    try {
      if ("id" in jobData) {
        // Update existing job
        const updatedJob = await updateJob(jobData.id, jobData);
        setJobs(jobs.map((job) => (job.id === jobData.id ? updatedJob : job)));
      } else {
        // Create new job
        const newJob = await createJob(jobData);
        setJobs([...jobs, newJob]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const getStatusCounts = () => {
    const counts = {
      total: jobs.length,
      applied: jobs.filter((j) => j.status === "applied").length,
      interviewing: jobs.filter((j) => j.status === "interviewing").length,
      rejected: jobs.filter((j) => j.status === "rejected").length,
      offer: jobs.filter((j) => j.status === "offer").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Job Applications
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your job applications
          </p>
        </div>
        <Button onClick={handleAddJob} size="lg" className="min-w-40">
          Add New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {statusCounts.total}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Total Applications
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-3xl font-bold text-blue-600">
            {statusCounts.applied}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Applied
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-3xl font-bold text-orange-600">
            {statusCounts.interviewing}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Interviewing
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-3xl font-bold text-green-600">
            {statusCounts.offer}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Offers
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search companies, positions, or contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-12"
        />
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-48 h-12">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <JobTable
        jobs={filteredJobs}
        onEditJob={handleEditJob}
        onDeleteJob={handleDeleteJob}
      />

      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitJob}
        job={editingJob}
      />
    </div>
  );
}

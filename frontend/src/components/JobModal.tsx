import { useState } from "react";
import type { CreateJobApplication, UpdateJobApplication, JobApplication } from "../types/job";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface JobModalProps {
  onClose: () => void;
  onSubmit: (job: CreateJobApplication | UpdateJobApplication) => void;
  job?: JobApplication; // For editing existing job
}

export default function JobModal({ onClose, onSubmit, job }: JobModalProps) {
  const [formData, setFormData] = useState<CreateJobApplication>({
    company: job?.company || "",
    position: job?.position || "",
    applicationDate: job?.applicationDate?.split("T")[0] || new Date().toISOString().split("T")[0],
    status: job?.status || "applied",
    applicationUrl: job?.applicationUrl || "",
    contactPerson: job?.contactPerson || "",
    contactEmail: job?.contactEmail || "",
    contactPhone: job?.contactPhone || "",
    notes: job?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (job) {
      onSubmit({ ...formData, id: job.id });
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as JobApplication["status"],
    });
  };

  return (
    <Dialog onOpenChange={onClose} open={true}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">{job ? "Edit" : "Add New"} Job Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Application Date *</Label>
              <Input
                id="applicationDate"
                name="applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationUrl">Application URL</Label>
            <Input
              id="applicationUrl"
              name="applicationUrl"
              type="url"
              value={formData.applicationUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" name="contactPhone" type="tel" value={formData.contactPhone} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Interview notes, follow-ups, etc..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-24">
              {job ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

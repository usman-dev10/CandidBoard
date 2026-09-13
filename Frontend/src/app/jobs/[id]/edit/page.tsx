"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GhostButton, PageFrame } from "@/components/ui";
import { JobSaveForm } from "@/components/JobSaveForm";
import { getJob } from "@/lib/jobs-store";
import type { Job } from "@/lib/types";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | undefined | null>(null);

  useEffect(() => {
    getJob(id).then((found) => setJob(found ?? undefined));
  }, [id]);

  if (job === null) return null;
  if (!job) {
    return (
      <PageFrame>
        <div className="max-w-xl mx-auto glass rounded-2xl p-6">
          <p className="text-white mb-4">This job was not found.</p>
          <GhostButton href="/jobs">Back to Jobs</GhostButton>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <JobSaveForm job={job} />
    </PageFrame>
  );
}

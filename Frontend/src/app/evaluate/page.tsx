import { Suspense } from "react";
import { PageFrame } from "@/components/ui";
import EvalForm from "./form";

export default function EvaluatePage() {
  return (
    <PageFrame>
      <Suspense fallback={null}>
        <EvalForm />
      </Suspense>
    </PageFrame>
  );
}

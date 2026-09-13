import Link from "next/link";
import { PageFrame } from "@/components/ui";
import { ContactForm } from "./form";

export default function ContactPage() {
  return (
    <PageFrame>
      <div className="max-w-2xl mx-auto glass rounded-2xl p-8 text-sm text-gray-400 space-y-4">
        <Link href="/" className="text-xs text-gray-500">← Back</Link>
        <h1 className="text-3xl font-bold text-white">Contact</h1>
        <ContactForm />
      </div>
    </PageFrame>
  );
}

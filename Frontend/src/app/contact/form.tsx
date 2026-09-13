"use client";

import { useState } from "react";
import { LiquidButton, inputClass } from "@/components/ui";
import { sanitize } from "@/lib/sanitize";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  if (sent) return <p className="text-white">Message sent.</p>;
  return (
    <>
      <input
        className={inputClass}
        placeholder="Email"
        maxLength={120}
        value={email}
        onChange={(e) => setEmail(sanitize(e.target.value, 120))}
      />
      <textarea
        className={inputClass}
        rows={4}
        placeholder="Message"
        maxLength={2000}
        value={message}
        onChange={(e) => setMessage(sanitize(e.target.value, 2000))}
      />
      <LiquidButton onClick={() => setSent(true)} disabled={!email.includes("@") || message.length < 8}>
        Send
      </LiquidButton>
    </>
  );
}

import { MAX_RESUME_BYTES } from "./data";

const OK_EXT = /\.(pdf|docx|txt)$/i;
const OK_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "",
]);

export function validateResume(file: File): string | null {
  if (!OK_EXT.test(file.name)) return "UNSUPPORTED_TYPE — use PDF, DOCX, or TXT.";
  if (file.type && !OK_MIME.has(file.type)) return "UNSUPPORTED_TYPE — MIME does not match.";
  if (file.size > MAX_RESUME_BYTES) return "FILE_TOO_LARGE — resume must be 2 MB or smaller.";
  if (file.size === 0) return "EMPTY_TEXT — file is empty.";
  return null;
}

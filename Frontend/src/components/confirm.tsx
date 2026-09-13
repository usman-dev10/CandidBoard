"use client";

export function ConfirmDialog({
  text,
  onCancel,
  onConfirm,
}: {
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-6 max-w-sm w-full">
        <p className="text-white mb-4">{text}</p>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="text-sm text-gray-400">Cancel</button>
          <button type="button" onClick={onConfirm} className="text-sm text-red-400">Delete</button>
        </div>
      </div>
    </div>
  );
}

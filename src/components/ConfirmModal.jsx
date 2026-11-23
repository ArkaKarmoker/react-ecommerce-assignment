import { AlertCircle } from 'lucide-react'

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Removal',
  message = 'Are you sure you want to remove this product from your shopping cart?',
  confirmLabel = 'Yes, Remove',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3
              id="confirm-modal-title"
              className="text-base font-bold text-slate-900"
            >
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-slate-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[42px] flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-initial"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[42px] flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-rose-500 sm:flex-initial"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

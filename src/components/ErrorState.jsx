import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorState({
  title = 'Unable to load data',
  message = 'Something went wrong while fetching data from the server.',
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="mx-auto my-10 max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-xs"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1.5 text-sm text-slate-600">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-500"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}

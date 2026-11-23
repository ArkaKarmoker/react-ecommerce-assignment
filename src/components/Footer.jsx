export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-sm text-slate-500 sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold text-slate-800">
            Shop<span className="text-indigo-600">Verse</span>
          </span>
          . All rights reserved.
        </p>

        <p>
          Developed by{' '}
          <a
            href="https://github.com/ArkaKarmoker"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500 hover:underline"
          >
            Arka Karmoker
          </a>
        </p>
      </div>
    </footer>
  )
}

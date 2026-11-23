import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function Dropdown({
  id,
  ariaLabel,
  icon: Icon,
  value,
  onChange,
  options = [],
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  function handleSelect(optionValue) {
    onChange(optionValue)
    setIsOpen(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        const currentIdx = options.findIndex((o) => o.value === value)
        setActiveIndex(currentIdx >= 0 ? currentIdx : 0)
      } else {
        setActiveIndex((prev) => (prev + 1) % options.length)
      }
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        const currentIdx = options.findIndex((o) => o.value === value)
        setActiveIndex(currentIdx >= 0 ? currentIdx : options.length - 1)
      } else {
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length)
      }
      return
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      if (activeIndex >= 0 && options[activeIndex]) {
        event.preventDefault()
        handleSelect(options[activeIndex].value)
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto" onKeyDown={handleKeyDown}>
      <button
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev
            if (next) {
              setActiveIndex(-1)
            }
            return next
          })
        }}
        className={`flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-all focus:outline-none sm:w-auto ${
          isOpen
            ? 'border-indigo-500 bg-white text-slate-900 ring-2 ring-indigo-500/15'
            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-white'
        }`}
      >
        <span className="flex items-center gap-2">
          {Icon && (
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors ${
                isOpen ? 'text-indigo-600' : 'text-slate-400'
              }`}
            />
          )}
          <span>{selectedOption?.label}</span>
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          onMouseLeave={() => setActiveIndex(-1)}
          className="absolute right-0 z-30 mt-2 w-full min-w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 sm:w-max"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isHighlighted = index === activeIndex

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(option.value)}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 font-semibold text-indigo-600'
                    : isHighlighted
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-indigo-600" />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

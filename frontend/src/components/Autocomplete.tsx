// Autocomplete générique pour les Pokémon
// Affiche une liste filtrée avec navigation clavier (flèches + Entrée)

import { useState, useRef, useEffect } from 'react'

interface AutocompleteProps {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  className?: string
}

export function Autocomplete({ value, onChange, options, placeholder, className = '' }: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const [query, setQuery] = useState(value)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Sync externe → interne
  useEffect(() => { setQuery(value) }, [value])

  // Fermer en cliquant ailleurs
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
        onChange(query)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [query, onChange])

  const filtered = query.trim()
    ? options.filter((p) => p.toLowerCase().includes(query.toLowerCase())).slice(0, 12)
    : []

  const pick = (name: string) => {
    setQuery(name)
    onChange(name)
    setOpen(false)
  }

  const highlightMatch = (text: string, q: string) => {
    if (!q) return text
    const i = text.toLowerCase().indexOf(q.toLowerCase())
    if (i < 0) return text
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-transparent text-accent2 font-bold">{text.slice(i, i + q.length)}</mark>
        {text.slice(i + q.length)}
      </>
    )
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <input
        type="text"
        className="input"
        value={query}
        placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlight(-1) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, filtered.length - 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)) }
          else if (e.key === 'Enter') {
            e.preventDefault()
            if (highlight >= 0 && filtered[highlight]) pick(filtered[highlight])
            else if (filtered[0]) pick(filtered[0])
          }
          else if (e.key === 'Escape') setOpen(false)
        }}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-bg3 border border-border2 rounded-lg z-50 max-h-48 overflow-y-auto mt-1 shadow-xl">
          {filtered.map((p, i) => (
            <div
              key={p}
              className={`px-3 py-2 text-sm cursor-pointer border-b border-border1 last:border-b-0 ${i === highlight ? 'bg-bg4' : 'hover:bg-bg4'}`}
              onMouseDown={(e) => { e.preventDefault(); pick(p) }}
            >
              {highlightMatch(p, query)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

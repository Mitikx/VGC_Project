// Calendrier mensuel des parties avec winrate par jour

import { useMemo, useState } from 'react'
import type { Game } from '@/types'

interface GameCalendarProps {
  games: Game[]
}

export function GameCalendar({ games }: GameCalendarProps) {
  const [offset, setOffset] = useState(0)

  const { days, monthLabel, stats } = useMemo(() => {
    const now = new Date()
    const target = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    const year = target.getFullYear()
    const month = target.getMonth()
    const monthLabel = target.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const byDay: Record<number, { w: number; l: number }> = {}
    games.forEach((g) => {
      const d = new Date(g.playedAt)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!byDay[day]) byDay[day] = { w: 0, l: 0 }
        if (g.result === 'WIN') byDay[day].w++
        else byDay[day].l++
      }
    })

    const days: Array<{ day: number | null; w: number; l: number; wr: number; total: number }> = []
    for (let i = 0; i < firstDay; i++) days.push({ day: null, w: 0, l: 0, wr: 0, total: 0 })
    for (let d = 1; d <= daysInMonth; d++) {
      const s = byDay[d] || { w: 0, l: 0 }
      const total = s.w + s.l
      const wr = total > 0 ? Math.round((s.w / total) * 100) : 0
      days.push({ day: d, ...s, wr, total })
    }

    const monthW = Object.values(byDay).reduce((s, x) => s + x.w, 0)
    const monthL = Object.values(byDay).reduce((s, x) => s + x.l, 0)
    const monthTotal = monthW + monthL
    const monthWr = monthTotal > 0 ? Math.round((monthW / monthTotal) * 100) : 0

    return { days, monthLabel, stats: { w: monthW, l: monthL, total: monthTotal, wr: monthWr } }
  }, [games, offset])

  const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <button
          className="text-xs text-text2 hover:text-text1 px-2 py-1 rounded hover:bg-bg3"
          onClick={() => setOffset(offset - 1)}
        >← Précédent</button>
        <h3 className="text-sm font-semibold capitalize">{monthLabel}</h3>
        <button
          className="text-xs text-text2 hover:text-text1 px-2 py-1 rounded hover:bg-bg3 disabled:opacity-30"
          onClick={() => setOffset(Math.min(offset + 1, 0))}
          disabled={offset >= 0}
        >Suivant →</button>
      </div>

      {stats.total > 0 ? (
        <div className="text-xs text-text2 text-center mb-3">
          {stats.total} parties · <span className="text-win font-semibold">{stats.w}V</span> · <span className="text-loss font-semibold">{stats.l}D</span> · winrate {stats.wr}%
        </div>
      ) : (
        <div className="text-xs text-text3 text-center mb-3">Aucune partie ce mois-ci</div>
      )}

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-text3 font-semibold py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d.day) return <div key={i} />
          const bg = d.total === 0 ? 'bg-bg3' : d.wr >= 50 ? 'bg-winBg border-win/30' : 'bg-lossBg border-loss/30'
          return (
            <div
              key={i}
              className={`aspect-square rounded ${bg} ${d.total > 0 ? 'border' : 'border border-border1'} flex flex-col items-center justify-center text-xs`}
              title={d.total > 0 ? `${d.day} : ${d.w}V/${d.l}D (${d.wr}%)` : `${d.day}`}
            >
              <span className={d.total > 0 ? 'font-bold' : 'text-text3'}>{d.day}</span>
              {d.total > 0 && (
                <span className={`text-[9px] mt-0.5 ${d.wr >= 50 ? 'text-win' : 'text-loss'}`}>{d.total}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

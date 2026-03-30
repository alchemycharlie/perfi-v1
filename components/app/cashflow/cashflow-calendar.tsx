'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils/currency';
import { cn } from '@/lib/utils/cn';

interface CalendarEvent {
  date: string;
  name: string;
  amount: number;
  type: 'income' | 'bill';
  method?: string;
}

interface CashflowCalendarProps {
  events: CalendarEvent[];
  year: number;
  month: number;
  currentBalance: number;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Custom cashflow calendar grid.
 * Phase 4: Month view, 7-column CSS grid (Mon-Sun), 5-6 rows.
 * Day cells show coloured dots for income (teal) and bill (amber) events.
 * Click a day → inline detail panel.
 */
export function CashflowCalendar({ events, year, month, currentBalance }: CashflowCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthLabel = new Date(year, month).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  // Build day cells for the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0 offset (ISO week)
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const today = new Date().toISOString().split('T')[0];

  // Group events by date
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const evt of events) {
    if (!eventsByDate.has(evt.date)) eventsByDate.set(evt.date, []);
    eventsByDate.get(evt.date)!.push(evt);
  }

  // Calculate projected balance per day
  const sortedDates = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return d.toISOString().split('T')[0];
  });

  let runningBalance = currentBalance;
  const balanceByDate = new Map<string, number>();
  for (const dateStr of sortedDates) {
    const dayEvents = eventsByDate.get(dateStr) || [];
    for (const evt of dayEvents) {
      if (evt.type === 'income') runningBalance += evt.amount;
      else runningBalance -= evt.amount;
    }
    balanceByDate.set(dateStr, runningBalance);
  }

  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) || [] : [];
  const selectedBalance = selectedDate ? balanceByDate.get(selectedDate) : null;

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-center gap-4">
        <p className="text-lg font-semibold text-text-primary">{monthLabel}</p>
      </div>

      {/* Calendar grid */}
      <div className="mt-4 grid grid-cols-7 gap-px rounded-[var(--radius-lg)] border border-border bg-border overflow-hidden">
        {/* Day name headers */}
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="bg-bg-secondary px-1 py-2 text-center text-xs font-medium text-text-muted"
          >
            {d}
          </div>
        ))}

        {/* Empty cells before first day */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-16 bg-bg-primary" />
        ))}

        {/* Day cells */}
        {sortedDates.map((dateStr, i) => {
          const dayNum = i + 1;
          const dayEvents = eventsByDate.get(dateStr) || [];
          const hasIncome = dayEvents.some((e) => e.type === 'income');
          const hasBill = dayEvents.some((e) => e.type === 'bill');
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={cn(
                'min-h-16 bg-bg-primary p-1.5 text-left transition-colors hover:bg-bg-secondary',
                isToday && 'ring-2 ring-inset ring-accent/30',
                isSelected && 'bg-accent/5',
              )}
            >
              <span
                className={cn('text-xs', isToday ? 'font-bold text-accent' : 'text-text-muted')}
              >
                {dayNum}
              </span>
              {(hasIncome || hasBill) && (
                <div className="mt-1 flex gap-1">
                  {hasIncome && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" title="Income" />
                  )}
                  {hasBill && <span className="h-1.5 w-1.5 rounded-full bg-warning" title="Bill" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent" /> Income
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-warning" /> Bill
        </span>
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="mt-4 rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h3>
            {selectedBalance != null && (
              <span className="text-sm tabular-nums text-text-secondary">
                Projected: {formatCurrency(selectedBalance)}
              </span>
            )}
          </div>

          {selectedEvents.length === 0 ? (
            <p className="mt-2 text-sm text-text-muted">No events on this day.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedEvents.map((evt, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        evt.type === 'income' ? 'bg-accent' : 'bg-warning',
                      )}
                    />
                    <span className="text-sm text-text-primary">{evt.name}</span>
                    {evt.method && (
                      <span className="text-xs text-text-muted">
                        ({evt.method.replace('_', ' ')})
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium tabular-nums',
                      evt.type === 'income' ? 'text-success' : 'text-text-primary',
                    )}
                  >
                    {evt.type === 'income' ? '+' : '-'}
                    {formatCurrency(evt.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

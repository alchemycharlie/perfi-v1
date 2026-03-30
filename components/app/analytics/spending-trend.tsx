'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/currency';

interface SpendingTrendProps {
  data: Array<{ month: string; spending: number }>;
}

/**
 * Spending over time area chart.
 * Phase 4 Section 8: Line or area chart for monthly spending trend.
 * Pro only.
 */
export function SpendingTrend({ data }: SpendingTrendProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: 'rgb(var(--color-text-muted))' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: 'rgb(var(--color-text-muted))' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `£${v}`}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            backgroundColor: 'rgb(var(--color-bg-primary))',
            border: '1px solid rgb(var(--color-border))',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
          }}
        />
        <Area
          type="monotone"
          dataKey="spending"
          stroke="rgb(var(--color-accent))"
          fill="rgb(var(--color-accent))"
          fillOpacity={0.1}
          strokeWidth={2}
          name="Spending"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

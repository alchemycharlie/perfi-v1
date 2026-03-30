'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils/currency';

interface ForecastChartProps {
  data: Array<{ date: string; balance: number }>;
}

export function ForecastChart({ data }: ForecastChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: 'rgb(var(--color-text-muted))' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(d) => String(new Date(d + 'T00:00:00').getDate())}
          interval="preserveStartEnd"
        />
        <YAxis hide />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(label) =>
            new Date(label + 'T00:00:00').toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            })
          }
          contentStyle={{
            backgroundColor: 'rgb(var(--color-bg-primary))',
            border: '1px solid rgb(var(--color-border))',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
          }}
        />
        <Area
          type="stepAfter"
          dataKey="balance"
          stroke="rgb(var(--color-accent))"
          fill="rgb(var(--color-accent))"
          fillOpacity={0.08}
          strokeWidth={2}
          name="Balance"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

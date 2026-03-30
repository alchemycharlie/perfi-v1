'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils/currency';

interface SpendingDonutProps {
  data: Array<{ name: string; value: number; fill: string }>;
}

/**
 * Spending by category donut chart.
 * Phase 4 Section 8: Donut/pie chart for spending breakdown.
 * Available on Free plan.
 */
export function SpendingDonut({ data }: SpendingDonutProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            backgroundColor: 'rgb(var(--color-bg-primary))',
            border: '1px solid rgb(var(--color-border))',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
          }}
        />
        <Legend
          verticalAlign="bottom"
          formatter={(value: string) => (
            <span className="text-xs text-text-secondary">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

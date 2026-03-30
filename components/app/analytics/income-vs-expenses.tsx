'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/currency';

interface IncomeVsExpensesProps {
  data: Array<{ month: string; income: number; expenses: number }>;
}

/**
 * Income vs Expenses stacked bar chart.
 * Phase 4 Section 8: Monthly income vs expenses.
 * Pro only.
 */
export function IncomeVsExpenses({ data }: IncomeVsExpensesProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
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
        <Legend
          formatter={(value: string) => (
            <span className="text-xs text-text-secondary">{value}</span>
          )}
        />
        <Bar dataKey="income" fill="rgb(var(--color-accent))" radius={[4, 4, 0, 0]} name="Income" />
        <Bar
          dataKey="expenses"
          fill="rgb(var(--color-warning))"
          radius={[4, 4, 0, 0]}
          name="Expenses"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

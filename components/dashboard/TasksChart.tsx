"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TasksChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

export default function TasksChart({
  data,
}: TasksChartProps) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold text-foreground">
        Tasks Overview
      </h2>

      <div className="mt-5 h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip cursor={false} />

            <Bar
              dataKey="count"
              fill="#3b82f6"
              barSize={56}
              radius={[6, 6, 0, 0]}
              label
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { name: '60Hz', db: 0 },
  { name: '150Hz', db: 0 },
  { name: '400Hz', db: 0 },
  { name: '1KHz', db: 0 },
  { name: '2.4KHz', db: 0 },
  { name: '15KHz', db: 0 },
];

const chartConfig = {
  db: {
    label: 'dB',
    color: 'hsl(var(--foreground))',
  },
} satisfies ChartConfig;

export default function EqualizerChart() {
    return (
        <ChartContainer config={chartConfig} className="aspect-video h-[180px] w-full">
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, left: 12, right: 12, bottom: 0 }}
            >
                <CartesianGrid vertical={true} horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.2} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                    domain={[-12, 12]}
                    ticks={[-12, 12]}
                    tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}dB`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    width={45}
                />
                <Tooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            hideIndicator
                            formatter={(value) => `${value} dB`}
                        />
                    }
                />
                <defs>
                    <linearGradient id="fillDb" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="hsl(var(--foreground))"
                        stopOpacity={0.4}
                    />
                    <stop
                        offset="95%"
                        stopColor="hsl(var(--foreground))"
                        stopOpacity={0.1}
                    />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="db"
                    type="monotone"
                    fill="url(#fillDb)"
                    stroke="var(--color-db)"
                    strokeWidth={2}
                    dot={{
                        r: 4,
                        fill: 'hsl(var(--background))',
                        stroke: 'var(--color-db)',
                        strokeWidth: 2,
                    }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1.5} />
            </AreaChart>
        </ChartContainer>
    );
}


"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  palpites: {
    label: "Palpites = ",
    color: "#2563eb",
  },
} satisfies ChartConfig

interface ChartProps{
  options: string[]
  results: ResultProps[]
}

interface ResultProps{
  id: string,
  name: string,
  guess: string,
  custom_guess: string | null,
  profile_url: string
  points: string,
  competitor: CompetitorProps,

}

interface CompetitorProps{
  id: string,
  name: string,
  profile_url: string,
  description: string
}
export function GuessOptionsChart( chartProps: ChartProps) {

  const guesses = chartProps.results.map(result => result.guess)

  const chartData = chartProps.options.map((option) => ({
    option:option,
    palpites: guesses.filter(guess => guess === option).length
  }))

  return (
    <Card >
      <CardContent>
        <ChartContainer config={chartConfig} className=" h-100  w-full" >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 30,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="option"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 15)}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="palpites" fill="var(--color-palpites)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={14}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

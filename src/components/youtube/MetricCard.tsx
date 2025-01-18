import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change: string
  type: 'positive' | 'negative'
}

export function MetricCard({ title, value, change, type }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center gap-1">
            {type === 'positive' ? (
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-600" />
            )}
            <p className={`text-sm font-medium ${
              type === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
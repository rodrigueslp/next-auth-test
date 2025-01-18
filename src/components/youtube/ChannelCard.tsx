import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ChannelCardProps {
  title: string
  value: string | number
  change?: number
  prefix?: string
  suffix?: string
}

export function ChannelCard({ title, value, change, prefix = "", suffix = "" }: ChannelCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">
            {prefix}{value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="ml-1 text-sm">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { ChannelStats } from "@/services/youtube"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface GrowthChartProps {
  stats: ChannelStats[]
}

function calculateYAxisRange(data: number[]) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const padding = (max - min) * 0.1 // 10% de padding

  return {
    min: Math.max(0, min - padding),
    max: max + padding
  }
}

function formatYAxisTick(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export function GrowthChart({ stats }: GrowthChartProps) {
  // Organiza os dados do mais antigo para o mais recente
  const sortedStats = [...stats].sort((a, b) => 
    new Date(a.collectedAt).getTime() - new Date(b.collectedAt).getTime()
  )

  const dates = sortedStats.map(stat => 
    new Date(stat.collectedAt).toLocaleDateString()
  )

  const subscriberCounts = sortedStats.map(stat => stat.subscriberCount)
  const viewCounts = sortedStats.map(stat => stat.viewCount)

  const subscribersRange = calculateYAxisRange(subscriberCounts)
  const viewsRange = calculateYAxisRange(viewCounts)

  const subscribersChartData = {
    labels: dates,
    datasets: [{
      label: 'Inscritos',
      data: subscriberCounts,
      borderColor: '#6D28D9',
      tension: 0.1,
      fill: false
    }]
  }

  const viewsChartData = {
    labels: dates,
    datasets: [{
      label: 'Visualizações',
      data: viewCounts,
      borderColor: '#22C55E',
      tension: 0.1,
      fill: false
    }]
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: undefined,
        max: undefined,
        ticks: {
          callback: function(value) {
            return formatYAxisTick(value as number)
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let value = context.parsed.y
            if (value >= 1000000) {
              return `${context.dataset.label}: ${(value / 1000000).toFixed(1)}M`
            } else if (value >= 1000) {
              return `${context.dataset.label}: ${(value / 1000).toFixed(1)}K`
            }
            return `${context.dataset.label}: ${value}`
          }
        }
      }
    }
  }

  return (
    <>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Crescimento de Inscritos</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Line 
            data={subscribersChartData}
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: {
                  ...chartOptions.scales?.y,
                  min: subscribersRange.min,
                  max: subscribersRange.max
                }
              }
            }}
          />
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Crescimento de Visualizações</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Line 
            data={viewsChartData}
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: {
                  ...chartOptions.scales?.y,
                  min: viewsRange.min,
                  max: viewsRange.max
                }
              }
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}

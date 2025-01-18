import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AnalyticsProps, DataPoint, GrowthDataPoint, UploadPattern } from "@/services/types"

export function ChannelAnalytics({ data: { stats, metrics } }: AnalyticsProps) {
  const timelineData: DataPoint[] = stats.slice().reverse().map(stat => ({
    date: new Date(stat.collectedAt).toLocaleDateString(),
    subscribers: stat.subscriberCount,
    views: stat.viewCount,
    videos: stat.videoCount
  }))

  const growthData: GrowthDataPoint[] = [
    { name: 'Diário', growth: metrics.dailySubscriberGrowth },
    { name: 'Semanal', growth: metrics.weeklySubscriberGrowth },
    { name: 'Mensal', growth: metrics.monthlySubscriberGrowth }
  ]

  const uploadPatternData: UploadPattern[] = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    frequency: i === metrics.mostCommonUploadHour ? 1 : 0
  }))

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Taxas de Crescimento</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="growth" name="Taxa de Crescimento de Inscritos (%)" fill="#6D28D9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Padrão de Upload</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uploadPatternData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="frequency" name="Frequência de Upload" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Métricas do Canal</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Vídeos por Semana</p>
              <p className="text-2xl font-bold">{metrics.videosPerWeek.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vídeos por Mês</p>
              <p className="text-2xl font-bold">{metrics.videosPerMonth.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duração Média dos Vídeos</p>
              <p className="text-2xl font-bold">{metrics.averageVideoDuration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Dia Mais Comum de Upload</p>
              <p className="text-2xl font-bold">{metrics.mostCommonUploadDay}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Hora Mais Comum de Upload</p>
              <p className="text-2xl font-bold">{metrics.mostCommonUploadHour}:00</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Categoria Principal</p>
              <p className="text-2xl font-bold">{metrics.topCategory}</p>
              <p className="text-sm text-gray-500">
                {metrics.topCategoryPercentage.toFixed(1)}% do conteúdo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Linha do Tempo de Crescimento</h3>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="subscribers" orientation="left" stroke="#6D28D9" />
              <YAxis yAxisId="views" orientation="right" stroke="#8B5CF6" />
              <YAxis yAxisId="videos" orientation="right" stroke="#A78BFA" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="subscribers"
                type="monotone" 
                dataKey="subscribers" 
                stroke="#6D28D9" 
                name="Inscritos"
                dot={false}
              />
              <Line 
                yAxisId="views"
                type="monotone" 
                dataKey="views" 
                stroke="#8B5CF6" 
                name="Visualizações"
                dot={false}
              />
              <Line 
                yAxisId="videos"
                type="monotone" 
                dataKey="videos" 
                stroke="#A78BFA" 
                name="Vídeos"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
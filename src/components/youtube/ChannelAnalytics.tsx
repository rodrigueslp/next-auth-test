import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Cell } from 'recharts'
import { AnalyticsProps, DataPoint, GrowthDataPoint, UploadPattern } from "@/services/types"
import GrowthTimeline from "./GrowthTimeline"

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

  const uploadPatternData: UploadPattern[] = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    // Verifica se uploadPatternByHour existe antes de tentar acessá-lo
    const frequency = metrics?.uploadPatternByHour?.[hour] || 0;
    // Calcula o total apenas se uploadPatternByHour existir
    const totalUploads = metrics?.uploadPatternByHour 
      ? Object.values(metrics.uploadPatternByHour).reduce((a, b) => a + b, 0)
      : 0;
    const percentage = totalUploads > 0 
      ? (frequency / totalUploads * 100) 
      : 0;

    return {
      hour: `${String(hour).padStart(2, '0')}:00`,
      frequency,
      percentage: Number(percentage.toFixed(1))
    };
  });

  // Formatação da duração média
  const formatDuration = (duration: string) => {
    // Remove o "PT" do início e converte para minúsculos
    const clean = duration.replace('PT', '').toLowerCase();
    // Substitui "M" por "m" e "S" por "s"
    return clean.replace('m', 'm').replace('s', 's');
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Métricas do Canal</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Vídeos por Semana</p>
              <p className="text-2xl font-bold">{Math.round(metrics.videosPerWeek)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vídeos por Mês</p>
              <p className="text-2xl font-bold">{Math.round(metrics.videosPerMonth)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duração Média dos Vídeos</p>
              <p className="text-2xl font-bold">{formatDuration(metrics.averageVideoDuration)}</p>
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
            <CardTitle>Padrão de Upload</CardTitle>
            <CardDescription>
              Distribuição de uploads por hora do dia
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uploadPatternData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour"
                  interval={1}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis>
                  <Label
                    value="Porcentagem de Uploads (%)"
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    'Porcentagem de Uploads'
                  ]}
                  labelFormatter={(label: string) => `Horário: ${label}`}
                />
                <Bar 
                  dataKey="percentage" 
                  name="Uploads" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                >
                  {uploadPatternData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.hour.split(':')[0] === String(metrics?.mostCommonUploadHour || 0).padStart(2, '0')
                        ? '#6D28D9'  // Hora mais comum em destaque
                        : '#8B5CF6'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <GrowthTimeline data={{ stats }} />

    </div>
  )
}
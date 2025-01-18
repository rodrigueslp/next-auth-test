import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Channel, ChannelStats, ChannelMetrics } from '@/services/youtube';
import { TrendingUp, TrendingDown, Clock, Users, Video, Calendar } from 'lucide-react';

interface ChannelInsightsProps {
  channel: Channel;
  stats: ChannelStats[];
  metrics: ChannelMetrics;
}

export function ChannelInsights({ channel, stats, metrics }: ChannelInsightsProps) {
  // Calculate engagement rate (views per subscriber)
  const engagementRate = ((channel.viewCount / channel.subscriberCount) * 100).toFixed(2);

  // Calculate average views per video
  const avgViewsPerVideo = Math.round(channel.viewCount / channel.videoCount);

  // Calculate growth trends
  const subscriberTrend = metrics.monthlySubscriberGrowth > 0 ? 'Em Crescimento' : 'Em Declínio';
  const viewsTrend = metrics.dailyViewGrowth > 0 ? 'Em Crescimento' : 'Em Declínio';

  // Generate performance insights
  const getPerformanceInsights = () => {
    const insights = [];

    // Subscriber growth insights
    if (metrics.monthlySubscriberGrowth > 5) {
      insights.push({
        type: 'positive',
        icon: <TrendingUp className="w-5 h-5 text-green-500" />,
        title: 'Crescimento Forte de Inscritos',
        description: `Canal está crescendo ${metrics.monthlySubscriberGrowth.toFixed(1)}% mensalmente, acima da média.`
      });
    } else if (metrics.monthlySubscriberGrowth < 0) {
      insights.push({
        type: 'negative',
        icon: <TrendingDown className="w-5 h-5 text-red-500" />,
        title: 'Desafio no Crescimento de Inscritos',
        description: 'Canal está experimentando crescimento negativo de inscritos. Analise os vídeos de sucesso para entender o que ressoa com seu público.'
      });
    }

    // Upload frequency insights
    if (metrics.videosPerWeek < 1) {
      insights.push({
        type: 'warning',
        icon: <Video className="w-5 h-5 text-yellow-500" />,
        title: 'Frequência de Upload',
        description: 'Considere aumentar a frequência de upload para manter o engajamento do público. Procure fazer pelo menos um vídeo por semana.'
      });
    } else if (metrics.videosPerWeek >= 3) {
      insights.push({
        type: 'positive',
        icon: <Video className="w-5 h-5 text-green-500" />,
        title: 'Agenda de Upload Consistente',
        description: `Ótimo trabalho mantendo uma agenda de upload frequente com ${metrics.videosPerWeek.toFixed(1)} vídeos por semana.`
      });
    }

    // Timing insights
    insights.push({
      type: 'info',
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      title: 'Tempo Ideal de Upload',
      description: `Seus vídeos performam melhor quando postados ${metrics.mostCommonUploadDay}s às ${metrics.mostCommonUploadHour}:00. Considere manter esse cronograma.`
    });

    // Category insights
    insights.push({
      type: 'info',
      icon: <Users className="w-5 h-5 text-purple-500" />,
      title: 'Desempenho da Categoria de Conteúdo',
      description: `Conteúdo de ${metrics.topCategory} tem melhor desempenho, compondo ${metrics.topCategoryPercentage.toFixed(1)}% dos seus vídeos mais bem-sucedidos.`
    });

    return insights;
  };

  const performanceInsights = getPerformanceInsights();

  // Prepare trend data for visualization
  const trendData = stats.slice().reverse().map(stat => ({
    date: new Date(stat.collectedAt).toLocaleDateString(),
    viewsPerVideo: Math.round(stat.viewCount / stat.videoCount),
    subscribersPerVideo: Math.round(stat.subscriberCount / stat.videoCount)
  }));

  return (
    <div className="grid gap-6">
      {/* Key Metrics Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Indicadores de Desempenho</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Taxa de Engajamento</p>
              <p className="text-2xl font-bold">{engagementRate}%</p>
              <p className="text-sm text-gray-500">Visualizações por inscrito</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Média de Visualizações</p>
              <p className="text-2xl font-bold">{avgViewsPerVideo.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Por vídeo</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Frequência de Upload</p>
              <p className="text-2xl font-bold">{metrics.videosPerWeek.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Vídeos por semana</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Insights de Desempenho do Canal</h3>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="grid gap-4">
              {performanceInsights.map((insight, index) => (
                <Alert key={index} variant={insight.type === 'negative' ? 'destructive' : 'default'}>
                  <div className="flex items-center gap-3">
                    {insight.icon}
                    <div>
                      <h4 className="font-semibold mb-1">{insight.title}</h4>
                      <AlertDescription>
                        {insight.description}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Growth Trends */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Tendências de Crescimento</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tendência de Inscritos</p>
                  <p className="text-2xl font-bold">{subscriberTrend}</p>
                  <p className="text-sm text-gray-500">
                    {metrics.monthlySubscriberGrowth > 0 ? '+' : ''}{metrics.monthlySubscriberGrowth.toFixed(1)}% ao mês
                  </p>
                </div>
                {metrics.monthlySubscriberGrowth > 0 ? (
                  <TrendingUp className="w-8 h-8 text-green-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tendência de Visualizações</p>
                  <p className="text-2xl font-bold">{viewsTrend}</p>
                  <p className="text-sm text-gray-500">
                    {metrics.dailyViewGrowth > 0 ? '+' : ''}{metrics.dailyViewGrowth.toFixed(1)}% ao dia
                  </p>
                </div>
                {metrics.dailyViewGrowth > 0 ? (
                  <TrendingUp className="w-8 h-8 text-green-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Tendências de Desempenho</h3>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="viewsPerVideo" 
                  name="Visualizações por Vídeo" 
                  fill="#6D28D9" 
                />
                <Bar 
                  dataKey="subscribersPerVideo" 
                  name="Inscritos por Vídeo" 
                  fill="#8B5CF6" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
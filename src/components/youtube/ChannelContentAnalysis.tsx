import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Activity, Video, TrendingUp } from 'lucide-react';
import { youtubeService } from "@/services/youtube";

interface RetentionMetrics {
  channelId: string;
  retentionByDuration: {
    [key: string]: {
      averageRetentionRate: number;
      averageEngagementRate: number;
      commonDropoffPoints: number[];
      viewDuration: number;
    };
  };
  retentionByHour: {
    [key: number]: {
      averageRetentionRate: number;
      averageEngagementRate: number;
      commonDropoffPoints: number[];
      viewDuration: number;
    };
  };
  recommendedDuration: string;
  recommendedHour: number;
  recommendedDay: string;
}

interface ContentPatternMetrics {
  channelId: string;
  titlePatterns: {
    highPerformingKeywords: string[];
    optimalLength: number;
    emojiImpact: { [key: string]: number };
  };
  topicAnalysis: {
    bestPerformingTopics: string[];
    trendingTopics: string[];
    saturatedTopics: string[];
  };
  contentTypeAnalysis: {
    formatPerformance: { [key: string]: number };
    seriesPerformance: { [key: string]: number };
    collaborationImpact: number;
  };
  recommendations: Array<{
    type: string;
    recommendation: string;
    confidence: number;
  }>;
}

interface ContentAnalysisProps {
  channelId: string;
}

export function ChannelContentAnalysis({ channelId }: ContentAnalysisProps) {
  const [retentionData, setRetentionData] = useState<RetentionMetrics | null>(null);
  const [patternsData, setPatternsData] = useState<ContentPatternMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [retentionResponse, patternsResponse] = await Promise.all([
            youtubeService.analyzeRetention(channelId),
            youtubeService.analyzeContentPatterns(channelId)
        ]);

        setRetentionData(retentionResponse);
        setPatternsData(patternsResponse);
        
      } catch (err) {
        setError('Falha ao carregar análise de conteúdo');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">Carregando análise de conteúdo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!retentionData || !patternsData) return null;

  const renderRetentionChart = () => {
    const data = Object.entries(retentionData.retentionByDuration).map(([duration, stats]) => ({
      duration,
      retenção: stats.averageRetentionRate,
      engajamento: stats.averageEngagementRate
    }));

    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="duration" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="retenção" name="Taxa de Retenção %" fill="#6D28D9" />
            <Bar dataKey="engajamento" name="Taxa de Engajamento %" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPatternChart = () => {
    const data = Object.entries(patternsData.contentTypeAnalysis.formatPerformance)
      .map(([format, performance]) => ({
        format,
        desempenho: performance
      }));

    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="format" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="desempenho" name="Desempenho do Formato %" fill="#6D28D9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTitleAnalysis = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Tamanho Ideal do Título</p>
            <p className="text-2xl font-bold">{patternsData.titlePatterns.optimalLength} caracteres</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Impacto de Emojis</p>
            <p className="text-2xl font-bold">
              {Math.max(...Object.values(patternsData.titlePatterns.emojiImpact)).toFixed(1)}%
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Palavras-chave de Alto Desempenho</h4>
          <div className="flex flex-wrap gap-2">
            {patternsData.titlePatterns.highPerformingKeywords.map((keyword, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {patternsData.recommendations.map((rec, index) => (
            <Alert key={index}>
              <div className="flex items-center gap-2">
                {rec.type === 'title' && <Video className="w-4 h-4" />}
                {rec.type === 'topic' && <TrendingUp className="w-4 h-4" />}
                <div>
                  <h4 className="font-medium capitalize">{rec.type}</h4>
                  <AlertDescription>{rec.recommendation}</AlertDescription>
                  <p className="text-sm text-gray-500 mt-1">
                    Confiança: {(rec.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="retention">
        <TabsList>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Retenção
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Padrões
          </TabsTrigger>
          <TabsTrigger value="titles" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Títulos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Análise de Retenção por Duração</h3>
            </CardHeader>
            <CardContent>
              {renderRetentionChart()}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Duração Recomendada</p>
                  <p className="text-2xl font-bold">{retentionData.recommendedDuration}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Melhor Horário</p>
                  <p className="text-2xl font-bold">{retentionData.recommendedHour}:00</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Melhor Dia</p>
                  <p className="text-2xl font-bold">{retentionData.recommendedDay}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Padrões de Conteúdo</h3>
            </CardHeader>
            <CardContent>
              {renderPatternChart()}
              {renderRecommendations()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="titles">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Análise de Títulos</h3>
            </CardHeader>
            <CardContent>
              {renderTitleAnalysis()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, Clock } from 'lucide-react';
import { youtubeService } from '@/services/youtube';

const COLORS = ['#6D28D9', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];

const formatNumber = (value: number | string): number => {
  if (typeof value === 'string') {
    return parseFloat(value) || 0;
  }
  return value || 0;
};

interface AudienceBehaviorMetrics {
  channelId: string;
  engagementPatterns: {
    overallEngagementRate: number;
    engagementByDayOfWeek: { [key: number]: number };
    engagementByHour: { [key: number]: number };
    engagementByContentType: { [key: string]: number };
    trendAnalysis: {
      direction: string;
      percentageChange: number;
      timeFrame: string;
      significantChanges: Array<{
        date: string;
        metric: string;
        changePercentage: number;
        possibleReason: string;
      }>;
    };
  };
  activityPeaks: {
    bestDaysToPost: number[];
    bestHoursToPost: number[];
    peakEngagementWindows: Array<{
      dayOfWeek: number;
      startHour: number;
      endHour: number;
      engagementMultiplier: number;
    }>;
  };
}

interface AudienceSegment {
  segmentType: string;
  size: number;
  preferences: { [key: string]: number };
  engagementLevel: number;
  recommendedContent: string[];
}

interface AudienceAnalysisProps {
  channelId: string;
}

export function ChannelAudienceAnalysis({ channelId }: AudienceAnalysisProps) {
  const [behaviorData, setBehaviorData] = useState<AudienceBehaviorMetrics | null>(null);
  const [segmentsData, setSegmentsData] = useState<AudienceSegment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [behavior, segments] = await Promise.all([
            youtubeService.analyzeAudienceBehavior(channelId),
            youtubeService.identifyTargetSegments(channelId)
        ]);

        setBehaviorData(behavior);
        setSegmentsData(segments);
      } catch (err) {
        setError('Falha ao carregar análise de audiência');
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
            <p className="text-lg text-gray-500">Carregando dados de audiência...</p>
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

  if (!behaviorData || !segmentsData) return null;

  const renderEngagementChart = () => {
    const data = Object.entries(behaviorData.engagementPatterns.engagementByHour).map(([hour, rate]) => ({
      hour: `${hour}:00`,
      engajamento: formatNumber(rate)
    }));

    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="engajamento" name="Taxa de Engajamento %" fill="#6D28D9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSegmentsChart = () => {
    const data = segmentsData.map(segment => ({
      name: segment.segmentType,
      value: formatNumber(segment.size)
    }));

    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderRetentionData = () => {
    const peakWindows = behaviorData.activityPeaks.peakEngagementWindows.map(window => ({
      day: window.dayOfWeek,
      start: window.startHour,
      end: window.endHour,
      multiplier: window.engagementMultiplier
    }));

    return (
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {peakWindows.map((window, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <div>
                  <h4 className="font-medium">
                    Janela de Engajamento - Dia {window.day}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {window.start}:00 - {window.end}:00
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    {(Number(window.multiplier) * 100).toFixed(1)}% mais engajamento
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="behavior">
        <TabsList>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Comportamento
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Segmentos
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Padrões de Comportamento</h3>
            </CardHeader>
            <CardContent>
              {renderEngagementChart()}
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Taxa Média de Engajamento</p>
                  <p className="text-2xl font-bold">
                    {Number(behaviorData.engagementPatterns.overallEngagementRate).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Horário de Pico</p>
                  <p className="text-2xl font-bold">
                    {behaviorData.activityPeaks.bestHoursToPost[0]}:00
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Melhor Dia para Postagem</p>
                  <p className="text-2xl font-bold">
                    Dia {behaviorData.activityPeaks.bestDaysToPost[0]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Segmentos de Audiência</h3>
            </CardHeader>
            <CardContent>
              {renderSegmentsChart()}
              
              <ScrollArea className="h-[300px] mt-6">
                <div className="space-y-4">
                  {segmentsData.map((segment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">{segment.segmentType}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Tamanho: {(Number(segment.size) * 100).toFixed(1)}% da audiência
                      </p>
                      <p className="text-sm text-gray-500">
                        Nível de Engajamento: {(Number(segment.engagementLevel) * 100).toFixed(1)}%
                      </p>
                      {segment.recommendedContent.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Conteúdo Recomendado:</p>
                          <ul className="text-sm text-gray-500 list-disc list-inside">
                            {segment.recommendedContent.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Horários de Maior Engajamento</h3>
            </CardHeader>
            <CardContent>
              {renderRetentionData()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
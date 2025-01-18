import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FeatureTabs, FeatureTabsContent, FeatureTabsList, FeatureTabsTrigger } from "@/components/ui/feature-tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { youtubeService } from "@/services/youtube";
import { formatNumber } from "@/lib/utils";
import { ChannelComparisonProps, ComparisonData, AdvancedComparisonData } from '@/services/youtube';

export function ChannelComparison({ channelIds, period = '30d' }: ChannelComparisonProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [advancedData, setAdvancedData] = useState<AdvancedComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [basicResponse, advancedResponse] = await Promise.all([
          youtubeService.compareChannels(channelIds, period),
          youtubeService.compareChannelsAdvanced(channelIds)
        ]);

        setComparisonData(basicResponse);
        setAdvancedData(advancedResponse);
      } catch (err) {
        setError('Falha ao carregar dados de comparação');
      } finally {
        setLoading(false);
      }
    };

    if (channelIds?.length > 0) {
      fetchData();
    }
  }, [channelIds, period]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">Carregando dados de comparação...</p>
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

  const renderMetricsChart = () => {
    if (!comparisonData?.channels) return null;
    
    const data = comparisonData.channels.map(channel => ({
      name: channel.title,
      subscribers: channel.metrics.subscriberCount,
      views: channel.metrics.viewCount,
      videos: channel.metrics.videoCount,
      engagement: channel.metrics.engagementScore
    }));
  
    return (
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#6D28D9" />
            <YAxis yAxisId="right" orientation="right" stroke="#22C55E" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="subscribers" name="Inscritos" fill="#6D28D9" />
            <Bar yAxisId="right" dataKey="engagement" name="Pontuação de Engajamento" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderMarketAnalysis = () => {
    if (!advancedData?.marketAnalysis) return null;

    const data = advancedData.marketAnalysis.marketPositions.map(position => ({
      name: position.title,
      marketShare: position.marketShare,
      competitiveIndex: advancedData.marketAnalysis.competitiveIndex[position.channelId]
    }));

    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Análise de Mercado</h3>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tamanho Total do Mercado</p>
                <p className="text-2xl font-bold">
                  {formatNumber(advancedData.marketAnalysis.totalMarketSize)} inscritos
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Taxa Média de Crescimento</p>
                <p className="text-2xl font-bold">
                  {advancedData.marketAnalysis.averageGrowthRate.toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="marketShare" name="Participação de Mercado (%)" fill="#6D28D9" />
                  <Bar dataKey="competitiveIndex" name="Índice Competitivo" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAdvancedMetrics = () => {
    if (!advancedData?.channels) return null;

    const data = advancedData.channels.map(channel => ({
      name: channel.title,
      efficiency: channel.advancedMetrics.efficiencyScore,
      consistency: channel.advancedMetrics.consistencyIndex,
      velocity: channel.advancedMetrics.growthVelocity
    }));

    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Comparação de Métricas Avançadas</h3>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" name="Pontuação de Eficiência" fill="#6D28D9" />
                <Bar dataKey="consistency" name="Índice de Consistência" fill="#8B5CF6" />
                <Bar dataKey="velocity" name="Velocidade de Crescimento" fill="#A78BFA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <FeatureTabs defaultValue="overview" className="space-y-4">
      <FeatureTabsList>
        <FeatureTabsTrigger value="overview">Visão Geral</FeatureTabsTrigger>
        <FeatureTabsTrigger value="market">Análise de Mercado</FeatureTabsTrigger>
        <FeatureTabsTrigger value="advanced">Métricas Avançadas</FeatureTabsTrigger>
      </FeatureTabsList>

      <FeatureTabsContent value="overview">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Comparação de Métricas de Canais</h3>
          </CardHeader>
          <CardContent>
            {renderMetricsChart()}
          </CardContent>
        </Card>
      </FeatureTabsContent>

      <FeatureTabsContent value="market">
        {renderMarketAnalysis()}
      </FeatureTabsContent>

      <FeatureTabsContent value="advanced">
        {renderAdvancedMetrics()}
      </FeatureTabsContent>
    </FeatureTabs>
  );
}
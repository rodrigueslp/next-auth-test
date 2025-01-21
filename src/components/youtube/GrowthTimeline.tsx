import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp, Eye, PlaySquare } from 'lucide-react';
import { ChannelStats } from '@/services/youtube';

interface TimelineProps {
  data: {
    stats: ChannelStats[];
  };
}

interface DataPoint {
  date: string;
  subscribers: number;
  views: number;
  videos: number;
}

const GrowthTimeline: React.FC<TimelineProps> = ({ data: { stats } }) => {
  const timelineData: DataPoint[] = useMemo(() => {
    return stats.slice().reverse().map(stat => ({
      date: new Date(stat.collectedAt).toLocaleDateString('pt-BR'),
      subscribers: stat.subscriberCount,
      views: stat.viewCount,
      videos: stat.videoCount,
    }));
  }, [stats]);

  const formatLargeNumber = (number: number, isVideo: boolean = false): string => {
    if (isVideo) {
      return Math.round(number).toString();
    }
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toString();
  };

  // Calcula o domínio para cada métrica
  const calculateDomain = (dataKey: keyof DataPoint): [number, number] => {
    const values = timelineData.map(item => item[dataKey] as number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1; // 10% de padding
    return [
      Math.max(0, min - padding), // Não permite valores negativos
      max + padding
    ];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {label}
        </p>
        <p className="text-sm">
          {formatLargeNumber(
            payload[0]?.value || 0, 
            payload[0]?.dataKey === 'videos'
          )}
        </p>
      </div>
    );
  };

  // Calcular crescimento percentual
  const getGrowthPercentage = (data: DataPoint[], key: keyof DataPoint) => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1][key] as number;
    const oldest = data[0][key] as number;
    return ((latest - oldest) / oldest * 100).toFixed(1);
  };

  const metrics = [
    {
      title: "Inscritos",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#6D28D9",
      dataKey: "subscribers" as const,
      growth: getGrowthPercentage(timelineData, "subscribers")
    },
    {
      title: "Visualizações",
      icon: <Eye className="w-5 h-5" />,
      color: "#8B5CF6",
      dataKey: "views" as const,
      growth: getGrowthPercentage(timelineData, "views")
    },
    {
      title: "Vídeos",
      icon: <PlaySquare className="w-5 h-5" />,
      color: "#A78BFA",
      dataKey: "videos" as const,
      growth: getGrowthPercentage(timelineData, "videos")
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.dataKey} className="w-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {metric.icon}
                <h3 className="text-lg font-semibold">{metric.title}</h3>
              </div>
              <div className={`text-sm font-medium ${
                Number(metric.growth) > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {Number(metric.growth) > 0 ? '↑' : '↓'} {Math.abs(Number(metric.growth))}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id={`gradient-${metric.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metric.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={metric.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="date"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5}
                  />
                  <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatLargeNumber(value, metric.dataKey === 'videos')}
                    width={45}
                    domain={calculateDomain(metric.dataKey)}
                    tickCount={5}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={metric.dataKey}
                    stroke={metric.color}
                    fill={`url(#gradient-${metric.dataKey})`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GrowthTimeline;
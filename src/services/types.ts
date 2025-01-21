import { ChannelStats, ChannelMetrics } from "@/services/youtube"

export interface AnalyticsProps {
  data: {
    stats: ChannelStats[];
    metrics: ChannelMetrics;
  }
}

export interface DataPoint {
  date: string;
  subscribers: number;
  views: number;
  videos: number;
}

export interface GrowthDataPoint {
  name: string;
  growth: number;
}

export interface UploadPattern {
  hour: string;
  frequency: number;
  percentage: number;  // Nova propriedade
}

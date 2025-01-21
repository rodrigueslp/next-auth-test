import { fetchApi } from './api';

export interface Video {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  categoryId: string;
  thumbnailUrl: string;
}

export interface Channel {
  channelId: string
  title: string
  description: string
  subscriberCount: number
  videoCount: number
  viewCount: number
}

export interface ChannelStats {
  channelId: string
  subscriberCount: number
  videoCount: number
  viewCount: number
  growthRate?: number
  collectedAt: string
}

export interface ChannelMetrics {
  uploadPatternByHour: { [key: number]: number };
  channelId: string
  dailySubscriberGrowth: number
  weeklySubscriberGrowth: number
  monthlySubscriberGrowth: number
  dailyViewGrowth: number
  videosPerWeek: number
  videosPerMonth: number
  averageVideoDuration: string
  mostCommonUploadHour: number
  mostCommonUploadDay: string
  topCategory: string
  topCategoryPercentage: number
  collectedAt: string
}

export interface ComparisonData {
  period: string;
  channels: Array<{
    channelId: string;
    title: string;
    metrics: {
      subscriberCount: number;
      subscriberGrowthRate: number;
      viewCount: number;
      viewGrowthRate: number;
      videoCount: number;
      uploadFrequency: number;
      avgVideoLength: number;
      engagementScore: number;
    };
  }>;
}

export interface AdvancedMetrics {
  efficiencyScore: number;
  consistencyIndex: number;
  marketShareScore: number;
  growthVelocity: number;
  trendsAnalysis: {
    uploadTrend: string;
    growthTrend: string;
    viewsTrend: string;
    bestPerformingDay: string;
    predictedGrowth: number;
  };
}

export interface AdvancedComparisonData {
  channels: Array<{
    channelId: string;
    title: string;
    baseMetrics: ComparisonData['channels'][0]['metrics'];
    advancedMetrics: AdvancedMetrics;
  }>;
  marketAnalysis: {
    totalMarketSize: number;
    averageGrowthRate: number;
    competitiveIndex: Record<string, number>;
    marketPositions: Array<{
      channelId: string;
      title: string;
      marketShare: number;
      competitiveStrength: string;
    }>;
  };
}

export interface ChannelComparisonProps {
  channelIds: string[];
  period?: string;
}

export interface MarketPosition {
  channelId: string;
  title: string;
  marketShare: number;
  competitiveStrength: string;
}

export interface Channel {
  channelId: string;
  title: string;
  description: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface ChannelStats {
  channelId: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  collectedAt: string;
  growthRate?: number;
}

export interface RetentionMetrics {
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

export interface AudienceBehaviorMetrics {
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

export interface AudienceSegment {
  segmentType: string;
  size: number;
  preferences: { [key: string]: number };
  engagementLevel: number;
  recommendedContent: string[];
}

export const youtubeService = {
  async addChannel(channelIdentifier: string) {
    return fetchApi(`/api/youtube/channels?channelIdentifier=${channelIdentifier}`, {
      method: 'POST'
    }) as Promise<Channel>;
  },

  async getChannels() {
    return fetchApi('/api/youtube/channels') as Promise<Channel[]>;
  },

  async getChannelMetrics(channelId: string) {
    return fetchApi(`/api/metrics/channels/${channelId}/metrics`) as Promise<ChannelMetrics>;
  },

  async getRecentVideos(channelId: string, limit: number = 3) {
    return fetchApi(`/api/youtube/channels/${channelId}/videos`) as Promise<Video[]>;
  },

  async compareChannels(channelIds: string[], period: string = '30d') {
    return fetchApi(`/api/comparison/channels?period=${period}`, {
      method: 'POST',
      body: JSON.stringify(channelIds),
    });
  },

  async analyzeChannelAdvanced(channelId: string) {
    return fetchApi(`/api/metrics/channels/${channelId}/analyze`);
  },

  async compareChannelsAdvanced(channelIds: string[]) {
    return fetchApi('/api/comparison/advanced/channels', {
      method: 'POST',
      body: JSON.stringify(channelIds),
    });
  },

  async getChannelStats(channelId: string) {
    return fetchApi(`/api/metrics/channels/${channelId}/stats`) as Promise<ChannelStats[]>;
  },

  async analyzeAudienceBehavior(channelId: string) {
    return fetchApi(`/api/audience/channels/${channelId}/behavior`) as Promise<AudienceBehaviorMetrics>;
  },

  async identifyTargetSegments(channelId: string): Promise<AudienceSegment[]> {
    return fetchApi(`/api/audience/channels/${channelId}/segments`) as Promise<AudienceSegment[]>;
  },

  async analyzeRetention(channelId: string): Promise<RetentionMetrics> {
    return fetchApi(`/api/content-analysis/channels/${channelId}/retention`) as Promise<RetentionMetrics>;
  },

  async analyzeContentPatterns(channelId: string): Promise<any> {
    return await fetchApi(`/api/content-analysis/channels/${channelId}/patterns`) as  Promise<any>;
  }

};

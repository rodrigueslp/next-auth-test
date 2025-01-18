// src/hooks/useYoutubeData.ts
import { useState, useEffect } from 'react';
import { youtubeService, Channel, ChannelMetrics, Video, ChannelStats } from '@/services/youtube';
import { toast } from 'sonner';

export function useYoutubeData() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [metrics, setMetrics] = useState<ChannelMetrics | null>(null);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [stats, setStats] = useState<ChannelStats[]>([]);


  async function loadChannels() {
    try {
      const data = await youtubeService.getChannels();
      setChannels(data);
    } catch (error) {
      toast.error('Erro ao carregar canais');
    }
  }

  async function addChannel(channelIdentifier: string) {
    try {
      const channel = await youtubeService.addChannel(channelIdentifier);
      setChannels(prev => [...prev, channel]);
      toast.success('Canal adicionado com sucesso');
      return channel;
    } catch (error) {
      toast.error('Erro ao adicionar canal');
      throw error;
    }
  }

  async function loadChannelData(channelId: string) {
    setLoading(true);
    try {
      const [channelMetrics, videos, channelStats] = await Promise.all([
        youtubeService.getChannelMetrics(channelId),
        youtubeService.getRecentVideos(channelId),
        youtubeService.getChannelStats(channelId)
      ]);
      setMetrics(channelMetrics);
      setRecentVideos(videos);
      setStats(channelStats);
    } catch (error) {
      toast.error('Erro ao carregar dados do canal');
    } finally {
      setLoading(false);
    }
  }

  async function compareChannels(channelIds: string[]) {
    try {
      return await youtubeService.compareChannels(channelIds);
    } catch (error) {
      toast.error('Erro ao comparar canais');
      throw error;
    }
  }

  useEffect(() => {
    loadChannels();
  }, []);

  return {
    channels,
    selectedChannel,
    metrics,
    recentVideos,
    stats,
    loading,
    addChannel,
    loadChannelData,
    compareChannels,
    setChannels,
    setSelectedChannel
  };
}
'use client'

import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Youtube, Twitter, Instagram, Plus, Loader2, Users, TrendingUp, BarChart2, Activity, LogOut, Video } from 'lucide-react'
import { ChannelCard } from '@/components/youtube/ChannelCard'
import { VideosList } from '@/components/youtube/VideosList'
import { ChannelComparison } from '@/components/youtube/ChannelComparison'
import { useYoutubeData } from '@/hooks/useYoutubeData'
import { formatNumber } from '@/lib/utils'
import { MetricCard } from '@/components/youtube/MetricCard'
import { GrowthChart } from '@/components/youtube/GrowthChart'
import { FeatureTabs, FeatureTabsList, FeatureTabsTrigger, FeatureTabsContent } from "@/components/ui/feature-tabs"
import { ChannelAnalytics } from '@/components/youtube/ChannelAnalytics'
import { Card, CardContent } from '@/components/ui/card'
import { ChannelInsights } from '@/components/youtube/ChannelInsights'
import { ChannelContentAnalysis } from '@/components/youtube/ChannelContentAnalysis'
import { ChannelAudienceAnalysis } from '@/components/youtube/ChannelAudienceAnalysis'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [channelUrl, setChannelUrl] = useState('')
  const {
    channels,
    selectedChannel,
    metrics,
    recentVideos,
    stats,
    loading,
    addChannel,
    loadChannelData,
    compareChannels,
    setSelectedChannel
  } = useYoutubeData()

  const handleAddChannel = async () => {
    try {
      const channel = await addChannel(channelUrl)
      setChannelUrl('')
      if (channel) {
        await loadChannelData(channel.channelId)
        setSelectedChannel(channel)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Substitua a seção do header atual por este código */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="flex items-center text-2xl font-bold">
              <span className="text-[#6D28D9]">Next</span>
              <span className="text-gray-900">Post</span>
            </h1>
          </div>

          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            Analytics
          </h2>
        </div>
        
        {session && (
          <div className="flex items-center gap-4">
            {/* Informações do usuário */}
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-100">
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session.user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user?.email}
                </p>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        )}
      </header>

      <Tabs defaultValue="youtube" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="youtube" className="gap-2">
            <Youtube className="w-4 h-4" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="twitter" disabled className="gap-2">
            <Twitter className="w-4 h-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="instagram" disabled className="gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </TabsTrigger>
        </TabsList>

        <TabsContent value="youtube">
          
          {/* Input para adicionar canal */}
          <div className="flex gap-4 mb-6">
            <Input 
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="URL ou ID do Canal"
              className="max-w-md"
            />
            <Button onClick={handleAddChannel} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Adicionar Canal
            </Button>
            {selectedChannel && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedChannel(null)}
                className="ml-auto"
              >
                Voltar para Lista de Canais
              </Button>
            )}
          </div>

          {/* Lista de canais */}
          {channels.length > 0 && !selectedChannel && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map(channel => (
                <Button
                  key={channel.channelId}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => {
                    setSelectedChannel(channel)
                    loadChannelData(channel.channelId)
                  }}
                >
                  <h3 className="font-semibold">{channel.title}</h3>
                  <p className="text-sm text-gray-500">{formatNumber(channel.subscriberCount)} inscritos</p>
                </Button>
              ))}
            </div>
          )}

          {/* Abas do dashboard - só aparecem quando um canal está selecionado */}
          {selectedChannel && metrics && (
            <FeatureTabs defaultValue="overview" className="w-full">
              <FeatureTabsList className="w-full justify-start mb-6">
                <FeatureTabsTrigger value="overview" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Visão Geral
                </FeatureTabsTrigger>
                <FeatureTabsTrigger value="analytics" className="gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Análise
                </FeatureTabsTrigger>
                <FeatureTabsTrigger value="comparison" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Comparação
                </FeatureTabsTrigger>
                <FeatureTabsTrigger value="insights" className="gap-2">
                  <Users className="w-4 h-4" />
                  Insights
                </FeatureTabsTrigger>
                <FeatureTabsTrigger value="content" className="gap-2">
                  <Video className="w-4 h-4" />
                  Conteúdo
                </FeatureTabsTrigger>
                <FeatureTabsTrigger value="audience" className="gap-2">
                  <Users className="w-4 h-4" />
                  Audiência
                </FeatureTabsTrigger>
              </FeatureTabsList>

              {/* Aqui adicionamos o conteúdo das abas */}
              <FeatureTabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard 
                    title="Total de Inscritos"
                    value={formatNumber(selectedChannel.subscriberCount)}
                    change={`${metrics.monthlySubscriberGrowth}%`}
                    type={metrics.monthlySubscriberGrowth >= 0 ? 'positive' : 'negative'}
                  />
                  <MetricCard 
                    title="Total de Visualizações"
                    value={formatNumber(selectedChannel.viewCount)}
                    change={`${metrics.dailyViewGrowth}%`}
                    type={metrics.dailyViewGrowth >= 0 ? 'positive' : 'negative'}
                  />
                  <MetricCard 
                    title="Contagem de Vídeos"
                    value={formatNumber(selectedChannel.videoCount)}
                    change={metrics.videosPerWeek > 0 ? `${metrics.videosPerWeek}%` : '--'}
                    type="positive"
                  />
                  <MetricCard 
                    title="Média de Visualizações"
                    value={formatNumber(Math.round(selectedChannel.viewCount / selectedChannel.videoCount))}
                    change="--"
                    type="positive"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <GrowthChart stats={stats} />
                  <VideosList videos={recentVideos} />
                </div>
              </FeatureTabsContent >

              <FeatureTabsContent  value="analytics">
              {selectedChannel && metrics && stats && (
                <ChannelAnalytics 
                  data={{
                    stats: stats,
                    metrics: metrics
                  }}
                />
              )}
              </FeatureTabsContent >

              <FeatureTabsContent  value="comparison">
              {selectedChannel && channels.length > 1 && (
                <ChannelComparison 
                  channelIds={channels.map(ch => ch.channelId)}
                />
              )}
              {(!selectedChannel || channels.length <= 1) && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-lg text-gray-500">
                        Adicione pelo menos dois canais para comparar o desempenho
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              </FeatureTabsContent >

              <FeatureTabsContent  value="insights">
              {selectedChannel && metrics && stats && (
                <ChannelInsights 
                  channel={selectedChannel}
                  metrics={metrics}
                  stats={stats}
                />
              )}
              </FeatureTabsContent >

              <FeatureTabsContent value="content">
                {selectedChannel && (
                  <ChannelContentAnalysis channelId={selectedChannel.channelId} />
                )}
              </FeatureTabsContent>

              <FeatureTabsContent value="audience">
                {selectedChannel && (
                  <ChannelAudienceAnalysis channelId={selectedChannel.channelId} />
                )}
              </FeatureTabsContent>

            </FeatureTabs>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
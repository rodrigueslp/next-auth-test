'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="flex items-center justify-center text-4xl font-bold mb-2">
          <span className="text-[#6D28D9]">Next</span>
          <span className="text-gray-900">Post</span>
        </h1>
        <p className="text-gray-600">Análise de Conteúdo e Engajamento</p>
      </div>

      <Card className="w-full max-w-md border-purple-100 shadow-xl">
        <CardHeader className="space-y-2 text-center pb-0">
          <h2 className="text-xl font-medium text-gray-900">
            Bem-vindo ao NextPost Analytics
          </h2>
          <p className="text-gray-500">
            Faça login para acessar suas análises
          </p>
        </CardHeader>
        <CardContent className="mt-6">
          <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-purple-50 border-purple-200"
              onClick={() => signIn('google')}
            >
            <FcGoogle className="w-5 h-5" />
            Continuar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cayoutube-development.up.railway.app';

export async function fetchApi(endpoint: string, options?: RequestInit) {
  const session = await getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(session?.idToken && { 
      'Authorization': `Bearer ${session.idToken}`
    }),
    ...options?.headers,
  };

  console.log(`${API_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}
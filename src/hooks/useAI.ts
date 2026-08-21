import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type AIFeature = 'email' | 'meeting' | 'task' | 'research' | 'chat';

interface AIRequest {
  feature: AIFeature;
  input: string;
  context?: Record<string, string>;
}

interface AIResponse {
  output: string;
  error?: string;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (req: AIRequest): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req),
        }
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${response.status})`);
      }
      const data: AIResponse = await response.json();
      if (data.error) throw new Error(data.error);
      return data.output;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}

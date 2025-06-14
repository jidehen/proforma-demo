import OpenAI from 'openai';
import { ProFormaInput, ProFormaOutput } from './types';

interface LLMProvider {
  generateProForma(systemPrompt: string, input: ProFormaInput): Promise<ProFormaOutput>;
}

class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generateProForma(systemPrompt: string, input: ProFormaInput): Promise<ProFormaOutput> {
    console.log('[LLM] Preparing to send request to Ollama/OpenAI');
    console.log('[LLM] Model:', this.model);
    console.log('[LLM] System Prompt:', systemPrompt);
    console.log('[LLM] Input:', input);
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        prompt: `${systemPrompt}\n\nInput: ${JSON.stringify(input)}\n\nOutput:`,
        stream: false,
        format: 'json',
        options: {
          temperature: 0,
          top_p: 1,
          seed: 42, // For reproducibility
        },
      }),
    });
    console.log('[LLM] Request sent. Awaiting response...');

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[LLM] Raw response from LLM:', data);
    
    try {
      // Ollama returns the response in the 'response' field
      const output = JSON.parse(data.response);
      console.log('[LLM] Parsed output:', output);
      return output as ProFormaOutput;
    } catch (e) {
      console.error('[LLM] Failed to parse LLM response:', data.response);
      throw new Error('Invalid JSON response from Ollama');
    }
  }
}

class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4-turbo-preview') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateProForma(systemPrompt: string, input: ProFormaInput): Promise<ProFormaOutput> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: JSON.stringify(input),
        },
      ],
      temperature: 0,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content) as ProFormaOutput;
    } catch (e) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }
  }
}

export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || 'ollama';

  switch (provider) {
    case 'ollama':
      const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
      const ollamaModel = process.env.OLLAMA_MODEL || 'mistral';
      return new OllamaProvider(ollamaUrl, ollamaModel);

    case 'openai':
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY is required when using OpenAI provider');
      }
      const openaiModel = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
      return new OpenAIProvider(apiKey, openaiModel);

    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

// Export for client-side usage with API key from UI
export function createClientLLMProvider(provider: string, config: any): LLMProvider {
  switch (provider) {
    case 'ollama':
      return new OllamaProvider(config.baseUrl || 'http://localhost:11434', config.model || 'mistral');
    
    case 'openai':
      return new OpenAIProvider(config.apiKey, config.model || 'gpt-4-turbo-preview');
    
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}
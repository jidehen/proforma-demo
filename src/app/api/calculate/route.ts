import { NextRequest, NextResponse } from 'next/server';
import { createLLMProvider } from '@/lib/llm-provider';
import { ProFormaInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { systemPrompt, input } = await request.json();

    if (!systemPrompt || !input) {
      return NextResponse.json(
        { message: 'Missing required fields: systemPrompt and input' },
        { status: 400 }
      );
    }

    console.log('[API] Received request for pro forma calculation');
    // Create LLM provider based on environment configuration
    const provider = createLLMProvider();
    console.log('[API] LLM provider created');
    // Generate pro forma using the LLM
    console.log('[API] Sending prompt and input to LLM provider...');
    const output = await provider.generateProForma(systemPrompt, input as ProFormaInput);
    console.log('[API] Received response from LLM provider:', output);

    return NextResponse.json(output);
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { message: 'Cannot connect to Ollama. Make sure it\'s running with: ollama serve' },
        { status: 503 }
      );
    }
    
    if (error.message.includes('model not found')) {
      return NextResponse.json(
        { message: 'Model not found. Install it with: ollama pull mistral' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
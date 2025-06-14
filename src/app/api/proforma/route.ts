import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { systemPrompt, input } = await request.json();

    if (!systemPrompt || !input) {
      return NextResponse.json(
        { message: 'Missing required fields: systemPrompt and input' },
        { status: 400 }
      );
    }

    console.log('[API] Received request for pro forma calculation via A2A');
    
    // Call the ProForma A2A Agent
    const response = await fetch('http://localhost:10001/send_task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          role: 'user',
          parts: [{
            type: 'text',
            text: JSON.stringify({ systemPrompt, input })
          }]
        }
      }),
    });

    if (!response.ok) {
      console.error('[API] ProForma agent error:', response.status, response.statusText);
      return NextResponse.json(
        { message: 'ProForma agent error' },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('[API] Received response from ProForma agent');
    
    // Extract the result from A2A response format
    const agentResponse = result.status.message.parts[0].text;
    const parsedResponse = JSON.parse(agentResponse);
    
    return NextResponse.json({
      proforma: parsedResponse.proforma,
      visualization: parsedResponse.visualization
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { message: 'Cannot connect to A2A agents. Make sure they are running with: npm run start-agents' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 
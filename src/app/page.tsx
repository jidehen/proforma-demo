'use client';

import { useState } from 'react';
import SystemPromptEditor from '@/components/SystemPromptEditor';
import InputEditor from '@/components/InputEditor';
import OutputDisplay from '@/components/OutputDisplay';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_INPUT } from '@/utils/constants';
import { ProFormaInput, ProFormaOutput } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [inputData, setInputData] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState<ProFormaOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [visualization, setVisualization] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setVisualization(null);
    setOutput(null);
    
    try {
      const response = await fetch('/api/proforma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt,
          input: inputData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to calculate');
      }

      const result = await response.json();
      setOutput(result.proforma);
      setVisualization(result.visualization);
      toast.success('Pro forma generated successfully via A2A agents!');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      systemPrompt,
      input: inputData,
      output,
      visualization,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proforma-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Results downloaded!');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pro Forma System Prompt Tester
          </h1>
          <p className="text-gray-600 mb-4">
            Test your rental property pro forma calculator system prompt using A2A Protocol
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
              Using A2A Agents
            </span>
            <span className="text-gray-500">
              Two distinct AI agents communicating via A2A Protocol
            </span>
          </div>
        </div>

        {/* Editors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SystemPromptEditor
            value={systemPrompt}
            onChange={setSystemPrompt}
            onReset={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
          />
          
          <InputEditor
            value={inputData}
            onChange={setInputData}
            onReset={() => setInputData(DEFAULT_INPUT)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={runTest}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing via A2A...' : 'Run Test'}
          </button>

          {output && (
            <button
              onClick={downloadResults}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Download Results
            </button>
          )}
        </div>

        {/* Output Display */}
        {output && (
          <>
            <OutputDisplay output={output} />
            {visualization && (
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  A2A Visualization Agent Output
                </h2>
                <div dangerouslySetInnerHTML={{ __html: visualization }} />
              </div>
            )}
          </>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">A2A Setup Guide</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Make sure Ollama is running: <code className="bg-blue-100 px-1 rounded">ollama serve</code></li>
            <li>Install required models: <code className="bg-blue-100 px-1 rounded">ollama pull mistral && ollama pull qwen2.5:3b</code></li>
            <li>Install Python dependencies: <code className="bg-blue-100 px-1 rounded">pip install -r agents/requirements.txt</code></li>
            <li>Start A2A agents: <code className="bg-blue-100 px-1 rounded">npm run start-agents</code></li>
            <li>Edit the system prompt or input data as needed</li>
            <li>Click "Run Test" to see both agents work together</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
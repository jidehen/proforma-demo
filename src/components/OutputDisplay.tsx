import { ProFormaOutput } from '@/lib/types';

interface OutputDisplayProps {
  output: ProFormaOutput;
}

export default function OutputDisplay({ output }: OutputDisplayProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Raw JSON Output</h2>
      <pre className="bg-gray-900 text-green-200 text-xs rounded-lg p-4 overflow-x-auto whitespace-pre-wrap max-h-96">
        {JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
} 
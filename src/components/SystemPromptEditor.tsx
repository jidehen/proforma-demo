import Editor from '@monaco-editor/react';

interface SystemPromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

export default function SystemPromptEditor({ value, onChange, onReset }: SystemPromptEditorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">System Prompt</h2>
        <button
          onClick={onReset}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Reset
        </button>
      </div>
      <div className="h-[400px] border border-gray-200 rounded-lg overflow-hidden">
        <Editor
          height="400px"
          defaultLanguage="markdown"
          value={value}
          onChange={(value: string | undefined) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
} 
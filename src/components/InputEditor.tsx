import Editor from '@monaco-editor/react';
import { ProFormaInput } from '@/lib/types';

interface InputEditorProps {
  value: ProFormaInput;
  onChange: (value: ProFormaInput) => void;
  onReset: () => void;
}

export default function InputEditor({ value, onChange, onReset }: InputEditorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Input Data</h2>
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
          defaultLanguage="json"
          value={JSON.stringify(value, null, 2)}
          onChange={(value: string | undefined) => {
            try {
              const parsed = JSON.parse(value || '{}');
              // Validate the structure
              if (
                parsed.property?.units &&
                parsed.property?.monthly_rent_per_unit &&
                parsed.property?.occupancy_rate &&
                parsed.property?.annual_property_taxes &&
                parsed.property?.annual_insurance &&
                parsed.expenses?.maintenance_per_unit_annual &&
                parsed.expenses?.utilities_monthly &&
                parsed.expenses?.hoa_monthly &&
                parsed.expenses?.other_monthly &&
                parsed.financing?.purchase_price &&
                parsed.financing?.down_payment_amount &&
                parsed.financing?.interest_rate &&
                parsed.financing?.loan_term_years
              ) {
                onChange(parsed as ProFormaInput);
              }
            } catch (e) {
              // Invalid JSON, ignore
            }
          }}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
} 
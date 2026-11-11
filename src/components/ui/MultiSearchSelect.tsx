import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { SearchSelectOption } from './SearchSelect';

interface MultiSearchSelectProps {
  values: string[];
  options: SearchSelectOption[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
}

export default function MultiSearchSelect({ values, options, onValuesChange, placeholder = 'Select items...' }: MultiSearchSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedLabels = options.filter(option => values.includes(option.value)).map(option => option.label);
  const visibleOptions = useMemo(() => {
    const text = query.trim().toLowerCase();
    return text
      ? options.filter(option => `${option.label} ${option.description || ''}`.toLowerCase().includes(text))
      : options;
  }, [options, query]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const toggle = (value: string) => {
    onValuesChange(values.includes(value) ? values.filter(item => item !== value) : [...values, value]);
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <input
        className="form-input w-full pr-10 focus:ring-orange-500 focus:border-orange-400"
        value={open && query ? query : selectedLabels.join(', ')}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        onFocus={event => { setQuery(''); setOpen(true); if (selectedLabels.length) event.currentTarget.select(); }}
        onChange={event => { setQuery(event.target.value); setOpen(true); }}
        onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); setQuery(''); } }}
        onClick={() => setOpen(true)}
        readOnly={false}
      />
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      {open && (
        <div role="listbox" aria-multiselectable="true" className="absolute z-40 top-full mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-orange-200 bg-white p-1 shadow-xl">
          {visibleOptions.length ? visibleOptions.map(option => {
            const checked = values.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={checked}
                onMouseDown={event => event.preventDefault()}
                onClick={() => toggle(option.value)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${checked ? 'bg-orange-500 text-white' : 'text-gray-800 hover:bg-orange-50'}`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? 'border-white bg-white text-orange-600' : 'border-gray-300 bg-white text-transparent'}`}>
                  {checked && <Check size={12} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{option.label}</span>
                  {option.description && <span className={`block text-xs ${checked ? 'text-orange-50' : 'text-gray-500'}`}>{option.description}</span>}
                </span>
              </button>
            );
          }) : <div className="px-3 py-4 text-sm text-gray-500">No matching items</div>}
          <div className="sticky bottom-0 border-t border-gray-100 bg-white px-3 py-2 text-xs text-gray-500">{values.length} selected · Click items to toggle</div>
        </div>
      )}
    </div>
  );
}

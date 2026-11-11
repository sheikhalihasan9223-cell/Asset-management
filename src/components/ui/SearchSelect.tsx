import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SearchSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SearchSelectProps {
  value: string;
  options: SearchSelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}

export default function SearchSelect({
  value,
  options,
  onValueChange,
  placeholder = 'Choose an option...',
  className = '',
  required = false,
  disabled = false,
  id,
}: SearchSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find(option => option.value === value);
  const visibleOptions = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return options;
    return options.filter(option => `${option.label} ${option.description || ''}`.toLowerCase().includes(text));
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

  const choose = (option: SearchSelectOption) => {
    onValueChange(option.value);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <input
        id={id}
        className="form-input w-full pr-10 focus:ring-orange-500 focus:border-orange-400"
        value={open && query ? query : selected?.label || query}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={id ? `${id}-options` : undefined}
        required={required}
        disabled={disabled}
        onFocus={event => { setQuery(''); setOpen(true); if (selected) event.currentTarget.select(); }}
        onChange={event => { setQuery(event.target.value); setOpen(true); }}
        onKeyDown={event => {
          if (event.key === 'Escape') { setOpen(false); setQuery(''); }
          if (event.key === 'ArrowDown') setOpen(true);
          if (event.key === 'Enter' && open && visibleOptions[0]) {
            event.preventDefault();
            choose(visibleOptions[0]);
          }
        }}
      />
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      {open && !disabled && (
        <div id={id ? `${id}-options` : undefined} role="listbox" className="absolute z-40 top-full mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-orange-200 bg-white p-1 shadow-xl">
          {visibleOptions.length > 0 ? visibleOptions.map(option => {
            const isSelected = option.value === value;
            return (
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                key={option.value}
                onClick={() => choose(option)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${isSelected ? 'bg-orange-500 text-white' : 'text-gray-800 hover:bg-orange-50'}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{option.label}</span>
                  {option.description && <span className={`block text-xs ${isSelected ? 'text-orange-50' : 'text-gray-500'}`}>{option.description}</span>}
                </span>
                {isSelected && <Check size={15} className="shrink-0" />}
              </button>
            );
          }) : <div className="px-3 py-4 text-sm text-gray-500">No matching options</div>}
        </div>
      )}
    </div>
  );
}

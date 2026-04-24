import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import './Field.css';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function TextField({ label, className = '', ...props }: TextFieldProps) {
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <input className={`input ${className}`.trim()} {...props} />
    </label>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: string[];
};

export function SelectField({ label, options, className = '', ...props }: SelectFieldProps) {
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <select className={`select ${className}`.trim()} {...props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

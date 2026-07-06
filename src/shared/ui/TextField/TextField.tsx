import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import styles from './TextField.module.scss';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name; visually hidden unless `showLabel` is set. */
  label: string;
  showLabel?: boolean;
  accent?: boolean;
  error?: boolean;
  icon?: ReactNode;
  onClear?: () => void;
  className?: string;
}

export function TextField({
  value,
  onValueChange,
  label,
  showLabel = false,
  accent = false,
  error = false,
  icon,
  onClear,
  className,
  ...inputProps
}: TextFieldProps) {
  const id = useId();

  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={showLabel ? styles.label : 'visually-hidden'}>
        {label}
      </label>
      <div
        className={cn(styles.control, accent && styles.controlAccent, error && styles.controlError)}
      >
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={styles.input}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          {...inputProps}
        />
        {onClear && value.length > 0 && (
          <button type="button" className={styles.clear} onClick={onClear} aria-label="Clear">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

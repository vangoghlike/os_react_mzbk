import type { ButtonHTMLAttributes } from 'react';
import './ActionButton.css';

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function ActionButton({
  variant = 'outline',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: ActionButtonProps) {
  return <button type={type} className={`button button--${variant} button--${size} ${className}`.trim()} {...props} />;
}

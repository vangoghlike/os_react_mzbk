import type { ReactNode } from 'react';
import './PageCard.css';

type PageCardProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageCard({ title, subtitle, actions, children, className = '' }: PageCardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || subtitle || actions) && (
        <header className="card__header">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>

          {actions && <div className="card__actions">{actions}</div>}
        </header>
      )}

      <div className="card__body">{children}</div>
    </section>
  );
}

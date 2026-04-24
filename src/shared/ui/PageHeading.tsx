import type { ReactNode } from 'react';
import './PageHeading.css';

type PageHeadingProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeading({ title, description, actions }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div>
        <h1 className="page-heading__title">{title}</h1>
        {description && <p className="page-heading__description">{description}</p>}
      </div>

      {actions && <div className="page-heading__actions">{actions}</div>}
    </div>
  );
}

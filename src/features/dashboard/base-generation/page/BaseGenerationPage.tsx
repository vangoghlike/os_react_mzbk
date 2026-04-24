import { PageHeading } from '../../../../shared/ui/PageHeading';
import { BaseGenerationSummarySection } from '../sections/BaseGenerationSummarySection';
import { BaseGenerationTableSection } from '../sections/BaseGenerationTableSection';
import './BaseGenerationPage.css';

export function BaseGenerationPage() {
  return (
    <div className="page-stack base-generation-page">
      <PageHeading title="기저발전" />
      <BaseGenerationSummarySection />
      <BaseGenerationTableSection />
    </div>
  );
}

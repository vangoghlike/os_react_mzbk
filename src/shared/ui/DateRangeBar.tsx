import { ActionButton } from './ActionButton';
import { SelectField, TextField } from './Field';
import './DateRangeBar.css';

type DateRangeBarProps = {
  selectOptions?: string[];
  actionLabel?: string;
};

export function DateRangeBar({
  selectOptions = ['Year', 'Month', 'Duration'],
  actionLabel = '조회'
}: DateRangeBarProps) {
  return (
    <div className="date-bar">
      <TextField type="date" />
      <span className="date-bar__separator">~</span>
      <TextField type="date" />
      <div className="date-bar__spacer" />
      <SelectField options={selectOptions} defaultValue={selectOptions[0]} />
      <ActionButton variant="primary">{actionLabel}</ActionButton>
    </div>
  );
}

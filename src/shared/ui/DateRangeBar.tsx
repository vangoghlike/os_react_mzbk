import { useState } from 'react';
import { ActionButton } from './ActionButton';
import { SelectField, TextField } from './Field';
import './DateRangeBar.css';

export type DateRangeSearchCriteria = {
  startDate: string;
  endDate: string;
  mode: string;
};

type DateRangeBarProps = {
  selectOptions?: string[];
  actionLabel?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultMode?: string;
  onSearch?: (criteria: DateRangeSearchCriteria) => void;
};

/*
 * 필요: 리포트 화면의 기간 선택과 조회 버튼을 공통 폼으로 묶는다.
 * 연결: OperationReportPage의 API 조회 상태.
 * 설명: 선택된 조건만 부모 section으로 전달하고 호출부가 API를 다시 조회한다.
 * 수정: 기본 날짜와 조회 기준은 호출부 props에서 조정한다.
 */
export function DateRangeBar({
  selectOptions = ['Year', 'Month', 'Duration'],
  actionLabel = '조회',
  defaultStartDate = '',
  defaultEndDate = '',
  defaultMode,
  onSearch
}: DateRangeBarProps) {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [mode, setMode] = useState(defaultMode ?? selectOptions[0] ?? '');

  return (
    <form
      className="date-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.({ startDate, endDate, mode });
      }}
    >
      <TextField type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} aria-label="시작일" />
      <span className="date-bar__separator">~</span>
      <TextField type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} aria-label="종료일" />
      <div className="date-bar__spacer" />
      <SelectField options={selectOptions} value={mode} onChange={(event) => setMode(event.target.value)} aria-label="조회 기준" />
      <ActionButton type="submit" variant="primary">{actionLabel}</ActionButton>
    </form>
  );
}

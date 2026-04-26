import { useState } from 'react';
import { ActionButton } from './ActionButton';
import './HistorySearchBar.css';

export type HistorySearchCriteria<T extends string> = {
  mode: T;
  startDate: string;
  endDate: string;
};

type HistorySearchBarProps<T extends string> = {
  modes: readonly T[];
  defaultMode: T;
  startDateLabel?: string;
  endDateLabel?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  onSearch?: (criteria: HistorySearchCriteria<T>) => void;
};

/*
 * 필요: 이력 화면의 Year/Month/Duration 검색 조건 UI를 공통화한다.
 * 연결: history feature filter mock과 PageHeading actions 영역.
 * 설명: 조회 API 없이 선택 상태와 submit 형태만 재현한다.
 * 수정: 모드 목록은 feature mock, 날짜 placeholder와 버튼 모양은 호출부/CSS에서 조정한다.
 */
export function HistorySearchBar<T extends string>({
  modes,
  defaultMode,
  startDateLabel = '년/월/일',
  endDateLabel = '년/월/일',
  defaultStartDate = '',
  defaultEndDate = '',
  onSearch
}: HistorySearchBarProps<T>) {
  // 조회 API 없이 선택 상태만 재현해 퍼블리싱 화면의 폼 구조를 확인한다.
  const [selectedMode, setSelectedMode] = useState<T>(defaultMode);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  return (
    <form
      className="history-search-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.({ mode: selectedMode, startDate, endDate });
      }}
    >
      <div className="history-search-bar__modes" role="radiogroup" aria-label="조회 기간 유형">
        {modes.map((mode) => {
          const selected = selectedMode === mode;

          return (
            <button
              key={mode}
              type="button"
              className={`history-search-bar__mode ${selected ? 'is-active' : ''}`.trim()}
              aria-pressed={selected}
              onClick={() => setSelectedMode(mode)}
            >
              <span className="history-search-bar__check" aria-hidden="true">
                ✓
              </span>
              <span>{mode}</span>
            </button>
          );
        })}
      </div>

      <label className="history-search-bar__date">
        <span className="sr-only">시작일</span>
        <input
          aria-label="시작일"
          placeholder={startDateLabel}
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
      </label>
      <span className="history-search-bar__dash">~</span>
      <label className="history-search-bar__date">
        <span className="sr-only">종료일</span>
        <input
          aria-label="종료일"
          placeholder={endDateLabel}
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
      </label>
      <ActionButton type="submit" variant="primary" className="history-search-bar__button">
        조회
      </ActionButton>
    </form>
  );
}

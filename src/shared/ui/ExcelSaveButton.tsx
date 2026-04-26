import type { ButtonHTMLAttributes, MouseEventHandler } from 'react';
import { commonIconSources } from '../assets/icons/commonIconSources';
import type { ExcelExportSheet } from '../utils/excelExport';
import { downloadExcelWorkbook } from '../utils/excelExport';
import { ActionButton } from './ActionButton';
import './ExcelSaveButton.css';

type ExcelSaveButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label?: string;
  iconSrc?: string;
  iconAlt?: string;
  fileName?: string;
  sheets?: ExcelExportSheet[];
};

/*
 * 필요: 여러 상세 표에 반복되는 전체엑셀 저장 버튼 모양을 통일한다.
 * 연결: ActionButton, commonIconSources, 각 feature table section.
 * 설명: 전달받은 mock 표 데이터를 브라우저 다운로드로 저장하고, 별도 클릭 동작도 함께 받을 수 있다.
 * 수정: 아이콘 src/alt는 props나 shared/assets/icons/commonIconSources에서 조정한다.
 */
export function ExcelSaveButton({
  label = '전체엑셀 저장',
  iconSrc = commonIconSources.excelSave.src,
  iconAlt = commonIconSources.excelSave.alt,
  fileName = 'excel-export',
  sheets,
  className = '',
  onClick,
  ...props
}: ExcelSaveButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || !sheets?.length) return;

    // 저장 전 확인은 모든 엑셀 버튼에서 같은 흐름으로 처리한다.
    const confirmed = window.confirm('엑셀 파일을 저장하시겠습니까?');
    if (!confirmed) return;

    downloadExcelWorkbook({ fileName, sheets });
  };

  return (
    <ActionButton
      variant="success"
      size="sm"
      className={`excel-save-button ${className}`.trim()}
      aria-label={props['aria-label'] ?? label}
      onClick={handleClick}
      {...props}
    >
      <img src={iconSrc} alt={iconAlt} className="excel-save-button__icon" />
      <span>{label}</span>
    </ActionButton>
  );
}

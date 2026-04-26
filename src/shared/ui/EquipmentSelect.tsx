import type { SelectHTMLAttributes } from 'react';
import './EquipmentSelect.css';

export type EquipmentOption = {
  label: string;
  value: string;
};

type EquipmentSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  options: EquipmentOption[];
};

/*
 * 필요: Inverter, Diesel, Battery 같은 장비 선택 UI를 공통으로 표시한다.
 * 연결: feature별 equipmentOptions mock과 section state.
 * 설명: 실제 데이터 조회 없이 선택값 표시와 변경 이벤트만 전달한다.
 * 수정: 장비명 목록은 화면 mock, 셀렉트 모양은 EquipmentSelect.css에서 조정한다.
 */
export function EquipmentSelect({ options, className = '', ...props }: EquipmentSelectProps) {
  return (
    <select className={`equipment-select ${className}`.trim()} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

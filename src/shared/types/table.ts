import type { ReactNode } from 'react';

/*
 * 필요: 여러 화면의 병합 헤더 표가 같은 셀 계약을 쓰게 한다.
 * 연결: BasicTable과 feature별 table mock.
 * 설명: colSpan, rowSpan, className만 공통화하고 화면별 컬럼은 mock에 둔다.
 * 수정: 표 셀 계약 자체가 바뀔 때만 이 shared 타입을 수정한다.
 */
export type TableHeaderCell = {
  label: string;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
};

/*
 * 필요: 표 셀에 문자열뿐 아니라 버튼/뱃지 같은 ReactNode도 넣을 수 있게 한다.
 * 연결: BasicTable rows와 feature별 table mock.
 * 설명: 현재 mock은 대부분 문자열이지만 상세 화면 확장을 막지 않기 위한 최소 허용이다.
 * 수정: 표 row 구조가 객체 기반으로 바뀔 때 이 타입을 먼저 조정한다.
 */
export type TableRow = (string | ReactNode)[];

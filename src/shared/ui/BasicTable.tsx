import type { TableHeaderCell, TableRow } from '../types/table';
import './BasicTable.css';

export type { TableHeaderCell as BasicTableHeaderCell, TableRow as BasicTableRow } from '../types/table';

type BasicTableProps = {
  headers?: string[];
  headerRows?: TableHeaderCell[][];
  rows: TableRow[];
  ariaLabel?: string;
  minWidth?: number | string;
  className?: string;
};

type HeaderCellRenderInfo = TableHeaderCell & {
  edgeClassName: string;
};

// 병합 헤더는 실제 바깥 셀만 라운드/외곽선 제거가 필요해서 colSpan, rowSpan 기준으로 위치를 계산한다.
function getHeaderRenderRows(headerRows?: TableHeaderCell[][], headers?: string[]): HeaderCellRenderInfo[][] {
  const rows: TableHeaderCell[][] = headerRows ?? [headers?.map((label): TableHeaderCell => ({ label })) ?? []];
  const rowCount = rows.length;
  const occupied = Array.from({ length: rowCount }, () => [] as boolean[]);
  const placedRows: Array<Array<HeaderCellRenderInfo & { rowIndex: number; colStart: number; colEnd: number; rowEnd: number }>> = rows.map(() => []);

  rows.forEach((row, rowIndex) => {
    let colIndex = 0;

    row.forEach((cell) => {
      while (occupied[rowIndex][colIndex]) {
        colIndex += 1;
      }

      const colSpan = cell.colSpan ?? 1;
      const rowSpan = Math.min(cell.rowSpan ?? 1, rowCount - rowIndex);
      const colStart = colIndex;
      const colEnd = colStart + colSpan;
      const rowEnd = rowIndex + rowSpan;

      for (let rowOffset = rowIndex; rowOffset < rowEnd; rowOffset += 1) {
        for (let colOffset = colStart; colOffset < colEnd; colOffset += 1) {
          occupied[rowOffset][colOffset] = true;
        }
      }

      placedRows[rowIndex].push({ ...cell, edgeClassName: '', rowIndex, colStart, colEnd, rowEnd });
      colIndex = colEnd;
    });
  });

  const totalColumns = Math.max(...placedRows.flat().map((cell) => cell.colEnd), 0);

  return placedRows.map((row) =>
    row.map((cell) => {
      const edgeClassNames = [
        cell.rowEnd === rowCount ? 'table__head-cell--edge-bottom' : '',
        cell.rowIndex === 0 && cell.colStart === 0 ? 'table__head-cell--corner-top-left' : '',
        cell.rowIndex === 0 && cell.colEnd === totalColumns ? 'table__head-cell--corner-top-right table__head-cell--edge-right' : '',
        cell.colStart === 0 && cell.rowEnd === rowCount ? 'table__head-cell--corner-bottom-left' : '',
        cell.colEnd === totalColumns && cell.rowEnd === rowCount ? 'table__head-cell--corner-bottom-right table__head-cell--edge-right' : ''
      ]
        .filter(Boolean)
        .join(' ');

      return {
        ...cell,
        edgeClassName: [cell.className, edgeClassNames].filter(Boolean).join(' ')
      };
    })
  );
}

/*
 * 필요: 여러 화면의 일반 표와 다중 헤더 표를 같은 구조로 렌더링한다.
 * 연결: shared/types/table, feature별 table mock.
 * 설명: headerRows가 있으면 병합 헤더를 쓰고, 없으면 단일 headers 배열을 쓴다.
 * 수정: 표 최소 폭은 호출부 mock의 minWidth로 조정하고 시각 스타일은 BasicTable.css에서 조정한다.
 */
export function BasicTable({ headers, headerRows, rows, ariaLabel, minWidth, className = '' }: BasicTableProps) {
  // 넓은 설비 표는 화면별 minWidth만 넘기고 공통 래퍼에서 가로 스크롤을 맡는다.
  const tableMinWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;
  const resolvedHeaderRows = getHeaderRenderRows(headerRows, headers);

  return (
    <div className={`table-wrap ${className}`.trim()}>
      <table className="table" aria-label={ariaLabel} style={{ minWidth: tableMinWidth }}>
        <thead>
          {resolvedHeaderRows.map((headerRow, rowIndex) => (
            <tr key={`header-row-${rowIndex}`}>
              {headerRow.map((cell, cellIndex) => (
                <th
                  key={`header-cell-${rowIndex}-${cellIndex}-${cell.label}`}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                  className={cell.edgeClassName}
                >
                  {cell.label}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

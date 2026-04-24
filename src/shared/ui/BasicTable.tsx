import type { ReactNode } from 'react';
import './BasicTable.css';

export type BasicTableHeaderCell = {
  label: string;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
};

type BasicTableProps = {
  headers?: string[];
  headerRows?: BasicTableHeaderCell[][];
  rows: (string | ReactNode)[][];
  ariaLabel?: string;
  className?: string;
};

export function BasicTable({ headers, headerRows, rows, ariaLabel, className = '' }: BasicTableProps) {
  return (
    <div className={`table-wrap ${className}`.trim()}>
      <table className="table" aria-label={ariaLabel}>
        <thead>
          {headerRows
            ? headerRows.map((headerRow, rowIndex) => (
                <tr key={`header-row-${rowIndex}`}>
                  {headerRow.map((cell, cellIndex) => (
                    <th
                      key={`header-cell-${rowIndex}-${cellIndex}-${cell.label}`}
                      colSpan={cell.colSpan}
                      rowSpan={cell.rowSpan}
                      className={cell.className}
                    >
                      {cell.label}
                    </th>
                  ))}
                </tr>
              ))
            : (
                <tr>
                  {headers?.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              )}
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

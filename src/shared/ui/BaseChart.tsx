import { useEffect, useRef, useState } from 'react';
import type { EChartsOption, EChartsType } from 'echarts';
import './BaseChart.css';

type BaseChartProps = {
  option: EChartsOption;
  height?: number;
  minWidth?: number | string;
  scrollable?: boolean;
  className?: string;
};

/*
 * 필요: Apache ECharts Community 차트를 화면마다 같은 래퍼로 렌더링한다.
 * 연결: 각 feature summary/result section의 ECharts option.
 * 설명: 데이터와 옵션은 section에서 받고, resize와 접근성 기본값만 공통 처리한다.
 * 수정: 차트 높이, 최소 폭, 스크롤 여부는 호출부 props에서 조정한다.
 */
export function BaseChart({ option, height = 320, minWidth, scrollable = false, className = '' }: BaseChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  // 1920 기준 차트 폭을 유지하되 좁은 화면에서는 래퍼 스크롤로 보호한다.
  const chartMinWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;

  useEffect(() => {
    if (!chartRef.current) return;

    let disposed = false;
    let chart: EChartsType | null = null;
    let resizeObserver: ResizeObserver | null = null;
    setLoading(true);

    const handleResize = () => {
      chart?.resize();
    };

    window.addEventListener('resize', handleResize);
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(chartRef.current);
    }

    // ECharts는 무거운 라이브러리라 화면 골격 렌더 후 차트 영역에서만 늦게 불러온다.
    import('echarts').then((echarts) => {
      if (!chartRef.current || disposed) return;

      chart = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
      chart.setOption({ aria: { enabled: true }, ...option }, true);
      setLoading(false);
      chart.resize();
    });

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      chart?.dispose();
    };
  }, [option]);

  return (
    <div className={`chart-box ${scrollable ? 'chart-box--scroll' : ''}`.trim()}>
      {loading && (
        <div className="chart__loading" role="status" aria-live="polite">
          <span className="chart__loading-text">
            차트 불러오는중
            <span className="chart__loading-dots" aria-hidden="true">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </span>
          <span className="chart__loading-bar" aria-hidden="true" />
        </div>
      )}
      <div
        ref={chartRef}
        className={`chart ${className}`.trim()}
        style={{ width: '100%', height, minWidth: chartMinWidth }}
      />
    </div>
  );
}

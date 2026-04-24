import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import './BaseChart.css';

type BaseChartProps = {
  option: EChartsOption;
  height?: number;
  className?: string;
};

export function BaseChart({ option, height = 320, className = '' }: BaseChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 옵션 변경마다 차트 인스턴스를 다시 맞추고 종료 시 정리한다.
    const chart = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
    chart.setOption({ aria: { enabled: true }, ...option }, true);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [option]);

  return <div ref={chartRef} className={`chart ${className}`.trim()} style={{ width: '100%', height }} />;
}

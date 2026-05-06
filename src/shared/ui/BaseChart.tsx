import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import type { EChartsOption, EChartsType } from 'echarts';
import { HOURLY_CHART_SLOT_WIDTH } from '../utils/hourlyChartSlots';
import './BaseChart.css';

type BaseChartProps = {
  option: EChartsOption;
  height?: number;
  minWidth?: number | string;
  maxWidth?: number | string;
  scrollable?: boolean;
  scrollToCurrentTime?: boolean;
  legendItems?: ChartLegendItem[];
  yAxisLabel?: string;
  className?: string;
};

export type ChartLegendItem = {
  name: string;
  type?: 'bar' | 'line';
  color?: string;
};

type LegendOptionLike = {
  show?: boolean;
  data?: unknown;
  selectedMode?: boolean | 'single' | 'multiple';
  selected?: Record<string, boolean>;
  [key: string]: unknown;
};

function withLegendSelection(option: EChartsOption, legendItems: ChartLegendItem[] | undefined, disabledLegends: Set<string>): EChartsOption {
  if (!legendItems || legendItems.length === 0) {
    return option;
  }

  const selected = Object.fromEntries(legendItems.map((item) => [item.name, !disabledLegends.has(item.name)]));
  const data = legendItems.map((item) => item.name);
  const legend = option.legend as LegendOptionLike | LegendOptionLike[] | undefined;

  if (Array.isArray(legend)) {
    return {
      ...option,
      legend: legend.map((item) => ({
        ...item,
        data: item.data ?? data,
        selectedMode: item.selectedMode ?? true,
        selected: { ...((item.selected as Record<string, boolean> | undefined) ?? {}), ...selected }
      })) as EChartsOption['legend']
    };
  }

  return {
    ...option,
    legend: {
      ...(legend ?? {}),
      show: legend?.show ?? false,
      data: legend?.data ?? data,
      selectedMode: legend?.selectedMode ?? true,
      selected: { ...((legend?.selected as Record<string, boolean> | undefined) ?? {}), ...selected }
    } as EChartsOption['legend']
  };
}

/*
 * 필요: Apache ECharts Community 차트를 화면마다 같은 래퍼로 렌더링한다.
 * 연결: 각 feature summary/result section의 ECharts option.
 * 설명: 데이터와 옵션은 section에서 받고, resize와 로딩 표시는 공통 처리한다.
 * 수정: 차트 높이, 최소 폭, 스크롤 여부는 호출부 props에서 조정한다.
 */
export function BaseChart({
  option,
  height = 320,
  minWidth,
  maxWidth,
  scrollable = false,
  scrollToCurrentTime = false,
  legendItems,
  yAxisLabel,
  className = ''
}: BaseChartProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<EChartsType | null>(null);
  const latestOptionRef = useRef<EChartsOption>({ aria: { enabled: true }, ...option });
  const resizeFrameRef = useRef<number | null>(null);
  const layoutResizeTimerRef = useRef<number | null>(null);
  const scrollIdleTimerRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const dragStateRef = useRef({
    isPointerDown: false,
    startX: 0,
    scrollLeft: 0
  });
  const [loading, setLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [disabledLegends, setDisabledLegends] = useState<Set<string>>(() => new Set());
  // 1920 기준 차트 폭을 유지하되 좁은 화면에서는 래퍼 스크롤로 보호한다.
  const chartMinWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;
  const chartMaxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  const yAxisLabelLines = yAxisLabel?.split(' ').filter(Boolean) ?? [];
  const legendKey = legendItems?.map((item) => item.name).join('|') ?? '';
  const optionWithLegendSelection = useMemo(
    () => withLegendSelection(option, legendItems, disabledLegends),
    [disabledLegends, legendItems, option]
  );
  const chartOption = useMemo<EChartsOption>(() => ({ aria: { enabled: true }, ...optionWithLegendSelection }), [optionWithLegendSelection]);
  const requestChartResize = useCallback(() => {
    if (resizeFrameRef.current !== null) {
      return;
    }

    resizeFrameRef.current = window.requestAnimationFrame(() => {
      resizeFrameRef.current = null;
      chartInstanceRef.current?.resize();
    });
  }, []);

  useEffect(() => {
    setDisabledLegends(new Set());
  }, [legendKey]);

  useEffect(() => {
    if (!scrollable || !scrollToCurrentTime || !scrollRef.current) {
      return;
    }

    const scrollElement = scrollRef.current;
    const currentHour = new Date().getHours();
    const contentWidth = scrollElement.scrollWidth;
    const slotWidth = contentWidth >= HOURLY_CHART_SLOT_WIDTH * 24 ? contentWidth / 24 : HOURLY_CHART_SLOT_WIDTH;
    const targetLeft = currentHour * slotWidth - scrollElement.clientWidth * 0.55;

    scrollElement.scrollLeft = Math.max(0, targetLeft);
  }, [chartMinWidth, scrollable, scrollToCurrentTime]);

  useEffect(
    () => () => {
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }
      if (layoutResizeTimerRef.current !== null) {
        window.clearTimeout(layoutResizeTimerRef.current);
      }
    },
    []
  );

  const handleScroll = () => {
    if (!scrollable) {
      return;
    }

    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      setIsScrolling(true);
    }

    if (scrollIdleTimerRef.current !== null) {
      window.clearTimeout(scrollIdleTimerRef.current);
    }

    scrollIdleTimerRef.current = window.setTimeout(() => {
      isScrollingRef.current = false;
      setIsScrolling(false);
      scrollIdleTimerRef.current = null;
    }, 700);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollable || !scrollRef.current || scrollRef.current.scrollWidth <= scrollRef.current.clientWidth) {
      return;
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      isPointerDown: true,
      startX: event.clientX,
      scrollLeft: scrollRef.current.scrollLeft
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isPointerDown || !scrollRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    scrollRef.current.scrollLeft = dragStateRef.current.scrollLeft - deltaX;
    event.preventDefault();
  };

  const stopDragScroll = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isPointerDown) {
      return;
    }

    dragStateRef.current.isPointerDown = false;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    setLoading(true);

    const handlePrintResize = () => {
      requestChartResize();
      window.setTimeout(requestChartResize, 120);
    };

    window.addEventListener('resize', requestChartResize);
    window.addEventListener('beforeprint', handlePrintResize);
    window.addEventListener('afterprint', handlePrintResize);
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(requestChartResize);
      resizeObserver.observe(chartRef.current);
    }

    // ECharts는 무거운 라이브러리라 차트 영역에서만 지연 로딩한다.
    import('echarts').then((echarts) => {
      if (!chartRef.current || disposed) return;

      const chart = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
      chartInstanceRef.current = chart;
      chart.setOption(latestOptionRef.current, true);
      setLoading(false);
      requestChartResize();
    });

    return () => {
      disposed = true;
      window.removeEventListener('resize', requestChartResize);
      window.removeEventListener('beforeprint', handlePrintResize);
      window.removeEventListener('afterprint', handlePrintResize);
      resizeObserver?.disconnect();
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, [requestChartResize]);

  useEffect(() => {
    latestOptionRef.current = chartOption;
    chartInstanceRef.current?.setOption(chartOption, false);
    requestChartResize();
  }, [chartOption, requestChartResize]);

  useEffect(() => {
    requestChartResize();

    if (layoutResizeTimerRef.current !== null) {
      window.clearTimeout(layoutResizeTimerRef.current);
    }

    layoutResizeTimerRef.current = window.setTimeout(() => {
      requestChartResize();
      layoutResizeTimerRef.current = null;
    }, 160);
  }, [chartMaxWidth, chartMinWidth, height, requestChartResize]);

  return (
    <>
      <div className={`chart-frame ${yAxisLabel ? 'chart-frame--with-y-axis-label' : ''}`.trim()}>
        {yAxisLabel && (
          <span className="chart-fixed-y-axis-label" aria-hidden="true">
            {yAxisLabelLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        )}
        <div
          ref={scrollRef}
          className={`chart-box ${scrollable ? 'chart-box--scroll' : ''} ${isScrolling ? 'chart-box--scrolling' : ''} ${isDragging ? 'chart-box--dragging' : ''}`.trim()}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragScroll}
          onPointerCancel={stopDragScroll}
        >
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
            style={{ width: '100%', height, minWidth: chartMinWidth, maxWidth: chartMaxWidth }}
          />
        </div>
      </div>
      {legendItems && legendItems.length > 0 && (
        <div className="chart-fixed-legend" aria-label="차트 범례">
          {legendItems.map((item, index) => (
            <button
              type="button"
              className={`chart-fixed-legend__item ${disabledLegends.has(item.name) ? 'is-disabled' : ''}`.trim()}
              key={`${item.name}-${index}`}
              aria-pressed={!disabledLegends.has(item.name)}
              onClick={() => {
                setDisabledLegends((previous) => {
                  const next = new Set(previous);

                  if (next.has(item.name)) {
                    next.delete(item.name);
                  } else {
                    next.add(item.name);
                  }

                  return next;
                });
              }}
            >
              <span
                className={`chart-fixed-legend__marker chart-fixed-legend__marker--${item.type ?? 'bar'}`}
                style={{ backgroundColor: (item.type ?? 'bar') === 'bar' ? item.color : undefined }}
              >
                {(item.type ?? 'bar') === 'line' && (
                  <span className="chart-fixed-legend__line" style={{ backgroundColor: item.color }} />
                )}
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

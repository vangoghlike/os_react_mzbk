import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import type { EChartsOption, EChartsType } from 'echarts';
import { FULL_DAY_TIME_CHART_MAX_WIDTH, HOURLY_CHART_SLOT_WIDTH } from '../utils/hourlyChartSlots';
import './BaseChart.css';

type BaseChartProps = {
  option: EChartsOption;
  height?: number;
  minWidth?: number | string;
  maxWidth?: number | string;
  scrollable?: boolean;
  fullDay?: boolean;
  categoryCount?: number;
  scrollToCurrentTime?: boolean;
  legendItems?: ChartLegendItem[];
  yAxisLabel?: string;
  axisLegendGap?: number;
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

const COMMON_CONTENT_GAP_CSS_VAR = '--mzbk-common-content-gap';
const DEFAULT_AXIS_LEGEND_GAP = 37;
const CATEGORY_ZOOM_GRID_BOTTOM = 56;
const CATEGORY_ZOOM_SLIDER_BOTTOM = 14;
const CATEGORY_SLIDER_IDLE_TRACK = 'rgba(150, 160, 182, 0.012)';
const CATEGORY_SLIDER_IDLE_FILL = 'rgba(150, 160, 182, 0.04)';
const CATEGORY_SLIDER_ACTIVE_TRACK = 'rgba(150, 160, 182, 0.08)';
const CATEGORY_SLIDER_ACTIVE_FILL = 'rgba(150, 160, 182, 0.26)';
const CHART_ANIMATION_DURATION_MS = 850;

type AxisOptionLike = {
  data?: unknown[];
  axisLabel?: AxisLabelOptionLike | AxisLabelOptionLike[];
};

type AxisLabelOptionLike = {
  show?: boolean;
  margin?: unknown;
  fontSize?: unknown;
};

type GridOptionLike = {
  bottom?: unknown;
};

type DataZoomOptionLike = {
  type?: string;
  xAxisIndex?: number;
  startValue?: number;
  endValue?: number;
  [key: string]: unknown;
};

type ValueAxisOptionLike = {
  type?: string;
  min?: unknown;
  max?: unknown;
  interval?: unknown;
  splitNumber?: unknown;
  [key: string]: unknown;
};

type SeriesOptionLike = {
  id?: unknown;
  name?: unknown;
  data?: unknown[];
  type?: unknown;
  [key: string]: unknown;
};

type ZrDisplayElementLike = {
  type?: string;
  style?: { text?: unknown };
  getBoundingRect?: () => { x: number; y: number; width: number; height: number };
  transformCoordToGlobal?: (x: number, y: number) => [number, number];
};

function getFirstOptionItem<T>(value: T | T[] | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getOptionNumber(value: unknown, baseValue?: number) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.endsWith('%') && baseValue !== undefined) {
    const percentage = Number.parseFloat(trimmedValue);

    return Number.isFinite(percentage) ? (baseValue * percentage) / 100 : undefined;
  }

  const numericValue = Number.parseFloat(trimmedValue);

  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function getAxisLabelTextCandidates(option: EChartsOption) {
  const xAxis = getFirstOptionItem((option as { xAxis?: AxisOptionLike | AxisOptionLike[] }).xAxis);
  const labels = new Set<string>();

  (xAxis?.data ?? []).forEach((label) => {
    const labelText = String(label);
    labels.add(labelText);

    const fullHourMatch = labelText.match(/^(\d{2}):00$/);
    if (fullHourMatch) {
      labels.add(fullHourMatch[1]);
    }
  });

  return labels;
}

function getCategoryAxisCount(option: EChartsOption) {
  const xAxis = getFirstOptionItem((option as { xAxis?: AxisOptionLike | AxisOptionLike[] }).xAxis);

  return Array.isArray(xAxis?.data) ? xAxis.data.length : 0;
}

function getDataZoomItems(option: EChartsOption) {
  const dataZoom = (option as { dataZoom?: DataZoomOptionLike | DataZoomOptionLike[] }).dataZoom;

  if (!dataZoom) {
    return [];
  }

  return Array.isArray(dataZoom) ? dataZoom : [dataZoom];
}

function getCategorySliderColorPatch(active: boolean) {
  return {
    backgroundColor: active ? CATEGORY_SLIDER_ACTIVE_TRACK : CATEGORY_SLIDER_IDLE_TRACK,
    fillerColor: active ? CATEGORY_SLIDER_ACTIVE_FILL : CATEGORY_SLIDER_IDLE_FILL
  };
}

function getSeriesValue(value: unknown) {
  if (typeof value === 'number') {
    return value;
  }

  if (Array.isArray(value)) {
    const lastValue = value.at(-1);
    return typeof lastValue === 'number' ? lastValue : null;
  }

  if (value && typeof value === 'object' && 'value' in value) {
    const nestedValue = (value as { value?: unknown }).value;

    return typeof nestedValue === 'number' ? nestedValue : null;
  }

  return null;
}

function hasFiniteSeriesValue(option: EChartsOption) {
  const seriesItems = ((option as { series?: SeriesOptionLike | SeriesOptionLike[] }).series ?? []) as SeriesOptionLike | SeriesOptionLike[];
  const seriesList = Array.isArray(seriesItems) ? seriesItems : [seriesItems];

  return seriesList.some((series) => (series.data ?? []).some((value) => {
    const numericValue = getSeriesValue(value);
    return typeof numericValue === 'number' && Number.isFinite(numericValue);
  }));
}

function readRootPixelVariable(name: string, fallback: number) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(name);
  const numericValue = Number.parseFloat(rawValue);

  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function getSeriesIdentity(series: SeriesOptionLike, index: number) {
  if (typeof series.id === 'string' || typeof series.id === 'number') {
    return series.id;
  }

  const type = typeof series.type === 'string' ? series.type : 'series';
  const name = typeof series.name === 'string' || typeof series.name === 'number' ? series.name : index;

  return `base-chart-${type}-${name}`;
}

function withStableDataIdentity(data: unknown[] | undefined) {
  if (!Array.isArray(data)) {
    return data;
  }

  return data.map((item) => {
    if (!item || typeof item !== 'object' || 'id' in item || !('name' in item)) {
      return item;
    }

    const name = (item as { name?: unknown }).name;

    if (typeof name !== 'string' && typeof name !== 'number') {
      return item;
    }

    return { ...item, id: String(name) };
  });
}

function withSeriesAnimationDefaults(option: EChartsOption): EChartsOption {
  const seriesItems = (option as { series?: SeriesOptionLike | SeriesOptionLike[] }).series;

  if (!seriesItems) {
    return option;
  }

  const patchSeries = (series: SeriesOptionLike, index: number) => ({
    ...series,
    id: getSeriesIdentity(series, index),
    data: withStableDataIdentity(series.data),
    animation: true,
    animationDuration: CHART_ANIMATION_DURATION_MS,
    animationDurationUpdate: CHART_ANIMATION_DURATION_MS,
    animationEasing: 'cubicOut',
    animationEasingUpdate: 'cubicOut'
  });

  return {
    ...option,
    series: Array.isArray(seriesItems) ? seriesItems.map(patchSeries) : patchSeries(seriesItems, 0)
  } as EChartsOption;
}

function withValueAxisFallback(option: EChartsOption): EChartsOption {
  if (hasFiniteSeriesValue(option)) {
    return option;
  }

  const yAxis = (option as { yAxis?: ValueAxisOptionLike | ValueAxisOptionLike[] }).yAxis;
  const patchAxis = (axis: ValueAxisOptionLike = {}) => ({
    ...axis,
    type: axis.type ?? 'value',
    min: typeof axis.min === 'number' ? axis.min : 0,
    max: typeof axis.max === 'number' ? axis.max : 100,
    interval: typeof axis.interval === 'number' ? axis.interval : 20,
    splitNumber: typeof axis.splitNumber === 'number' ? axis.splitNumber : 5
  });

  return {
    ...option,
    yAxis: Array.isArray(yAxis) ? yAxis.map((axis) => patchAxis(axis)) : patchAxis(yAxis)
  } as EChartsOption;
}

function withNativeChartAnimation(option: EChartsOption): EChartsOption {
  return {
    ...withSeriesAnimationDefaults(option),
    animation: true,
    animationDuration: CHART_ANIMATION_DURATION_MS,
    animationDurationUpdate: CHART_ANIMATION_DURATION_MS,
    animationEasing: 'cubicOut',
    animationEasingUpdate: 'cubicOut',
    animationThreshold: 2000
  };
}

function withCategoryDataZoom(
  option: EChartsOption,
  enabled: boolean,
  totalCount: number,
  visibleCount: number,
  alignToCurrentHour: boolean
): EChartsOption {
  if (!enabled || totalCount <= visibleCount) {
    return option;
  }

  const currentHour = new Date().getHours();
  const resolvedVisibleCount = Math.min(totalCount, visibleCount);
  const resolvedMaxStartValue = Math.max(0, totalCount - resolvedVisibleCount);
  const startValue = alignToCurrentHour ? Math.min(resolvedMaxStartValue, Math.max(0, currentHour - Math.floor(resolvedVisibleCount / 2))) : 0;
  const endValue = Math.min(totalCount - 1, startValue + resolvedVisibleCount - 1);
  const existingDataZoom = getDataZoomItems(option).filter((item) => item.type !== 'inside' && item.type !== 'slider');
  const grid = (option as { grid?: GridOptionLike | GridOptionLike[] }).grid;
  const patchGrid = (gridOption: GridOptionLike = {}) => ({
    ...gridOption,
    bottom: Math.max(getOptionNumber(gridOption.bottom) ?? 0, CATEGORY_ZOOM_GRID_BOTTOM)
  });

  return {
    ...option,
    grid: Array.isArray(grid) ? grid.map((gridOption) => patchGrid(gridOption)) : patchGrid(grid),
    dataZoom: [
      ...existingDataZoom,
      {
        type: 'inside',
        xAxisIndex: 0,
        startValue,
        endValue,
        zoomLock: true,
        filterMode: 'none',
        moveOnMouseMove: true,
        moveOnMouseWheel: true,
        preventDefaultMouseMove: true
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        startValue,
        endValue,
        zoomLock: true,
        filterMode: 'none',
        realtime: true,
        height: 3,
        bottom: CATEGORY_ZOOM_SLIDER_BOTTOM,
        borderColor: 'transparent',
        backgroundColor: CATEGORY_SLIDER_IDLE_TRACK,
        fillerColor: CATEGORY_SLIDER_IDLE_FILL,
        handleSize: 0,
        moveHandleSize: 0,
        emphasis: {
          fillerColor: 'rgba(150, 160, 182, 0.26)'
        },
        brushSelect: false,
        showDetail: false,
        showDataShadow: false,
        dataBackground: {
          lineStyle: { opacity: 0 },
          areaStyle: { opacity: 0 }
        },
        selectedDataBackground: {
          lineStyle: { opacity: 0 },
          areaStyle: { opacity: 0 }
        },
        textStyle: { color: 'transparent' }
      }
    ] as EChartsOption['dataZoom']
  };
}

function getEstimatedAxisLabelBottom(chartElement: HTMLElement, option: EChartsOption) {
  const xAxis = getFirstOptionItem((option as { xAxis?: AxisOptionLike | AxisOptionLike[] }).xAxis);
  const axisLabel = getFirstOptionItem(xAxis?.axisLabel);

  if (!xAxis || axisLabel?.show === false) {
    return null;
  }

  const grid = getFirstOptionItem((option as { grid?: GridOptionLike | GridOptionLike[] }).grid);
  const chartHeight = chartElement.clientHeight;
  const bottomInset = getOptionNumber(grid?.bottom, chartHeight) ?? 0;
  const labelMargin = getOptionNumber(axisLabel?.margin) ?? 8;
  const labelFontSize = getOptionNumber(axisLabel?.fontSize) ?? 12;
  const labelBottom = chartHeight - bottomInset + labelMargin + labelFontSize;

  return Math.min(chartHeight, Math.max(0, labelBottom));
}

function getAxisLabelBottom(chart: EChartsType, chartElement: HTMLElement, option: EChartsOption) {
  const labelCandidates = getAxisLabelTextCandidates(option);

  if (labelCandidates.size === 0) {
    return getEstimatedAxisLabelBottom(chartElement, option);
  }

  const displayList = ((chart as unknown as { getZr?: () => { storage?: { getDisplayList?: () => unknown[] } } }).getZr?.().storage?.getDisplayList?.() ??
    []) as ZrDisplayElementLike[];
  let labelBottom = Number.NEGATIVE_INFINITY;

  displayList.forEach((element) => {
    const text = String(element.style?.text ?? '');

    if (!labelCandidates.has(text)) {
      return;
    }

    const rect = element.getBoundingRect?.();
    if (!rect) {
      return;
    }

    const bottomPoint = element.transformCoordToGlobal?.(rect.x, rect.y + rect.height);
    labelBottom = Math.max(labelBottom, bottomPoint?.[1] ?? rect.y + rect.height);
  });

  return Number.isFinite(labelBottom) ? labelBottom : getEstimatedAxisLabelBottom(chartElement, option);
}

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
  fullDay = false,
  categoryCount,
  scrollToCurrentTime = false,
  legendItems,
  yAxisLabel,
  axisLegendGap,
  className = ''
}: BaseChartProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<EChartsType | null>(null);
  const latestOptionRef = useRef<EChartsOption>({ aria: { enabled: true }, ...option });
  const latestViewportWidthRef = useRef(0);
  const resizeFrameRef = useRef<number | null>(null);
  const layoutResizeTimersRef = useRef<number[]>([]);
  const layoutWatchIntervalRef = useRef<number | null>(null);
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
  const [axisLegendStyle, setAxisLegendStyle] = useState<{ marginTop: number; marginBottom: number } | undefined>(undefined);
  const [scrollIndicatorStyle, setScrollIndicatorStyle] = useState<{ width: number; left: number } | undefined>(undefined);
  const [chartViewportWidth, setChartViewportWidth] = useState(0);
  const [rootContentGap, setRootContentGap] = useState(DEFAULT_AXIS_LEGEND_GAP);
  // 24시간 차트는 2560 기준 폭을 유지하고, 좁은 화면에서는 그래프 본체만 스크롤한다.
  const isChartScrollable = scrollable;
  const shouldScrollToCurrentTime = scrollToCurrentTime;
  const categoryMinWidth =
    typeof categoryCount === 'number' && categoryCount > 0 ? Math.min(FULL_DAY_TIME_CHART_MAX_WIDTH, categoryCount * HOURLY_CHART_SLOT_WIDTH) : undefined;
  const categoryAxisCount = categoryCount ?? getCategoryAxisCount(option);
  const categorySlotWidth = fullDay ? FULL_DAY_TIME_CHART_MAX_WIDTH / 24 : HOURLY_CHART_SLOT_WIDTH;
  const measuredViewportWidth = chartViewportWidth || (fullDay ? 1536 : 1120);
  const visibleCategoryCount = Math.max(1, Math.min(categoryAxisCount, Math.floor(measuredViewportWidth / categorySlotWidth)));
  const shouldUseCategoryDataZoom = !scrollable && categoryAxisCount > visibleCategoryCount && (fullDay || Boolean(categoryCount));
  const numericMinWidth = typeof minWidth === 'number' ? minWidth : undefined;
  const resolvedMinWidth = shouldUseCategoryDataZoom || fullDay ? '100%' : categoryMinWidth ? Math.max(numericMinWidth ?? 0, categoryMinWidth) : minWidth;
  const resolvedMaxWidth = fullDay ? FULL_DAY_TIME_CHART_MAX_WIDTH : categoryMinWidth ? FULL_DAY_TIME_CHART_MAX_WIDTH : maxWidth;
  const chartMinWidth = typeof resolvedMinWidth === 'number' ? `${resolvedMinWidth}px` : resolvedMinWidth;
  const chartMaxWidth = typeof resolvedMaxWidth === 'number' ? `${resolvedMaxWidth}px` : resolvedMaxWidth;
  const yAxisLabelLines = yAxisLabel?.split(' ').filter(Boolean) ?? [];
  const resolvedAxisLegendGap = axisLegendGap ?? rootContentGap;
  const legendKey = legendItems?.map((item) => item.name).join('|') ?? '';
  const optionWithLegendSelection = useMemo(
    () => withLegendSelection(option, legendItems, disabledLegends),
    [disabledLegends, legendItems, option]
  );
  const chartOption = useMemo<EChartsOption>(
    () =>
      withCategoryDataZoom(
        withNativeChartAnimation(withValueAxisFallback({ aria: { enabled: true }, ...optionWithLegendSelection })),
        shouldUseCategoryDataZoom,
        categoryAxisCount,
        visibleCategoryCount,
        shouldScrollToCurrentTime
      ),
    [categoryAxisCount, optionWithLegendSelection, shouldScrollToCurrentTime, shouldUseCategoryDataZoom, visibleCategoryCount]
  );
  const updateScrollIndicator = useCallback(() => {
    if (!scrollRef.current || scrollRef.current.scrollWidth <= scrollRef.current.clientWidth) {
      setScrollIndicatorStyle(undefined);
      return;
    }

    const { clientWidth, scrollLeft, scrollWidth } = scrollRef.current;
    const width = Math.max(32, (clientWidth / scrollWidth) * clientWidth);
    const maxLeft = clientWidth - width;
    const left = maxLeft <= 0 ? 0 : (scrollLeft / (scrollWidth - clientWidth)) * maxLeft;

    setScrollIndicatorStyle((previousStyle) => {
      const nextStyle = { width: Math.round(width), left: Math.round(left) };
      return previousStyle?.width === nextStyle.width && previousStyle.left === nextStyle.left ? previousStyle : nextStyle;
    });
  }, []);
  const updateAxisLegendStyle = useCallback(() => {
    if (!chartInstanceRef.current || !chartRef.current || !legendItems?.length || !(latestOptionRef.current as { xAxis?: unknown }).xAxis) {
      setAxisLegendStyle(undefined);
      return;
    }

    const labelBottom = getAxisLabelBottom(chartInstanceRef.current, chartRef.current, latestOptionRef.current);

    if (labelBottom === null) {
      setAxisLegendStyle(undefined);
      return;
    }

    const innerBottomGap = Math.max(0, chartRef.current.clientHeight - labelBottom);
    const nextStyle = { marginTop: Math.round(resolvedAxisLegendGap - innerBottomGap), marginBottom: 0 };

    setAxisLegendStyle((previousStyle) =>
      previousStyle?.marginTop === nextStyle.marginTop && previousStyle.marginBottom === nextStyle.marginBottom ? previousStyle : nextStyle
    );
  }, [legendItems?.length, resolvedAxisLegendGap]);
  const requestChartResize = useCallback(() => {
    if (resizeFrameRef.current !== null) {
      return;
    }

    resizeFrameRef.current = window.requestAnimationFrame(() => {
      resizeFrameRef.current = null;
      const nextViewportWidth = scrollRef.current?.clientWidth ?? chartRef.current?.clientWidth ?? rootRef.current?.clientWidth ?? 0;
      const nextViewportHeight = chartRef.current?.clientHeight ?? 0;
      latestViewportWidthRef.current = nextViewportWidth;
      setChartViewportWidth((previousWidth) => (previousWidth === nextViewportWidth ? previousWidth : nextViewportWidth));
      chartInstanceRef.current?.resize({
        width: nextViewportWidth || undefined,
        height: nextViewportHeight || undefined
      });
      updateScrollIndicator();
      updateAxisLegendStyle();
    });
  }, [updateAxisLegendStyle, updateScrollIndicator]);
  const requestLayoutRefresh = useCallback(() => {
    layoutResizeTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    layoutResizeTimersRef.current = [];
    requestChartResize();
    [80, 180, 360, 700, 1100].forEach((delay) => {
      const timerId = window.setTimeout(() => {
        requestChartResize();
      }, delay);
      layoutResizeTimersRef.current.push(timerId);
    });
  }, [requestChartResize]);
  const setCategorySliderActive = useCallback((active: boolean) => {
    const chart = chartInstanceRef.current;

    if (!chart || !shouldUseCategoryDataZoom) {
      return;
    }

    const currentOption = chart.getOption() as { dataZoom?: DataZoomOptionLike[] };
    const dataZoom = currentOption.dataZoom ?? [];

    if (!dataZoom.some((item) => item.type === 'slider')) {
      return;
    }

    chart.setOption(
      {
        dataZoom: dataZoom.map((item) => (item.type === 'slider' ? { ...item, ...getCategorySliderColorPatch(active) } : item))
      },
      false
    );
  }, [shouldUseCategoryDataZoom]);
  useEffect(() => {
    setDisabledLegends(new Set());
  }, [legendKey]);

  useEffect(() => {
    setRootContentGap(readRootPixelVariable(COMMON_CONTENT_GAP_CSS_VAR, DEFAULT_AXIS_LEGEND_GAP));
  }, []);

  useEffect(() => {
    if (!isChartScrollable || !shouldScrollToCurrentTime || !scrollRef.current) {
      return;
    }

    const scrollElement = scrollRef.current;
    const currentHour = new Date().getHours();
    const contentWidth = scrollElement.scrollWidth;
    const slotWidth = contentWidth >= HOURLY_CHART_SLOT_WIDTH * 24 ? contentWidth / 24 : HOURLY_CHART_SLOT_WIDTH;
    const targetLeft = currentHour * slotWidth - scrollElement.clientWidth * 0.55;

    scrollElement.scrollLeft = Math.max(0, targetLeft);
  }, [chartMinWidth, isChartScrollable, shouldScrollToCurrentTime]);

  useEffect(
    () => () => {
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
      if (layoutWatchIntervalRef.current !== null) {
        window.clearInterval(layoutWatchIntervalRef.current);
        layoutWatchIntervalRef.current = null;
      }
      layoutResizeTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      layoutResizeTimersRef.current = [];
    },
    []
  );

  const handleScroll = () => {
    if (!isChartScrollable) {
      return;
    }

    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      setIsScrolling(true);
    }

    updateScrollIndicator();

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
    if (shouldUseCategoryDataZoom) {
      setCategorySliderActive(true);
      return;
    }

    if (!isChartScrollable || !scrollRef.current || scrollRef.current.scrollWidth <= scrollRef.current.clientWidth) {
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
    updateScrollIndicator();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isPointerDown || !scrollRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    scrollRef.current.scrollLeft = dragStateRef.current.scrollLeft - deltaX;
    updateScrollIndicator();
    event.preventDefault();
  };

  const stopDragScroll = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldUseCategoryDataZoom) {
      setCategorySliderActive(false);
      return;
    }

    if (!dragStateRef.current.isPointerDown) {
      return;
    }

    dragStateRef.current.isPointerDown = false;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const handlePointerLeave = () => {
    if (shouldUseCategoryDataZoom) {
      setCategorySliderActive(false);
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    setLoading(true);

    const handlePrintResize = () => {
      requestLayoutRefresh();
    };

    window.addEventListener('resize', requestLayoutRefresh);
    window.addEventListener('orientationchange', requestLayoutRefresh);
    window.visualViewport?.addEventListener('resize', requestLayoutRefresh);
    document.addEventListener('click', requestLayoutRefresh, true);
    document.addEventListener('pointerup', requestLayoutRefresh, true);
    document.addEventListener('transitionend', requestLayoutRefresh, true);
    document.addEventListener('animationend', requestLayoutRefresh, true);
    window.addEventListener('beforeprint', handlePrintResize);
    window.addEventListener('afterprint', handlePrintResize);
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(requestLayoutRefresh);
      if (rootRef.current) {
        resizeObserver.observe(rootRef.current);
      }
      resizeObserver.observe(chartRef.current);
      if (scrollRef.current) {
        resizeObserver.observe(scrollRef.current);
      }
      if (chartRef.current.parentElement) {
        resizeObserver.observe(chartRef.current.parentElement);
      }
    }
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(requestLayoutRefresh);
      mutationObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    layoutWatchIntervalRef.current = window.setInterval(() => {
      const viewportWidth = scrollRef.current?.clientWidth ?? chartRef.current?.clientWidth ?? rootRef.current?.clientWidth ?? 0;
      const canvasWidth = chartRef.current?.querySelector('canvas')?.getBoundingClientRect().width ?? 0;

      if (Math.abs(viewportWidth - latestViewportWidthRef.current) > 1 || (canvasWidth > 0 && Math.abs(canvasWidth - viewportWidth) > 1)) {
        requestLayoutRefresh();
      }
    }, 250);

    // ECharts는 무거운 라이브러리라 차트 영역에서만 지연 로딩한다.
    import('echarts').then((echarts) => {
      if (!chartRef.current || disposed) return;

      const chart = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
      chartInstanceRef.current = chart;
      chart.setOption(latestOptionRef.current, true);
      setLoading(false);
      requestLayoutRefresh();
    });

    return () => {
      disposed = true;
      window.removeEventListener('resize', requestLayoutRefresh);
      window.removeEventListener('orientationchange', requestLayoutRefresh);
      window.visualViewport?.removeEventListener('resize', requestLayoutRefresh);
      document.removeEventListener('click', requestLayoutRefresh, true);
      document.removeEventListener('pointerup', requestLayoutRefresh, true);
      document.removeEventListener('transitionend', requestLayoutRefresh, true);
      document.removeEventListener('animationend', requestLayoutRefresh, true);
      window.removeEventListener('beforeprint', handlePrintResize);
      window.removeEventListener('afterprint', handlePrintResize);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      if (layoutWatchIntervalRef.current !== null) {
        window.clearInterval(layoutWatchIntervalRef.current);
        layoutWatchIntervalRef.current = null;
      }
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, [requestLayoutRefresh]);

  useEffect(() => {
    latestOptionRef.current = chartOption;
    chartInstanceRef.current?.setOption(chartOption, false);
    requestLayoutRefresh();
    window.requestAnimationFrame(() => window.requestAnimationFrame(updateAxisLegendStyle));
  }, [chartOption, requestLayoutRefresh, updateAxisLegendStyle]);

  useEffect(() => {
    requestLayoutRefresh();
  }, [chartMaxWidth, chartMinWidth, height, requestLayoutRefresh]);

  return (
    <div ref={rootRef} className="chart-shell">
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
          className={`chart-box ${isChartScrollable ? 'chart-box--scroll' : ''} ${isScrolling ? 'chart-box--scrolling' : ''} ${isDragging ? 'chart-box--dragging' : ''}`.trim()}
          onScroll={handleScroll}
          onPointerDownCapture={handlePointerDown}
          onPointerMoveCapture={handlePointerMove}
          onPointerUpCapture={stopDragScroll}
          onPointerCancelCapture={stopDragScroll}
          onPointerLeave={handlePointerLeave}
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
        {isChartScrollable && scrollIndicatorStyle && (
          <span className={`chart-scroll-indicator ${isScrolling || isDragging ? 'is-active' : ''}`} aria-hidden="true">
            <span
              className="chart-scroll-indicator__thumb"
              style={{ width: scrollIndicatorStyle.width, transform: `translateX(${scrollIndicatorStyle.left}px)` }}
            />
          </span>
        )}
      </div>
      {legendItems && legendItems.length > 0 && (
        <div className="chart-fixed-legend" aria-label="차트 범례" style={axisLegendStyle}>
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
    </div>
  );
}

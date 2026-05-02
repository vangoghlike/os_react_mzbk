import './PageLoadingFallback.css';

type PageLoadingFallbackProps = {
  label?: string;
};

/*
 * 필요: lazy route가 불러와지는 동안 빈 화면 대신 공통 로딩 상태를 보여 준다.
 * 연결: app/router.tsx의 Suspense fallback.
 * 설명: 데이터 조회가 아니라 화면 코드 청크를 나눠 받는 동안의 퍼블리싱 로딩 UI다.
 * 수정: 문구는 props로 바꾸고 크기/색상은 PageLoadingFallback.css에서 조정한다.
 */
export function PageLoadingFallback({ label = '화면을 불러오는 중입니다.' }: PageLoadingFallbackProps) {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <div className="page-loading__content">
        <span className="page-loading__spinner" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <span className="page-loading__bar" aria-hidden="true" />
    </div>
  );
}

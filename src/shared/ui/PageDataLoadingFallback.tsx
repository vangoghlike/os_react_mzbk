import { useNavigationPageTitle } from '../navigation/useNavigationPageTitle';
import { PageLoadingFallback } from './PageLoadingFallback';

type PageDataLoadingFallbackProps = {
  title: string;
  preferMenuTitle?: boolean;
};

/*
 * 필요: 데이터 로딩 문구도 화면 제목과 같은 메뉴명 기준으로 맞춘다.
 * 연결: PageHeading, useNavigationPageTitle, PageLoadingFallback.
 * 설명: `/monitoring/diesel2`처럼 같은 컴포넌트를 쓰는 화면도 현재 메뉴명으로 로딩 문구를 만든다.
 * 수정: 로딩 문구 형식이 바뀌면 이 컴포넌트에서만 조정한다.
 */
export function PageDataLoadingFallback({ title, preferMenuTitle = true }: PageDataLoadingFallbackProps) {
  const displayTitle = useNavigationPageTitle(title, preferMenuTitle);

  return <PageLoadingFallback label={`${displayTitle} 데이터를 불러오는 중입니다.`} />;
}

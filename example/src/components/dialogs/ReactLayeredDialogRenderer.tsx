import { DialogsRenderer, type DialogStore } from 'react-layered-dialog';

type DialogRendererProps = {
  store: DialogStore;
};

/**
 * 애플리케이션 전역 다이얼로그를 렌더링하는 최소 래퍼입니다.
 * 필요에 따라 여기서 dimmed 처리나 포탈 전략 등을 확장할 수 있습니다.
 */
export const ReactLayeredDialogRenderer = ({ store }: DialogRendererProps) => {
  return <DialogsRenderer store={store} />;
};

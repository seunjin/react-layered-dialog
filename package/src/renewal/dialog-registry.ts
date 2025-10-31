import { createElement } from 'react';
import type { ComponentType } from 'react';
import type { DialogStore } from './dialog-store';
import type {
  DialogControllerContextValue,
  DialogRenderFn,
  DialogAsyncResult,
  OpenDialogOptions,
} from './types';

/**
 * 다이얼로그 컴포넌트를 정의할 때 사용하는 기본 시그니처입니다.
 * props 타입과 옵션 타입만 지정하면 나머지는 자동으로 추론됩니다.
 */
type DialogOptionsMarker<TOptions> = {
  /** @internal phantom type 연결용 */
  __dialogOptionsMarker?: (options: TOptions) => void;
};

export type DialogComponent<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TOptions extends Record<string, unknown> = Record<string, unknown>
> = ComponentType<TProps> & DialogOptionsMarker<TOptions>;

/**
 * 정의에 전달되는 입력은 props 객체이거나 컨트롤러 기반 팩토리입니다.
 */
export type DialogInput<TProps, TController> =
  | TProps
  | ((controller: TController) => TProps);

function isControllerFactory<TProps, TController>(
  input: DialogInput<TProps, TController>
): input is (controller: TController) => TProps {
  return typeof input === 'function';
}

/**
 * 정의된 다이얼로그 형태.
 */
export type DialogDefinition<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TOptions extends Record<string, unknown> = Record<string, unknown>,
  TController extends DialogControllerContextValue<TProps, TOptions> = DialogControllerContextValue<
    TProps,
    TOptions
  >
> = (input: DialogInput<TProps, TController>) => DialogRenderFn<TProps, TOptions>;

/**
 * 다이얼로그 정의에서 필요한 타입들을 추출하기 위한 유틸리티입니다.
 */
type DefinitionParams<D> = D extends DialogDefinition<
  infer TProps,
  infer TOptions,
  infer TController
>
  ? {
      props: TProps;
      options: TOptions;
      controller: TController;
    }
  : never;

/**
 * 다이얼로그 정의 하나로부터 생성되는 메서드 시그니처.
 */
export type DialogMethodFromDefinition<D> = DefinitionParams<D> extends infer P
  ? P extends DefinitionParams<D>
    ? (
        input: DialogInput<P['props'], P['controller']>,
        options?: OpenDialogOptions<P['options']>
      ) => Promise<DialogAsyncResult<P['props'], P['options']>>
    : never
  : never;

/**
 * 다이얼로그 컴포넌트를 등록 가능한 정의로 변환합니다.
 */
export function defineDialog<
  TProps extends Record<string, unknown>,
  TOptions extends Record<string, unknown> = Record<string, unknown>
>(component: DialogComponent<TProps, TOptions>): DialogDefinition<
  TProps,
  TOptions,
  DialogControllerContextValue<TProps, TOptions>
> {
  const definition: DialogDefinition<TProps, TOptions, DialogControllerContextValue<TProps, TOptions>> = (
    input
  ) => {
    const renderWithController: DialogRenderFn<TProps, TOptions> = (controller) => {
      const props = isControllerFactory(input) ? input(controller) : input;
      const ReactComponent = component as ComponentType<TProps>;
      return createElement(ReactComponent, props as TProps);
    };

    const sourceComponent = component as ComponentType<TProps> & { displayName?: string; name?: string };
    (renderWithController as { displayName?: string }).displayName =
      sourceComponent.displayName ?? (sourceComponent.name ? sourceComponent.name : 'DialogDefinition');

    return renderWithController;
  };

  return definition;
}

/**
 * 등록된 다이얼로그 정의로부터 고수준 API를 생성합니다.
 */
type AnyDialogDefinition = DialogDefinition<
  Record<string, unknown>,
  Record<string, unknown>,
  DialogControllerContextValue<Record<string, unknown>, Record<string, unknown>>
>;

type DialogApiBase = {
  store: DialogStore;
  open: DialogStore['open'];
  openAsync: DialogStore['openAsync'];
  close: DialogStore['close'];
  unmount: DialogStore['unmount'];
  closeAll: DialogStore['closeAll'];
  unmountAll: DialogStore['unmountAll'];
  update: DialogStore['updateState'];
};

export type DialogApi<TRegistry extends Record<string, AnyDialogDefinition>> = {
  store: DialogStore;
  open: DialogStore['open'];
  openAsync: DialogStore['openAsync'];
  close: DialogStore['close'];
  unmount: DialogStore['unmount'];
  closeAll: DialogStore['closeAll'];
  unmountAll: DialogStore['unmountAll'];
  update: DialogStore['updateState'];
} & {
  [K in keyof TRegistry]: DialogMethodFromDefinition<TRegistry[K]>;
};

export function createDialogApi<TRegistry extends Record<string, AnyDialogDefinition>>(
  store: DialogStore,
  registry: TRegistry
): DialogApi<TRegistry> {
  const open: DialogStore['open'] = (renderer, options) => store.open(renderer, options);
  const openAsync: DialogStore['openAsync'] = (renderer, options) => store.openAsync(renderer, options);
  const close: DialogStore['close'] = (id) => store.close(id);
  const unmount: DialogStore['unmount'] = (id) => store.unmount(id);
  const closeAll: DialogStore['closeAll'] = () => store.closeAll();
  const unmountAll: DialogStore['unmountAll'] = () => store.unmountAll();
  const update: DialogStore['updateState'] = (id, updater) => store.updateState(id, updater);

  const baseApi: DialogApiBase = {
    store,
    open,
    openAsync,
    close,
    unmount,
    closeAll,
    unmountAll,
    update,
  };

  const registryApi = {} as {
    [K in keyof TRegistry]: DialogMethodFromDefinition<TRegistry[K]>;
  };

  (Object.keys(registry) as Array<keyof TRegistry>).forEach((key) => {
    const definition = registry[key];

    type Params = DefinitionParams<TRegistry[typeof key]>;
    const method = ((input, options) => {
      const renderer = definition(input as DialogInput<Params['props'], Params['controller']>);
      return store.openAsync<Params['props'], Params['options']>(
        renderer,
        options as OpenDialogOptions<Params['options']>
      );
    }) as DialogMethodFromDefinition<TRegistry[typeof key]>;

    registryApi[key] = method;
  });

  return {
    ...baseApi,
    ...registryApi,
  } as DialogApi<TRegistry>;
}

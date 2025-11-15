import { createElement } from 'react';
import type { ComponentType } from 'react';
import type { DialogStore } from './store';
import type {
  DialogControllerContextValue,
  DialogRenderFn,
  DialogAsyncResult,
  DialogOpenResult,
  OpenDialogOptions,
} from './types';

/**
 * 다이얼로그 레지스트리 유틸리티.
 * 컴포넌트를 등록해 `createDialogApi`로 고수준 메서드를 생성하고,
 * 필요시 모드(동기/비동기)나 displayName을 지정할 수 있습니다.
 */
export type DialogMode = 'sync' | 'async';

export type DialogComponent<
  TProps extends Record<string, unknown> = Record<string, unknown>
> = ComponentType<TProps>;

export type DialogInput<TProps, TController> =
  | TProps
  | ((controller: TController) => TProps);

function isControllerFactory<TProps, TController>(
  input: DialogInput<TProps, TController>
): input is (controller: TController) => TProps {
  return typeof input === 'function';
}

export interface DialogDefinition<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TMode extends DialogMode = 'sync'
> {
  mode: TMode;
  render: (
    input: DialogInput<TProps, DialogControllerContextValue<TProps>>
  ) => DialogRenderFn<TProps>;
}

type DefinitionParams<D> = D extends DialogDefinition<
  infer TProps,
  infer TMode
>
  ? {
      props: TProps;
      mode: TMode;
    }
  : never;

export type DialogMethodFromDefinition<D> = DefinitionParams<D> extends infer P
  ? P extends DefinitionParams<D>
    ? P['mode'] extends 'sync'
      ? (
          input: DialogInput<
            P['props'],
            DialogControllerContextValue<P['props']>
          >,
          options?: OpenDialogOptions
        ) => DialogOpenResult<P['props']>
      : (
          input: DialogInput<
            P['props'],
            DialogControllerContextValue<P['props']>
          >,
          options?: OpenDialogOptions
        ) => Promise<DialogAsyncResult<P['props']>>
    : never
  : never;

export interface DefineDialogOptions<TMode extends DialogMode = DialogMode> {
  mode?: TMode;
  displayName?: string;
}

export function defineDialog<
  TProps extends Record<string, unknown>,
  TMode extends DialogMode = 'sync'
>(
  component: DialogComponent<TProps>,
  options?: DefineDialogOptions<TMode>
): DialogDefinition<TProps, TMode> {
  const mode = (options?.mode ?? 'sync') as TMode;

  const definition: DialogDefinition<TProps, TMode> = {
    mode,
    render: (input) => {
      const renderWithController: DialogRenderFn<TProps> = (controller) => {
        const props = isControllerFactory(input) ? input(controller) : input;
        const ReactComponent = component as ComponentType<TProps>;
        return createElement(ReactComponent, props as TProps);
      };

      const sourceComponent = component as ComponentType<TProps> & { displayName?: string; name?: string };
      const displayName =
        options?.displayName ?? sourceComponent.displayName ?? sourceComponent.name ?? 'DialogDefinition';
      (renderWithController as { displayName?: string }).displayName = displayName;

      return renderWithController;
    },
  };

  return definition;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRegistryEntry = RegistryEntry<any, DialogMode>;

type NormalizeRegistry<TRegistry extends Record<string, AnyRegistryEntry>> = {
  [K in keyof TRegistry]: TRegistry[K] extends DialogDefinition<infer P, infer M>
    ? DialogDefinition<P, M>
    : TRegistry[K] extends {
        component: DialogComponent<infer P>;
        mode?: infer M;
        displayName?: string;
      }
    ? DialogDefinition<P, M extends DialogMode ? M : 'sync'>
    : never;
};

type RegistryEntry<
  TProps extends Record<string, unknown>,
  TMode extends DialogMode
> =
  | DialogDefinition<TProps, TMode>
  | {
      component: DialogComponent<TProps>;
      mode?: TMode;
      displayName?: string;
    };

function normalizeDefinition<
  TProps extends Record<string, unknown>,
  TMode extends DialogMode = 'sync'
>(
  entry: RegistryEntry<TProps, TMode>
): DialogDefinition<TProps, TMode> {
  if ('render' in entry) {
    return entry;
  }

  return defineDialog(entry.component, {
    mode: entry.mode,
    displayName: entry.displayName,
  }) as DialogDefinition<TProps, TMode>;
}

type DialogApiBase = {
  store: DialogStore;
  open: DialogStore['open'];
  openAsync: DialogStore['openAsync'];
  close: DialogStore['close'];
  unmount: DialogStore['unmount'];
  closeAll: DialogStore['closeAll'];
  unmountAll: DialogStore['unmountAll'];
  update: DialogStore['update'];
};

export type DialogApi<TRegistry extends Record<string, AnyRegistryEntry>> = {
  store: DialogStore;
  open: DialogStore['open'];
  openAsync: DialogStore['openAsync'];
  close: DialogStore['close'];
  unmount: DialogStore['unmount'];
  closeAll: DialogStore['closeAll'];
  unmountAll: DialogStore['unmountAll'];
  update: DialogStore['update'];
} & {
  [K in keyof TRegistry]: DialogMethodFromDefinition<NormalizeRegistry<TRegistry>[K]>;
};

/**
 * 등록된 다이얼로그 정의로부터 고수준 API를 생성합니다.
 * 레지스트리 항목에 따라 `open` 또는 `openAsync` 호출을 자동으로 선택하며,
 * 기본 스토어 조작 메서드와 레지스트리 키별 생성된 메서드를 함께 반환합니다.
 */
export function createDialogApi<
  TRegistry extends Record<string, AnyRegistryEntry>
>(
  store: DialogStore,
  registry: TRegistry
): DialogApi<NormalizeRegistry<TRegistry>> {
  const open: DialogStore['open'] = (renderer, options) => store.open(renderer, options);
  const openAsync: DialogStore['openAsync'] = (renderer, options) => store.openAsync(renderer, options);
  const close: DialogStore['close'] = (id) => store.close(id);
  const unmount: DialogStore['unmount'] = (id) => store.unmount(id);
  const closeAll: DialogStore['closeAll'] = () => store.closeAll();
  const unmountAll: DialogStore['unmountAll'] = () => store.unmountAll();
  const update: DialogStore['update'] = (id, updater) => store.update(id, updater);

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
    [K in keyof TRegistry]: DialogMethodFromDefinition<NormalizeRegistry<TRegistry>[K]>;
  };

  (Object.keys(registry) as Array<keyof TRegistry>).forEach((key) => {
    const entry = registry[key];
    const definition = normalizeDefinition(entry) as NormalizeRegistry<TRegistry>[typeof key];

    type Params = DefinitionParams<NormalizeRegistry<TRegistry>[typeof key]>;
    const method = ((input: unknown, options?: unknown) => {
      const renderer = definition.render(
        input as DialogInput<
          Params['props'],
          DialogControllerContextValue<Params['props']>
        >
      );

      if (definition.mode === 'sync') {
        return store.open<Params['props']>(
          renderer,
          options as OpenDialogOptions
        );
      }

      return store.openAsync<Params['props']>(
        renderer,
        options as OpenDialogOptions
      );
    }) as DialogMethodFromDefinition<NormalizeRegistry<TRegistry>[typeof key]>;

    registryApi[key] = method;
  });

  return {
    ...baseApi,
    ...registryApi,
  } as DialogApi<NormalizeRegistry<TRegistry>>;
}

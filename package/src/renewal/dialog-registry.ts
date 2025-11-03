import { createElement } from 'react';
import type { ComponentType } from 'react';
import type { DialogStore } from './dialog-store';
import type {
  DialogControllerContextValue,
  DialogRenderFn,
  DialogAsyncResult,
  DialogOpenResult,
  OpenDialogOptions,
} from './types';

type DialogOptionsMarker<TOptions> = {
  /** @internal phantom type 연결용 */
  __dialogOptionsMarker?: (options: TOptions) => void;
};

export type DialogMode = 'sync' | 'async';

export type DialogComponent<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TOptions extends Record<string, unknown> = Record<string, unknown>
> = ComponentType<TProps> & DialogOptionsMarker<TOptions>;

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
  TOptions extends Record<string, unknown> = Record<string, unknown>,
  TMode extends DialogMode = 'sync'
> {
  mode: TMode;
  render: (
    input: DialogInput<TProps, DialogControllerContextValue<TProps, TOptions>>
  ) => DialogRenderFn<TProps, TOptions>;
}

type DefinitionParams<D> = D extends DialogDefinition<
  infer TProps,
  infer TOptions,
  infer TMode
>
  ? {
      props: TProps;
      options: TOptions;
      mode: TMode;
    }
  : never;

export type DialogMethodFromDefinition<D> = DefinitionParams<D> extends infer P
  ? P extends DefinitionParams<D>
    ? P['mode'] extends 'sync'
      ? (
          input: DialogInput<
            P['props'],
            DialogControllerContextValue<P['props'], P['options']>
          >,
          options?: OpenDialogOptions<P['options']>
        ) => DialogOpenResult<P['props'], P['options']>
      : (
          input: DialogInput<
            P['props'],
            DialogControllerContextValue<P['props'], P['options']>
          >,
          options?: OpenDialogOptions<P['options']>
        ) => Promise<DialogAsyncResult<P['props'], P['options']>>
    : never
  : never;

export interface DefineDialogOptions<TMode extends DialogMode = DialogMode> {
  mode?: TMode;
  displayName?: string;
}

export function defineDialog<
  TProps extends Record<string, unknown>,
  TOptions extends Record<string, unknown> = Record<string, unknown>,
  TMode extends DialogMode = 'sync'
>(
  component: DialogComponent<TProps, TOptions>,
  options?: DefineDialogOptions<TMode>
): DialogDefinition<TProps, TOptions, TMode> {
  const mode = (options?.mode ?? 'sync') as TMode;

  const definition: DialogDefinition<TProps, TOptions, TMode> = {
    mode,
    render: (input) => {
      const renderWithController: DialogRenderFn<TProps, TOptions> = (controller) => {
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

type AnyDialogDefinition = DialogDefinition<
  Record<string, unknown>,
  Record<string, unknown>,
  DialogMode
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

type RegistryEntry<
  TProps extends Record<string, unknown>,
  TOptions extends Record<string, unknown>,
  TMode extends DialogMode
> =
  | DialogDefinition<TProps, TOptions, TMode>
  | {
      component: DialogComponent<TProps, TOptions>;
      mode?: TMode;
      displayName?: string;
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRegistryEntry = RegistryEntry<any, any, DialogMode>;

type NormalizeRegistry<TRegistry extends Record<string, AnyRegistryEntry>> = {
  [K in keyof TRegistry]: TRegistry[K] extends DialogDefinition<infer P, infer O, infer M>
    ? DialogDefinition<P, O, M>
    : TRegistry[K] extends {
        component: DialogComponent<infer P, infer O>;
        mode?: infer M;
        displayName?: string;
      }
    ? DialogDefinition<
        P,
        O,
        M extends DialogMode ? M : 'sync'
      >
    : never;
};

function normalizeDefinition<
  TProps extends Record<string, unknown>,
  TOptions extends Record<string, unknown>,
  TMode extends DialogMode = 'sync'
>(
  entry: RegistryEntry<TProps, TOptions, TMode>
): DialogDefinition<TProps, TOptions, TMode> {
  if ('render' in entry) {
    return entry;
  }

  return defineDialog(entry.component, {
    mode: entry.mode,
    displayName: entry.displayName,
  }) as DialogDefinition<TProps, TOptions, TMode>;
}

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
          DialogControllerContextValue<Params['props'], Params['options']>
        >
      );

      if (definition.mode === 'sync') {
        return store.open<Params['props'], Params['options']>(
          renderer,
          options as OpenDialogOptions<Params['options']>
        );
      }

      return store.openAsync<Params['props'], Params['options']>(
        renderer,
        options as OpenDialogOptions<Params['options']>
      );
    }) as DialogMethodFromDefinition<typeof definition>;

    registryApi[key] = method;
  });

  return {
    ...baseApi,
    ...registryApi,
  } as DialogApi<NormalizeRegistry<TRegistry>>;
}

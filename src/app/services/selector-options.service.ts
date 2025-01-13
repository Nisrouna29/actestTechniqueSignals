import { Injectable, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { ISelectorOption } from '../models/selectorOption';
import { SelectorOptionsState } from '../states/selector.option.states';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectorOptionsStore extends signalStore(
  withState<SelectorOptionsState>({
    options: [],
    loading: false,
    error: null,
  }),

  withComputed(({ options, loading, error }) => ({
    frontOptions: computed(() => options().filter(option => option.type === 'front')),
    backOptions: computed(() => options().filter(option => option.type === 'back')),
    othersOptions: computed(() => options().filter(option => option.type === 'other')),
    isLoading: computed(() => loading()),
    hasError: computed(() => error() !== null),
  })),

  withMethods((store) => {
    const http = inject(HttpClient);
    const apiUrl = 'https://ac-project-62efb-default-rtdb.firebaseio.com';

    const loadOptions = async (): Promise<void> => {
      patchState(store, {
        loading: true,
        error: null,
      });

      try {
        const response = await firstValueFrom(http.get<Record<string, ISelectorOption>>(`${apiUrl}/options.json`));
        console.log('Fetched response:', response);

        if (response) {
          const options = Object.keys(response).map((key) => {
            const option = response[key];
            if (!option) return null;
            return {
              id: option.id,
              label: option.label ?? null,
              value: option.value ?? null,
              type: option.type ?? null,
            };
          }).filter((option): option is ISelectorOption => option !== null);

          patchState(store, {
            options: options,
            loading: false,
            error: null,
          });
        } else {
          patchState(store, {
            loading: false,
            error: 'Failed to retrieve options.',
          });
        }
      } catch (error) {
        patchState(store, {
          loading: false,
          error: 'Failed to retrieve options.',
        });
        throw error;
      }
    };

    return {
      loadOptions,
    };
  }),

  withHooks({
    onInit: (store) => {
      console.debug('SelectorOptionsStore initialized');
      store.loadOptions();
      effect(() => {
        console.debug('Store state changed:', {
          options: store.options(),
          loading: store.isLoading(),
          error: store.hasError(),
        });
      });
    },
  })
) {}


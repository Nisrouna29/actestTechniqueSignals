import { computed, effect, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Box, IBox } from '../models/box';
import { ISelectorOption } from '../models/selectorOption';
import { BoxesState, BoxSelectionState } from '../states/box.states';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoxStore extends signalStore(

  withState<BoxesState>({ boxesMap: new Map() }),
  withState<BoxSelectionState>({ selectedBox: null }),
  withComputed(({ selectedBox }) => ({
    selectedBoxId: computed(() => selectedBox() ? selectedBox()?.id : null)
  })),

  withMethods((store) => {
    const http = inject(HttpClient);
    const apiUrl = 'https://ac-project-62efb-default-rtdb.firebaseio.com';

    const processBoxesResponse = (response: Record<string, IBox> | null): Box[] => {
      if (!response) return [];
      return Object.keys(response)
        .map((key) => {
          const box = response[key];
          if (!box) return null;
          return new Box(
            box.id,
            box.idSelectorOption,
            box.label,
            box.value
          );
        })
        .filter((box): box is Box => box !== null);
    };

    const createBoxMap = (boxes: Box[]): Map<number, Box> => {
      const map = initMap();
      boxes.forEach((box) => {
        if (box?.id && box.id >= 1 && box.id <= 10) {
          map.set(box.id, box);
        }
      });
      return map;
    };

    const initMap = (): Map<number, Box> => {
      const map = new Map<number, Box>();
      for (let i = 1; i <= 10; i++) {
        map.set(i, new Box(i, null, null, null));
      }
      return map;
    };


    return {
      async loadBoxes() {
        try {
          const response = await firstValueFrom(http.get<Record<string, IBox>>(`${apiUrl}/boxes.json`));
          const processedBoxes = processBoxesResponse(response ?? null);
          const boxMap = createBoxMap(processedBoxes);
          patchState(store, {
            boxesMap: boxMap,
          });
        } catch (error) {
          console.error("Error while loading boxes", error)
        }
      },

      async deleteAllBoxes() {
        try {
          await firstValueFrom(http.delete(`${apiUrl}/boxes.json`));
          const emptyMap = initMap();
          const currentBox = store.selectedBox();
          const newSelectedBox = currentBox ? new Box(currentBox?.id, null, null, null) : null;
          patchState(store, {
            boxesMap: emptyMap,
            selectedBox: newSelectedBox,
          });
        } catch (error) {
          console.error("Error while deleting boxes", error)
        }
      },

      async patchBox(option: ISelectorOption) {
        try {
          const currentBox = store.selectedBox();
          if (!currentBox?.id) return;
          const updatedBox = new Box(currentBox.id, option.id, option.label, option.value);
          await firstValueFrom(http.patch(`${apiUrl}/boxes/${currentBox.id}.json`, updatedBox));
          const newboxesMap = new Map(store.boxesMap());
          newboxesMap.set(currentBox.id, updatedBox);
          let nextBox: Box | null = null;
          if (currentBox.id < 10) {
            nextBox = newboxesMap.get(currentBox.id + 1) ?? null;
          }
          if (nextBox) {
            patchState(store, {
              boxesMap: newboxesMap,
              selectedBox: nextBox,
            });

          } else {
            patchState(store, {
              boxesMap: newboxesMap,
              selectedBox: updatedBox,
            });
          }
        } catch (error) {
          console.error('Error while updating box', error)
        }
      },

      selectBox(box: Box) {
        patchState(store, {
          selectedBox: box,
        });
      },
      clearSelection() {
        patchState(store, {
          selectedBox: null,
        });
      },
    };
  }),

  withHooks({
    onInit(store) {
      console.debug('BoxStore initialized');
      store.loadBoxes();
      effect(() => {
        console.debug('BoxStore state updated:', {
          boxesMap: store.boxesMap(),
          selectedBoxId: store.selectedBoxId(),
        });
      });
    },
  })
) { }

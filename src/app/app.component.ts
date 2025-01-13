import { Component, effect, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { BoxesComponent } from './boxes/boxes.component';
import { SelectorComponent } from './selector/selector.component';
import { BoxStore } from './services/box-store.service';

@Component({
  selector: 'app-root',
  imports: [BoxesComponent, SelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  boxStore = inject(BoxStore);
  title = 'interactive-box-selection-2';
  showSelectorOption!: boolean;

  constructor() {
    effect(() => {
      const selectedBoxId = this.boxStore.selectedBoxId();
      this.showSelectorOption = selectedBoxId ? true : false;
    });
  }
}

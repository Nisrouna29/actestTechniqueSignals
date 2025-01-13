import { Component, effect, OnInit, inject } from '@angular/core';
import { BoxesComponent } from './boxes/boxes.component';
import { SelectorComponent } from './selector/selector.component';
import { SelectorOptionsStore } from './services/selector-options.service';
import { BoxStore } from './services/box-store.service';

@Component({
  selector: 'app-root',
  imports: [BoxesComponent, SelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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

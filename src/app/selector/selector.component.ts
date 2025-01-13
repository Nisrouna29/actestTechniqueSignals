import { Component, inject, computed, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { SelectorOptionsStore } from '../services/selector-options.service';
import { CommonModule } from '@angular/common';
import { SelectorOptionComponent } from '../selector-option/selector-option.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-selector',
  imports: [MatCardModule, SelectorOptionComponent, CommonModule],
  standalone: true,
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorComponent {
  selectorOptionsStore = inject(SelectorOptionsStore);
  frontOptions = computed(() => {
    return this.selectorOptionsStore.frontOptions();
  });
  backOptions = computed(() => {
    return this.selectorOptionsStore.backOptions();
  });
  othersOptions = computed(() => {
    return this.selectorOptionsStore.othersOptions();
  });
  isloading = computed(() => {
    return this.selectorOptionsStore.isLoading();
  });
}

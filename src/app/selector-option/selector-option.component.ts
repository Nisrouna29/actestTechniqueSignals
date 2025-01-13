import { ChangeDetectionStrategy, Component, Input, OnInit, computed, inject } from '@angular/core';
import { ISelectorOption } from '../models/selectorOption';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { BoxStore } from '../services/box-store.service';

@Component({
  selector: 'app-selector-option',
  imports: [MatRippleModule, CommonModule],
  templateUrl: './selector-option.component.html',
  styleUrl: './selector-option.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorOptionComponent {
  public boxStore = inject(BoxStore);
  @Input() public option!: ISelectorOption;

  selected = computed(() => {
    const selectedBox = this.boxStore.selectedBox()
    return selectedBox && selectedBox.idSelectorOption === this.option.id ? true : false;
  });
  updateBoxValue() {
    this.boxStore.patchBox(this.option);
  }
}

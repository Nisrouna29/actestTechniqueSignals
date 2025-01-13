import { ChangeDetectionStrategy, Component, HostListener, Input, computed, inject } from '@angular/core';
import { BoxStore } from '../services/box-store.service';

@Component({
  selector: 'app-box',
  imports: [],
  standalone: true,
  templateUrl: './box.component.html',
  styleUrl: './box.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxComponent {
  boxStore = inject(BoxStore);
  @Input() public index: number = 0;

  box = computed(() => {
    const boxes = this.boxStore.boxesMap();
    return boxes.get(this.index) ?? null;
  });

  selected = computed(() => {
    const id = this.boxStore.selectedBoxId()
    return id !== null && id === this.index ? true : false
  });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    let currentBox = this.box();
    if (currentBox)
      this.boxStore.selectBox(currentBox);
  }

}

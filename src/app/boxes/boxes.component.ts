import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { BoxComponent } from '../box/box.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BoxStore } from '../services/box-store.service';
import Decimal from 'decimal.js';
import { Box } from '../models/box';

@Component({
  selector: 'app-boxes',
  imports: [MatCardModule, BoxComponent, MatButtonModule, MatIconModule],
  standalone: true,
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesComponent {
  boxStore = inject(BoxStore);
  total = computed(() => {
    const boxes = this.boxStore.boxesMap();
    return this.calculateTotal(boxes);
  });

  deleteBoxes() {
    this.boxStore.deleteAllBoxes();
  }

  calculateTotal(boxes: Map<number, Box>): Decimal {
    let sum = new Decimal(0)
    boxes.forEach((value, key) => {
      let currentBox = boxes.get(key);
      if (currentBox && currentBox.value != null) {
        sum = sum.plus(new Decimal(currentBox.value));
      }
    });
    return sum;
  }
}

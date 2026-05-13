import { Component } from '@angular/core';
import { KitchenScreen } from '../kitchen-screen';

@Component({
  selector: 'app-bar-screen',
  standalone: true,
  imports: [KitchenScreen],
  template: `
    <app-kitchen-screen
      destination="BAR"
      title="Bar Screen">
    </app-kitchen-screen>
  `
})
export class BarScreen {}
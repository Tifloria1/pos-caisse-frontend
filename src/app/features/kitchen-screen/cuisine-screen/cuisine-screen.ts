import { Component } from '@angular/core';
import { KitchenScreen } from '../kitchen-screen';

@Component({
  selector: 'app-cuisine-screen',
  standalone: true,
  imports: [KitchenScreen],
  template: `
    <app-kitchen-screen
      destination="CUISINE"
      title="Cuisine Screen">
    </app-kitchen-screen>
  `
})
export class CuisineScreen {}
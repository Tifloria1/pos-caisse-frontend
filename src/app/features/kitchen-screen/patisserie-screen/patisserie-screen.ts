import { Component } from '@angular/core';
import { KitchenScreen } from '../kitchen-screen';

@Component({
  selector: 'app-patisserie-screen',
  standalone: true,
  imports: [KitchenScreen],
  template: `
    <app-kitchen-screen
      destination="PATISSERIE"
      title="Pâtisserie Screen">
    </app-kitchen-screen>
  `
})
export class PatisserieScreen {}
import { Component } from '@angular/core';

@Component({
  selector: 'app-hotels-filters',
  template: ` <div class="hotels-filter-container">
    <form>
      <h3>Filters</h3>
      <div>
        <h5>Price</h5>
        <input type="range" min="0" max="100" step="1" />
      </div>
    </form>
  </div>`,
  styleUrls: ['./hotels-filters.component.css'],
  standalone: false
})
export class HotelsFiltersComponent { }

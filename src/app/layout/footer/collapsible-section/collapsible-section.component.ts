import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible-section',
  templateUrl: './collapsible-section.component.html',
  styleUrls: ['./collapsible-section.component.css'],
})
export class CollapsibleSectionComponent {
  @Input() title!: string;
  @Input() links!: string[];
  isExpanded = false;
}

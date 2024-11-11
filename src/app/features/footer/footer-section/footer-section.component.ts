import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer-section',
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.css'],
})
export class FooterSectionComponent {
  @Input() title!: string;
  @Input() links!: string[];
}

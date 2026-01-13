import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-social-buttons',
    templateUrl: './social-buttons.component.html',
    styleUrls: ['./social-buttons.component.css'],
    standalone: false
})
export class SocialButtonsComponent {
  @Input() text = '';
}

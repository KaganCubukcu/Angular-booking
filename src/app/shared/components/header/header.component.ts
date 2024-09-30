import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent {
  headerTitle: string = 'Explore, Dream, Discover';
  headerSubTitle: string = 'LIVE & TRAVEL';
  headerDescription: string = 'Special offers to suit your plan';
}

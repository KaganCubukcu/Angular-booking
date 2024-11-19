import { Injectable } from '@angular/core';
import { Changelog } from 'src/app/features/changelog/models/Changelog.model';

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  private changelog: Changelog[] = [
    {
      version: '1.0.0',
      date: '2023-02-01',
      changes: ['Initial release'],
    },
    {
      version: '2.0.0',
      date: '2024-10-01',
      changes: ['New changelog page added', 'Navbar design updated', 'Header design updated'],
    },
    {
      version: '2.2.1',
      date: '2024-11-11',
      changes: [
        'Modernized footer design with improved mobile responsiveness',
        'Updated footer layout and spacing',
        'Enhanced footer social media icons',
        'Improved footer section organization',
        'Added responsive collapsible sections for mobile view',
      ],
    },
  ];

  getChangelog(): Changelog[] {
    return this.changelog;
  }
}

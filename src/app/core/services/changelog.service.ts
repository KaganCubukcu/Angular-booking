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
  ];

  getChangelog(): Changelog[] {
    return this.changelog;
  }
}

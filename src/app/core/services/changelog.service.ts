import { Injectable } from '@angular/core';
import { Changelog } from 'src/app/features/changelog/models/Changelog.model';

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  private changelog: Changelog[] = [
    {
      version: '1.0.0',
      date: '2024-02-01',
      changes: ['Initial release'],
    },
    {
      version: '1.0.1',
      date: '2024-02-02',
      changes: ['Added new features'],
    },
  ];

  getChangelog(): Changelog[] {
    return this.changelog;
  }
}

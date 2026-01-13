import { Injectable } from '@angular/core';
import { Changelog } from 'src/app/features/changelog/models/Changelog.model';

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  private changelog: Changelog[] = [
    {
      version: '3.0.0',
      date: '2026-01-13',
      changes: [
        'Angular sürümü v15\'ten v19\'a yükseltildi',
        'Tüm çekirdek bağımlılıklar (NgRx, ng-bootstrap, TypeScript, Zone.js) güncel sürümlere taşındı',
        'Angular 19 modül uyumluluğu için tüm bileşenlere standalone: false desteği eklendi',
        'Erişilebilirlik (Accessibility) iyileştirmeleri yapıldı (Klavye navigasyonu ve ekran okuyucu desteği)',
        'Tüm lint hataları ve kod kalitesi sorunları giderildi',
        'Form label uyumlulukları ve tip güvenliği (any tiplerinin temizlenmesi) sağlandı',
      ],
    },
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

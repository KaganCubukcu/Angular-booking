import { Component, OnInit } from '@angular/core';
import { Changelog } from './models/Changelog.model';
import { ChangelogService } from 'src/app/core/services/changelog.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css'],
})
export class ChangelogComponent implements OnInit {
  changelog: Changelog[] = [];

  constructor(private changelogService: ChangelogService) {}

  ngOnInit(): void {
    this.changelog = this.changelogService.getChangelog();
  }
}

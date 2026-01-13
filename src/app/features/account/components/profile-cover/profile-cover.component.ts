import { Component } from '@angular/core';

@Component({
    selector: 'app-profile-cover',
    template: `
    <!-- Template Start -->
    <div class="cover-container">
      <img
        src="https://img.freepik.com/free-vector/bright-yellow-background-with-lines-pattern_1017-33497.jpg?w=2000"
        alt=""
      />
      <div class="cover-change-button">
        <button>
          <img src="assets/icons/upload.svg" alt="upload-svg" />
          Upload new cover
        </button>
      </div>
    </div>
    <!-- Template End -->
  `,
    styleUrls: ['./profile-cover.component.css'],
    standalone: false
})
export class ProfileCoverComponent {}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from 'src/app/core/services/admin.service';
import { HotelDataModel } from 'src/app/features/hotel/store/hotel.model';

@Component({
    selector: 'app-hotel-list',
    templateUrl: './hotel-list.component.html',
    styleUrls: ['./hotel-list.component.css'],
    standalone: false
})
export class HotelListComponent implements OnInit, OnDestroy {
  hotels: HotelDataModel[] = [];
  loading = false;
  error: string | null = null;
  page = 1;
  limit = 20;
  total = 0;
  private destroy$ = new Subject<void>();

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(page = this.page): void {
    this.loading = true;
    this.error = null;

    this.adminService
      .getAllHotels(page, this.limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<HotelDataModel[]>) => {
          this.hotels = response.body || [];
          const totalHeader = response.headers.get('X-Total-Count');
          const pageHeader = response.headers.get('X-Page');
          const limitHeader = response.headers.get('X-Limit');
          this.total = totalHeader ? Number(totalHeader) : this.hotels.length;
          this.page = pageHeader ? Number(pageHeader) : page;
          this.limit = limitHeader ? Number(limitHeader) : this.limit;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading hotels:', err);
          this.error = 'Failed to load hotels. Please try again.';
          this.loading = false;
        },
      });
  }

  nextPage(): void {
    const maxPage = Math.ceil(this.total / this.limit) || 1;
    if (this.page < maxPage) {
      this.loadHotels(this.page + 1);
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.loadHotels(this.page - 1);
    }
  }

  addNewHotel(): void {
    this.router.navigate(['/admin/hotels/add']);
  }

  editHotel(hotelId: string): void {
    this.router.navigate(['/admin/hotels/edit', hotelId]);
  }

  deleteHotel(hotelId: string): void {
    if (confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      this.loading = true;

      this.adminService
        .deleteHotel(hotelId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.hotels = this.hotels.filter((hotel) => hotel._id !== hotelId);
            this.loading = false;
          },
          error: (err) => {
            console.error('Error deleting hotel:', err);
            this.error = 'Failed to delete hotel. Please try again.';
            this.loading = false;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

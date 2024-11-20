import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { ActivatedRoute, Router } from '@angular/router';
import slugify from 'slugify';
import { HotelDataModel } from 'src/app/features/hotel/store/hotel.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
})
export class HotelDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('roomsHeader') roomsHeader!: ElementRef;

  hotel: HotelDataModel | undefined;
  categories: string[] = [];
  currentImageIndex: number = 0;
  bookingForm: FormGroup;
  private destroy$: Subject<void> = new Subject();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppStateInterface>,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      guests: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];

    this.store.select(state => state.hotels)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (state) => {
          const hotel = Object.values(state.entities).find((h) => h && slugify(h.name) === slug);
          if (!hotel) {
            this.router.navigate(['/hotels']);
            return;
          }
          this.hotel = hotel;
          this.categories = this.hotel?.amenities || [];
        },
        error: (error) => {
          console.error('Error fetching hotel details:', error);
          this.router.navigate(['/hotels']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  bookRoom() {
    if (this.bookingForm.valid && this.hotel) {
      const bookingData = {
        ...this.bookingForm.value,
        hotelName: this.hotel.name,
        roomPrice: this.hotel.nightlyPrice,
      };
      this.router.navigate(['/payment']);
    }
  }

  scrollToRoomsHeader() {
    this.roomsHeader.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.hotel?.photos.length!;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.hotel?.photos.length!) % this.hotel?.photos.length!;
  }
}

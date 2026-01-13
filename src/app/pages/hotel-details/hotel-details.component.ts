import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { ActivatedRoute, Router } from '@angular/router';
import slugify from 'slugify';
import { HotelDataModel } from 'src/app/features/hotel/store/hotel.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as BookingActions from 'src/app/features/booking/store/booking.actions';
import { BookingModel } from 'src/app/features/booking/store/booking.model';
import { DataService } from 'src/app/core/services/data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
  standalone: false
})
export class HotelDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('roomsHeader') roomsHeader!: ElementRef;

  hotel: HotelDataModel | undefined;
  categories: string[] = [];
  currentImageIndex = 0;
  bookingForm: FormGroup;
  selectedRoom: { name: string; description: string; price: number } | undefined;
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppStateInterface>,
    private readonly dataService: DataService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      guests: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const slug = params.get('name');
        if (!slug) return;

        this.loading = true;

        // First try to get hotel by exact name
        this.dataService.getHotelByName(slug)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (hotel) => {
              if (hotel) {
                this.hotel = hotel;
                this.categories = hotel.amenities || [];
                this.setupSelectedRoom();
                this.loading = false;
              } else {
                // If not found by exact name, try searching through all hotels
                this.fetchFromAllHotels(slug);
              }
            },
            error: (err) => {
              console.error('Error fetching hotel by name:', err);
              this.fetchFromAllHotels(slug);
            }
          });
      });
  }

  private fetchFromAllHotels(slug: string) {
    this.dataService.getHotels()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (hotels) => {
          this.hotel = hotels.find((h) => slugify(h.name) === slug);
          if (this.hotel) {
            this.categories = this.hotel.amenities || [];
            this.setupSelectedRoom();
          } else {
            this.error = 'Hotel not found';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching hotels:', err);
          this.error = 'Failed to load hotel information';
          this.loading = false;
        }
      });
  }

  private setupSelectedRoom() {
    if (this.hotel && this.hotel.rooms) {
      this.selectedRoom = Array.isArray(this.hotel.rooms)
        ? this.hotel.rooms[0]
        : this.hotel.rooms;
    }
  }

  bookRoom() {
    if (this.bookingForm.valid && this.hotel && this.selectedRoom) {
      // Create booking details object
      const bookingDetails: BookingModel = {
        hotelName: this.hotel.name,
        roomName: this.selectedRoom.name,
        roomPrice: this.selectedRoom.price,
        roomDescription: this.selectedRoom.description,
        checkInDate: this.bookingForm.value.checkIn,
        checkOutDate: this.bookingForm.value.checkOut,
        numberOfGuests: parseInt(this.bookingForm.value.guests)
      };

      // Dispatch booking action
      this.store.dispatch(BookingActions.bookRoom({ bookingDetails }));
      // Note: Navigation to payment page is handled by the effect
    }
  }

  scrollToRoomsHeader() {
    this.roomsHeader?.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }

  nextImage() {
    if (this.hotel?.photos?.length) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.hotel.photos.length;
    }
  }

  prevImage() {
    if (this.hotel?.photos?.length) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.hotel.photos.length) % this.hotel.photos.length;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

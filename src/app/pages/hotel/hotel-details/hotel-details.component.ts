import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { ActivatedRoute, Router } from '@angular/router';
import slugify from 'slugify';
import { HotelDataModel } from 'src/app/features/hotel/store/hotel.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
})
export class HotelDetailsComponent implements OnInit {
  @ViewChild('roomsHeader') roomsHeader!: ElementRef;

  hotel: HotelDataModel | undefined;
  categories: string[] = [];
  currentImageIndex: number = 0;
  bookingForm: FormGroup;

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

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('name');
      this.store.select('hotels').subscribe((state) => {
        this.hotel = state.hotels.find((h) => slugify(h.name) === slug);
        this.categories = this.hotel?.amenities || [];
      });
    });
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

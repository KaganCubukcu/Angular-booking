import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HotelDataModel } from '../../store/hotel.model';
import { Router, ActivatedRoute } from '@angular/router';
import slugify from 'slugify';
import { Observable, Subject, takeUntil } from 'rxjs';

interface FiltersCardData {
  hotels$: Observable<HotelDataModel[]>;
  isLoading$: Observable<boolean>;
  hotelCount: number;
  motelCount: number;
  resortCount: number;
  totalCount: number;
}

@Component({
  selector: 'app-filters-card',
  templateUrl: './filters-card.component.html',
  styleUrls: ['./filters-card.component.css'],
})
export class FiltersCardComponent implements OnInit, OnDestroy {
  @Input() data!: FiltersCardData;
  hotels: HotelDataModel[] = [];

  unsubscribe$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.data.hotels$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((hotels: HotelDataModel[]) => {
        this.hotels = hotels;
      });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        const country = params['country'];
        if (country) {
          this.hotels = this.hotels.filter(
            (hotel) =>
              slugify(hotel.address.country, { lower: true }) === country
          );
        }
      });
  }

  viewPlace(hotelName: string) {
    const slug = slugify(hotelName);
    this.router.navigate(['hotel-listing', slug]);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

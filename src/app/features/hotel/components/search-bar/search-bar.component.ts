import { Component, TemplateRef, OnInit, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { AppStateInterface } from 'src/app/core/models/app-state.model';
import { HotelDataModel } from '../../store/hotel.model';
import { hotelsSelector } from '../../store/hotels.selectors';
import { Router } from '@angular/router';
import slugify from 'slugify';
import { updateSearchBar } from '../../store/search/search.action';
import { ChangeDetectorRef } from '@angular/core';

interface GuestsData {
  [key: string]: number;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  today!: string;
  form: FormGroup;
  hotels$: Observable<HotelDataModel[]>;
  hotelCountry: string[] = [];
  destinationInputFocused = false;
  filteredHotels: HotelDataModel[] = [];
  formSubmitted = false;
  showDestinationSuggestions = false;
  unsubscribe$ = new Subject<void>();

  guestsData: GuestsData = {
    rooms: 1,
    adults: 2,
    children: 0,
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly store: Store<AppStateInterface>,
    private readonly router: Router,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    this.form = this.fb.group({
      destination: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', [Validators.required]],
      roomsGuests: ['', [Validators.required, this.roomsGuestsValidator.bind(this)]],
    });
    const checkOutControl = this.form.get('checkOut');
    if (checkOutControl) {
      checkOutControl.setValidators(this.checkOutValidator.bind(this));
    }
    this.hotels$ = this.store.pipe(select(hotelsSelector));
    this.hotels$.pipe(filter((hotels) => !!hotels)).subscribe((hotels) => {
      this.hotelCountry = hotels.map((hotel) => hotel.address.country);
      this.filteredHotels = hotels;
    });
  }

  ngOnInit() {
    this.today = this.formatDate(new Date());
    this.initForm();
  }

  onDateChange(controlName: 'checkIn' | 'checkOut') {
    const control = this.form.get(controlName);
    if (control) {
      const date = new Date(control.value);
      control.setValue(this.formatDate(date), { emitEvent: false });
    }
  }

  initForm() {
    this.form = this.fb.group({
      destination: ['', Validators.required],
      checkIn: [this.formatDate(new Date()), Validators.required],
      checkOut: [this.formatDate(new Date(new Date().setDate(new Date().getDate() + 1))), [Validators.required]],
      roomsGuests: [this.formatGuestsData(), [Validators.required, this.roomsGuestsValidator.bind(this)]],
    });
    const checkOutControl = this.form.get('checkOut');
    if (checkOutControl) {
      checkOutControl.setValidators(this.checkOutValidator.bind(this));
    }
  }

  formatGuestsData(): string {
    return `${this.guestsData['rooms']} Rooms, ${this.guestsData['adults']} Adults, ${this.guestsData['children']} Children`;
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  get checkOutControl() {
    return this.form.get('checkOut');
  }

  openModal(content: NgbModalRef | TemplateRef<any>) {
    this.modalService.open(content);
  }

  openGuestsModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  roomsGuestsValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value) {
      const [rooms, adults, children] = value.split(',').map((val: any) => parseInt(val));
      if (rooms > 0 && adults > 0 && children >= 0) {
        return null;
      }
    }
    return { invalidRoomsGuests: true };
  }

  checkOutValidator(control: AbstractControl): ValidationErrors | null {
    const checkInControl = this.form.get('checkIn');
    if (checkInControl) {
      const checkInDate = new Date(checkInControl.value);
      const checkOutDate = new Date(control.value);
      if (checkOutDate <= checkInDate) {
        return { invalidCheckOutDate: true };
      }
    }
    return null;
  }

  updateGuestsData(key: string, value: number) {
    if (key === 'rooms' || key === 'adults') {
      if (this.guestsData[key] + value >= 1) {
        this.guestsData[key] += value;
      }
    } else if (key === 'children') {
      if (this.guestsData[key] + value >= 0) {
        this.guestsData[key] += value;
      }
    }
    this.updateRoomsGuests();
  }

  updateRoomsGuests() {
    this.form.patchValue({
      roomsGuests: this.formatGuestsData(),
    });
  }

  submit() {
    if (this.form.valid) {
      const { destination, checkIn, checkOut, roomsGuests } = this.form.value;
      const country = destination;
      const countrySlug = slugify(country, { lower: true });
      this.store.dispatch(
        updateSearchBar({
          searchResult: [
            {
              destination,
              checkIn: this.formatDateForDisplay(checkIn),
              checkOut: this.formatDateForDisplay(checkOut),
              roomsGuests,
            },
          ],
        })
      );
      this.router.navigate(['/hotel-listing'], {
        queryParams: { country: countrySlug },
      });
    } else {
      console.error('Error: All form fields are required.');
    }
  }

  formatDateForDisplay(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  }

  selectDestination(country: string) {
    this.form.patchValue({ destination: country });
    this.showDestinationSuggestions = false;
    this.cdr.detectChanges(); // Değişiklikleri hemen yansıtmak için
  }

  toggleDestinationSuggestions(event: Event) {
    event.stopPropagation(); // Bu satırı ekleyin
    this.showDestinationSuggestions = !this.showDestinationSuggestions;
  }

  searchHotels(event: Event) {
    event.stopPropagation(); // Bu satırı ekleyin
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.hotels$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((hotels) => hotels.filter((hotel) => hotel.address.country.toLowerCase().includes(value.toLowerCase())))
      )
      .subscribe((filteredHotels) => {
        this.filteredHotels = filteredHotels;
        this.showDestinationSuggestions = true;
        this.cdr.detectChanges();
      });
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDestinationSuggestions = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

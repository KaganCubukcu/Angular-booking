import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from 'src/app/core/services/admin.service';
import { HotelDataModel } from 'src/app/features/hotel/store/hotel.model';

@Component({
    selector: 'app-hotel-form',
    templateUrl: './hotel-form.component.html',
    styleUrls: ['./hotel-form.component.css']
})
export class HotelFormComponent implements OnInit, OnDestroy {
    hotelForm: FormGroup;
    isEditMode = false;
    hotelId: string | null = null;
    loading = false;
    error: string | null = null;
    success: string | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.hotelForm = this.createHotelForm();
    }

    ngOnInit(): void {
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = params['id'];
                if (id) {
                    this.isEditMode = true;
                    this.hotelId = id;
                    this.loadHotelData(id);
                }
            });
    }

    private createHotelForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            nightlyPrice: ['', [Validators.required, Validators.min(1)]],
            cardBackground: ['', Validators.required],
            address: this.fb.group({
                streetAddress: ['', Validators.required],
                city: ['', Validators.required],
                state: ['', Validators.required],
                country: ['', Validators.required]
            }),
            rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
            accommodationType: ['', Validators.required],
            photos: this.fb.array([
                this.fb.control('', Validators.required)
            ]),
            overview: ['', [Validators.required, Validators.minLength(20)]],
            location: this.fb.group({
                lat: ['', Validators.required],
                lng: ['', Validators.required]
            }),
            amenities: this.fb.array([
                this.fb.control('', Validators.required)
            ]),
            rooms: this.fb.array([
                this.createRoomFormGroup()
            ])
        });
    }

    private createRoomFormGroup(): FormGroup {
        return this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', [Validators.required, Validators.min(1)]]
        });
    }

    get photos(): FormArray {
        return this.hotelForm.get('photos') as FormArray;
    }

    get amenities(): FormArray {
        return this.hotelForm.get('amenities') as FormArray;
    }

    get rooms(): FormArray {
        return this.hotelForm.get('rooms') as FormArray;
    }

    addPhoto(): void {
        this.photos.push(this.fb.control('', Validators.required));
    }

    removePhoto(index: number): void {
        if (this.photos.length > 1) {
            this.photos.removeAt(index);
        }
    }

    addAmenity(): void {
        this.amenities.push(this.fb.control('', Validators.required));
    }

    removeAmenity(index: number): void {
        if (this.amenities.length > 1) {
            this.amenities.removeAt(index);
        }
    }

    addRoom(): void {
        this.rooms.push(this.createRoomFormGroup());
    }

    removeRoom(index: number): void {
        if (this.rooms.length > 1) {
            this.rooms.removeAt(index);
        }
    }

    private loadHotelData(hotelId: string): void {
        this.loading = true;
        this.adminService.getAllHotels()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (hotels) => {
                    const hotel = hotels.find(h => h._id === hotelId);
                    if (hotel) {
                        this.populateForm(hotel);
                    } else {
                        this.error = 'Hotel not found';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading hotel data:', err);
                    this.error = 'Failed to load hotel data';
                    this.loading = false;
                }
            });
    }

    private populateForm(hotel: HotelDataModel): void {
        // Reset form arrays first
        while (this.photos.length !== 0) {
            this.photos.removeAt(0);
        }

        while (this.amenities.length !== 0) {
            this.amenities.removeAt(0);
        }

        while (this.rooms.length !== 0) {
            this.rooms.removeAt(0);
        }

        // Add photos
        if (hotel.photos && hotel.photos.length) {
            hotel.photos.forEach(photo => {
                this.photos.push(this.fb.control(photo, Validators.required));
            });
        } else {
            this.addPhoto();
        }

        // Add amenities
        if (hotel.amenities && hotel.amenities.length) {
            hotel.amenities.forEach(amenity => {
                this.amenities.push(this.fb.control(amenity, Validators.required));
            });
        } else {
            this.addAmenity();
        }

        // Add rooms
        if (hotel.rooms && hotel.rooms.length) {
            hotel.rooms.forEach(room => {
                this.rooms.push(this.fb.group({
                    name: [room.name, Validators.required],
                    description: [room.description, Validators.required],
                    price: [room.price, [Validators.required, Validators.min(1)]]
                }));
            });
        } else {
            this.addRoom();
        }

        // Set other form values
        this.hotelForm.patchValue({
            name: hotel.name,
            nightlyPrice: hotel.nightlyPrice,
            cardBackground: hotel.cardBackground,
            address: hotel.address,
            rating: hotel.rating,
            accommodationType: hotel.accommodationType,
            overview: hotel.overview,
            location: hotel.location
        });
    }

    onSubmit(): void {
        if (this.hotelForm.invalid) {
            this.markFormGroupTouched(this.hotelForm);
            return;
        }

        const hotelData: HotelDataModel = this.hotelForm.value;
        this.loading = true;
        this.error = null;
        this.success = null;

        if (this.isEditMode && this.hotelId) {
            this.adminService.updateHotel(this.hotelId, hotelData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.success = 'Hotel updated successfully';
                        this.loading = false;
                        setTimeout(() => {
                            this.router.navigate(['/admin/hotels']);
                        }, 1500);
                    },
                    error: (err) => {
                        console.error('Error updating hotel:', err);
                        this.error = 'Failed to update hotel';
                        this.loading = false;
                    }
                });
        } else {
            this.adminService.addHotel(hotelData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.success = 'Hotel added successfully';
                        this.loading = false;
                        setTimeout(() => {
                            this.router.navigate(['/admin/hotels']);
                        }, 1500);
                    },
                    error: (err) => {
                        console.error('Error adding hotel:', err);
                        this.error = 'Failed to add hotel';
                        this.loading = false;
                    }
                });
        }
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if ((control as FormGroup).controls) {
                this.markFormGroupTouched(control as FormGroup);
            }
        });
    }

    cancelEdit(): void {
        this.router.navigate(['/admin/hotels']);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
} 
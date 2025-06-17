import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { UserModel } from '../models/user.model';
import { HotelDataModel } from '../../features/hotel/store/hotel.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // User management
    getAllUsers(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.apiUrl}/admin/users`);
    }

    toggleAdminStatus(userId: string): Observable<UserModel> {
        return this.http.patch<UserModel>(`${this.apiUrl}/admin/users/${userId}/toggle-admin`, {});
    }

    // Hotel management
    getAllHotels(): Observable<HotelDataModel[]> {
        return this.http.get<HotelDataModel[]>(`${this.apiUrl}/admin/hotels`);
    }

    addHotel(hotel: HotelDataModel): Observable<HotelDataModel> {
        return this.http.post<HotelDataModel>(`${this.apiUrl}/admin/hotels`, hotel);
    }

    updateHotel(hotelId: string, hotel: Partial<HotelDataModel>): Observable<HotelDataModel> {
        return this.http.put<HotelDataModel>(`${this.apiUrl}/admin/hotels/${hotelId}`, hotel);
    }

    deleteHotel(hotelId: string): Observable<{ message: string, hotelId: string }> {
        return this.http.delete<{ message: string, hotelId: string }>(`${this.apiUrl}/admin/hotels/${hotelId}`);
    }
} 
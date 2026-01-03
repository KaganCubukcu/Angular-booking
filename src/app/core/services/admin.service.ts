import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { UserModel } from '../models/user.model';
import { HotelDataModel } from '../../features/hotel/store/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // User management
  getAllUsers(page = 1, limit = 20): Observable<HttpResponse<UserModel[]>> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/admin/users`, {
      observe: 'response',
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  toggleAdminStatus(userId: string): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.apiUrl}/admin/users/${userId}/toggle-admin`, {});
  }

  // Hotel management
  getAllHotels(page = 1, limit = 20): Observable<HttpResponse<HotelDataModel[]>> {
    return this.http.get<HotelDataModel[]>(`${this.apiUrl}/admin/hotels`, {
      observe: 'response',
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  getHotelById(hotelId: string): Observable<HotelDataModel> {
    return this.http.get<HotelDataModel>(`${this.apiUrl}/admin/hotels/${hotelId}`);
  }

  addHotel(hotel: HotelDataModel): Observable<HotelDataModel> {
    return this.http.post<HotelDataModel>(`${this.apiUrl}/admin/hotels`, hotel);
  }

  updateHotel(hotelId: string, hotel: Partial<HotelDataModel>): Observable<HotelDataModel> {
    return this.http.put<HotelDataModel>(`${this.apiUrl}/admin/hotels/${hotelId}`, hotel);
  }

  deleteHotel(hotelId: string): Observable<{ message: string; hotelId: string }> {
    return this.http.delete<{ message: string; hotelId: string }>(`${this.apiUrl}/admin/hotels/${hotelId}`);
  }
}

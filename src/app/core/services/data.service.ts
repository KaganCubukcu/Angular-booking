import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { HotelDataModel } from '../../features/hotel/store/hotel.model';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl;
  private fallbackUrl = 'assets/data.json';

  constructor(private http: HttpClient) { }

  getHotels(): Observable<HotelDataModel[]> {
    // Try to get hotels from API
    return this.http.get<HotelDataModel[]>(`${this.apiUrl}/hotels`).pipe(
      catchError(error => {
        console.warn('Error fetching hotels from API, falling back to static data:', error);
        // Fallback to static JSON file
        return this.http.get<HotelDataModel[]>(this.fallbackUrl);
      })
    );
  }

  getHotelByName(name: string): Observable<HotelDataModel> {
    return this.http.get<HotelDataModel>(`${this.apiUrl}/hotels/name/${name}`).pipe(
      catchError(error => {
        console.warn(`Error fetching hotel "${name}" from API, falling back to static data:`, error);
        // Fallback to static JSON and filter the specific hotel
        return this.http.get<HotelDataModel[]>(this.fallbackUrl).pipe(
          map(hotels => {
            const hotel = hotels.find(h => h.name === name);
            if (!hotel) {
              throw new Error(`Hotel ${name} not found in fallback data`);
            }
            return hotel;
          }),
          catchError(() => {
            console.error(`Failed to find hotel "${name}" in fallback data`);
            return of({} as HotelDataModel);
          })
        );
      })
    );
  }

  getHotelById(id: string): Observable<HotelDataModel> {
    return this.http.get<HotelDataModel>(`${this.apiUrl}/hotels/id/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StoreSettings {
  id?: number;
  storeName: string;
  phone: string;
  address: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = 'http://localhost:8083/api/settings';

  constructor(private http: HttpClient) {}

  getSettings(): Observable<StoreSettings> {
    return this.http.get<StoreSettings>(this.apiUrl);
  }

  updateSettings(settings: StoreSettings): Observable<StoreSettings> {
    return this.http.put<StoreSettings>(this.apiUrl, settings);
  }
}
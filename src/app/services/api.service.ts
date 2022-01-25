import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScannerLog } from '../models/ScannerLog';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  log(data: ScannerLog): Observable<any> {
    return this.httpClient.post('https://10.5.8.154:4171/Log/scanner', data);
  }
}

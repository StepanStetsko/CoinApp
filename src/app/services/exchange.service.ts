import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Asset } from '../models/asset.model';
import { ExchangeRate } from '../models/exchange-rate.model';
import { Period } from '../models/period.model';
import { TimeseriesData } from '../models/timeseries-data';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(private http: HttpClient) { }

  getPeriods(){
    return this.http.get<Period[]>(`${environment.mainUrl}/v1/exchangerate/history/periods?apiKey=${environment.apiKey}`)
  }

  getExangeByPeriod(currency: string){
    let date = new Date()
    date.setMonth(date.getMonth() - 1)
  
    return this.http.get<TimeseriesData[]>(
      `${environment.mainUrl}/v1/exchangerate/${currency}/history?period_id=12HRS&time_start=${moment(date).format('YYYY-MM-DDTHH:MM:SS')}&apiKey=${environment.apiKey}`
      )
  }

  getExange(currency: string){
    return this.http.get<ExchangeRate>(`${environment.mainUrl}/v1/exchangerate/${currency}?apiKey=${environment.apiKey}`)
  }

  getAssets(){
    return this.http.get<Asset[]>(`${environment.mainUrl}/v1/assets?apiKey=${environment.apiKey}`)
  }
}
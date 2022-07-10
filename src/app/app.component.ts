import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { WebSocketMessage } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { Asset } from './models/asset.model';
import { ExchangeRate } from './models/exchange-rate.model';
import { Period } from './models/period.model';
import { TimeseriesData } from './models/timeseries-data';
import { WebsocketRequest } from './models/websocket-request.model';
import { WebsocketResponse } from './models/websocket-response.model';
import { ExchangeService } from './services/exchange.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CoinApi-app';
  periodList!: Period[];
  exchangeRate!: ExchangeRate;
  timeseriesData!: TimeseriesData[];
  assets!: Asset[]
  webSocketMessage!: WebsocketResponse
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels!: string[];
  barChartData!: any 
  currentCurrency!: string

  constructor(private exchangeService: ExchangeService, private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    this.connectToSocket()
  }

private sendToWebSocket(): void {
  this.webSocketService.sendData(new WebsocketRequest(this.currentCurrency))
}

private connectToSocket(): void {
    this.webSocketService.openConnection().subscribe((data: WebsocketResponse) => {
  this.exchangeRate.rate = data.price      
})
}

  changeCurrency(currency: string): void {
    this.currentCurrency = currency
    this.exchangeService.getExange(this.currentCurrency).subscribe((data: ExchangeRate) => this.exchangeRate = data)
    this.sendToWebSocket()

    this.exchangeService.getExangeByPeriod(this.currentCurrency).subscribe((data: TimeseriesData[]) => {
      this.timeseriesData = data 
      this.barChartLabels = this.timeseriesData.map(x =>
        moment(x.time_open).format('YYYY-MM-DD')
      )

      this.barChartData = [{
        data: this.timeseriesData.map(x => x.rate_open),
        label: currency
      }]
    })
  }
}

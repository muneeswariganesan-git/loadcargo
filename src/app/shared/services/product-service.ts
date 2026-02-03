import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FlightSearchPayload } from '../models/flight-payload';
import {CargoFlightHeaderResponse, FlightDetails } from '../models/cargo-flight-header-model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private subject = new BehaviorSubject<FlightSearchPayload | null>(null);
  payload$ = this.subject.asObservable();

  set(payload: FlightSearchPayload) {
    this.subject.next(payload);
  }

  get(): FlightSearchPayload | null {
    return this.subject.value;
  }

  private deadloadRows: any[] = [];
  private deadloadTotalKg = 0;

  setDeadloadRows(rows: any[]) {
    this.deadloadRows = rows ?? [];
  }
  getDeadloadRows() {
    return this.deadloadRows;
  }

  setDeadloadTotalKg(total: number) {
    this.deadloadTotalKg = Number(total) || 0;
  }
  getDeadloadTotalKg() {
    return this.deadloadTotalKg;
  }

  private productSubject = new BehaviorSubject<string | null>(null);
  product$ = this.productSubject.asObservable();

  private headerTypeSubject = new BehaviorSubject<'welcome' | 'details'>('welcome');
  headerType$ = this.headerTypeSubject.asObservable();

  
  private readonly flightDataSubject = new BehaviorSubject<FlightDetails | null>(null);
  flightData$ = this.flightDataSubject.asObservable();

  private flightSelectionState = new BehaviorSubject<'none' | 'open' | 'completed'>('none');
  flightSelectionState$ = this.flightSelectionState.asObservable();

  private capacityDataSubject = new BehaviorSubject<any[]>([]);
  private forecastDataSubject = new BehaviorSubject<any[]>([]);
  private commentsSubject = new BehaviorSubject<any[]>([]);

  capacityData$ = this.capacityDataSubject.asObservable();
  forecastData$ = this.forecastDataSubject.asObservable();
  comments$ = this.commentsSubject.asObservable();

  setCapacityData(v: any[]) {
    this.capacityDataSubject.next(v ?? []);
  }
  setForecastData(v: any[]) {
    this.forecastDataSubject.next(v ?? []);
  }
  setComments(v: any[]) {
    this.commentsSubject.next(v ?? []);
  }

  getCapacityData() {
    return this.capacityDataSubject.value;
  }
  getForecastData() {
    return this.forecastDataSubject.value;
  }
  getComments() {
    return this.commentsSubject.value;
  }

  setProduct(product: string) {
    this.productSubject.next(product);
  }

  getCurrentProduct(): string | null {
    return this.productSubject.getValue();
  }

  setHeader(type: 'welcome' | 'details') {
    this.headerTypeSubject.next(type);
  }

  getHeader() {
    return this.headerTypeSubject.getValue();
  }

  setFlightData(data: FlightDetails) {
    this.flightDataSubject.next(data);
  }

  getFlightData() {
    return this.flightDataSubject.getValue();
  }

  setFlightSelectionState(state: 'none' | 'open' | 'completed') {
    this.flightSelectionState.next(state);
  }

  getFlightSelectionState(): 'none' | 'open' | 'completed' {
    return this.flightSelectionState.getValue();
  }
}

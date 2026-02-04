import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CargoFlightHeaderRequest, CargoFlightHeaderResponse, FlightDetails } from '../models/cargo-flight-header-model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CargoFlightHeader {
  private readonly baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

// cargo-flight-header-api.service.ts
getFlightHeader(request: CargoFlightHeaderRequest): Observable<FlightDetails> {
  const path = `${this.baseUrl}/vfh/${request.carrier}/${request.flightNo}`;

  let params = new HttpParams()
    .set('origin', request.origin)
    .set('productCode', request.productCode)
    .set('depDateTime', request.depDateTime);

  if (request.destination)    params = params.set('destination', request.destination);
  if (request.flightNoSfx)    params = params.set('flightNoSfx', request.flightNoSfx);
  if (request.iataServiceType) params = params.set('iataServiceType', request.iataServiceType);

  return this.http
    .get<CargoFlightHeaderResponse>(path, { params })
    .pipe(map(res => res.data)); 
}

  

  getCargoFlightHeader(): Observable<CargoFlightHeaderResponse> {
    const mockResponse: CargoFlightHeaderResponse = {
      status: 'success',
      code: 200,
      message: 'Request processed successfully',
      data: {
        datedFlightLeg: {
          operatorCarrierCode: 'BA',
          operationalFlightNumber: '247',
          operationalFlightNumberSuffix: 'A',
          originStation: 'LHR',
          destinationStation: 'JFK',
          scheduledDepartureDateLocal: '2025-12-05T10:00:00',
          dateTimes: [
            {
              dateTimeLocal: '2025-12-05T10:00:00',
              dateTimeGMT: '2025-12-05T10:00:00',
              dateTimeStatus: 'Estimated',
              dateTimeType: 'Departure',
            },
          ],
        },
        aircraftRegistrationCode: 'G-XXXX',
        airfliteAircraftSubtype: '777',
        fmAircraftSubType: '77W',
        standNumber: 'A12',
        flightLeg: [
          {
            flightLegOrigin: 'LHR',
            flightLegDestination: 'JFK',
            dateTimes: [
              {
                dateTimeLocal: '2025-12-05T10:00:00',
                dateTimeGMT: '2025-12-05T10:00:00',
                dateTimeStatus: 'Estimated',
                dateTimeType: 'Departure',
              },
            ],
            cancelledLeg: false,
          },
        ],
        saleableConfiguration: {
          cabinFigures: [
            { cabinCode: 'F', count: 8 },
            { cabinCode: 'J', count: 8 },
            { cabinCode: 'W', count: 8 },
            { cabinCode: 'M', count: 8 },
          ],
        },
        flightStatus: {
          generalStatusCode: 'GD',
          loadControlStatusCode: 'LO',
          loadReleaseStatus: 'Final',
          scheduleStatus: 'Scheduled',
        },
        currentFlightFitment: {
          palletCount: 10,
          containerCount: 2,
        },
        ngrmFitment: {
          palletCount: 10,
          containerCount: 2,
        },
        passengerSummary: [
          {
            origin: 'LHR',
            destination: 'JFK',
            cabinStatusCount: [
              { cabinCode: 'F', bookedCount: 2, acceptedCount: 0 },
              { cabinCode: 'J', bookedCount: 25, acceptedCount: 0 },
              { cabinCode: 'W', bookedCount: 13, acceptedCount: 0 },
              { cabinCode: 'M', bookedCount: 55, acceptedCount: 0 },
            ],
          },
          {
            origin: 'LHR',
            destination: 'SYD',
            cabinStatusCount: [
              { cabinCode: 'F', bookedCount: 6, acceptedCount: 0 },
              { cabinCode: 'J', bookedCount: 43, acceptedCount: 0 },
              { cabinCode: 'W', bookedCount: 26, acceptedCount: 0 },
              { cabinCode: 'M', bookedCount: 73, acceptedCount: 0 },
            ],
          },
        ],
        product: {
          ownerName: 'John Doe',
          ownerId: 'n417111',
          plannedLoadReleaseTime: '2025-12-05T08:00:00',
          plannedBuildCloseTime: '2025-12-05T07:00:00',
          plannedManifestTime: '2025-12-05T09:00:00',
          productCode: 'MM',
        },
        iataServiceType: 'C',
      },
    };

    return of(mockResponse);
  }
}

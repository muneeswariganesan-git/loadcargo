
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UnitLoadDevice {
  UnitType: string;
  SerialNumber: string;
  OwnerCode: string;
}

export interface DangerousGoods {
  SystemIdentifier: any;
  OffPointStation: string;
  AirwayBillNumber: string;
  ProperShippingName: string;
  ClassDivision: string;
  UnitedNationsIdentifier: string;
  Pieces: string;
  NetQuantityPerPackage: string;
  DangerousGoodsCode: string;
  CargoAircraftOnly: string;
  EmergencyResponseCode: string;
  PackingGroup: string | null;
  NetWeight: string;
  UnitLoadDevice: UnitLoadDevice | null;
  ULDSentToFM: string | null;
}

export interface FlightInformation {
  OperationalFlightNumber: string;
  OperatorCarrierCode: string;
  ScheduledDepartureDateTimeLocal: string; // ISO
  BoardPointStation: string;
}

export interface SpecialLoadDetails {
 
  SystemIdentifier: any;
  OffPointStation: string;
  AirwayBillNumber: string;
  Description: string;
  Packages: string;
  NetQuantityPerPackage: string;
  SpecialLoadCode: string;
  NetWeight: string;
  ULDSentToFM: string;
}

export interface FlightPayload {
  FlightInformation: FlightInformation;
  DangerousGoodsDetails: DangerousGoods[];
  SpecialLoadDetails: SpecialLoadDetails[];
}

export interface ViewFlightDGSLRequest {
  ViewFlightDGSLRequest: {
    FlightDetails: {
      Flight: {
        OperationalFlightNumber: string;
        OperatorCarrierCode: string;
      };
      FlightLegOrigin: string;
      ScheduledDepartureDateTimeLocal: string; // YYYY-MM-DD
    };
    CommodityCode?: string; // optional
  };
}



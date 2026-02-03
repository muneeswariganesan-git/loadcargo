import { Injectable } from '@angular/core';
import { FlightSearchPayload, ServiceExtras } from '../models/flight-payload';
import { getProductCode } from '../models/product-mapping';
import { serviceMappers } from './payload-mapper';
import { CargoFlightHeaderRequest } from '../models/cargo-flight-header-model';


export type ServicePayload<S extends keyof ServiceExtras> = FlightSearchPayload & ServiceExtras[S];

export function buildPayload<S extends keyof ServiceExtras>(
  service: S,
  base: FlightSearchPayload
): ServicePayload<S> {
  const productCode = getProductCode(base.product ?? '');
  const enrichedPayload = { ...base, productCode };

  const mapped = serviceMappers[service](enrichedPayload);

  return { ...mapped, productCode } as ServicePayload<S>;
}

export function buildHeaderPayload(base: FlightSearchPayload) {
  return {
    ViewFlightHeaderRequest: {
      ProductCode: getProductCode(base.product ?? ''),
      DatedFlightLeg: {
        OperatorCarrierCode: base.flightNumbers?.[0]?.slice(0, 2) ?? '',
        OperationalFlightNumber: base.flightNumbers?.[1] ?? '',
        OriginStation: base.departureStation ?? '',
        ScheduledDepartureDateLocal: formatDate(base.flightDate) ?? '',
      },
    },
  };
}


function toIsoLocalDateTime(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) return ''; // invalid date guard

  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  // Local ISO-like without timezone/Z
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}


export function buildCargoFlightHeaderRequest(base: FlightSearchPayload): CargoFlightHeaderRequest {

  // Extract carrier / flightNo / suffix
  const carrier = base.flightNumbers?.[0] ?? '';
  const flightNo = base.flightNumbers?.[1] ?? '';
  const flightNoSfx = base.flightNumberSuffix ?? '';

  return {
    carrier,
    flightNo,

    origin: base.departureStation ?? '',
    destination: base.arrivalStation,   

    productCode: base.productCode
      ? base.productCode
      : getProductCode(base.product ?? ''),

    depDateTime: toIsoLocalDateTime(base.flightDate),

    flightNoSfx: flightNoSfx || undefined,
    iataServiceType: base.iataServiceType || undefined
  };
}



function formatDate(date: string): string {
  // Convert DD-MMM-YYYY → YYYY-MM-DDT00:00:00
  const [day, month, year] = date.split('-');
  const months: Record<string, string> = {
    JAN: '01',
    FEB: '02',
    MAR: '03',
    APR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12',
  };
  return `${year}-${months[month]}-${day}T00:00:00`;
}

// payload-factory.ts
export function buildDeadloadPayload(
  base: {
    flightNumbers: [string, string];
    flightDate: string; // ISO 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss'
    departureStation: string;
  },
  commodityCodes?: string[]
) {
  const [carrier, number] = base.flightNumbers ?? ['BA', '000'];
  const localISO = base.flightDate.includes('T') ? base.flightDate : `${base.flightDate}T00:00:00`;
  const req: any = {
    ViewFlightSummaryRequest: {
      DatedFlightLeg: {
        OperationalFlightNumber: String(number),
        OperatingCarrierCode: carrier,
        OriginStation: base.departureStation,
        ScheduledDepartureDateLocal: localISO,
      },
      FMLoadIndicator: true,
    },
  };
  if (commodityCodes?.length) {
    req.ViewFlightSummaryRequest.CommodityCode = commodityCodes;
  }
  return req;
}

@Injectable({ providedIn: 'root' })
export class PayloadFactory {
  build<S extends keyof ServiceExtras>(service: S, base: FlightSearchPayload): ServicePayload<S> {
    const productCode = getProductCode(base.product ?? '');
    const enrichedPayload = { ...base, productCode };
    const mapped = serviceMappers;

    return { ...mapped, productCode } as unknown as ServicePayload<S>;
  }
}

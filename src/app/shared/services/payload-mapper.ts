import {
  FlightAnomalyRequest,
  FlightSearchPayload,
  ServiceExtras,
  ServicePayload,
  ViewInfoExtra,
} from '../models/flight-payload';
import { getCommodityCodes } from '../models/product-mapping';


type Mapper<S extends keyof ServiceExtras> = (
  base: FlightSearchPayload
) => FlightSearchPayload & ServiceExtras[S];

export const serviceMappers: {
  [K in keyof ServiceExtras]: (base: FlightSearchPayload) => ServicePayload<K>;
} = {
  viewInfo: (base: FlightSearchPayload): FlightSearchPayload & ViewInfoExtra => ({
    ...base,
    ViewFlightSummaryRequest: {
      CommodityCode: getCommodityCodes(base.product ?? ''),
      DatedFlightLeg: {
        OperationalFlightNumber: base.flightNumbers.join('/'),
        OperatingCarrierCode: base.flightNumbers[0]?.slice(0, 2) ?? '',
        OriginStation: base.departureStation,
        ScheduledDepartureDateLocal: base.flightDate,
      },
      FMLoadIndicator: true,
    },
  }),
  anomaly: (base: FlightSearchPayload): FlightSearchPayload & FlightAnomalyRequest => ({
    ...base,

    FlightAnomalyAndSystemDetails: {
      DatedFlightLeg: {
        FlightCode: {
          FlightNumber: base.flightNumbers.join('/'),
          CarrierCode: base.flightNumbers[0]?.slice(0, 2) ?? '',
        },
        Leg: {
          OriginStation: base.departureStation,
        },
        DateTimes: {
          DateTimeLocal: formatDate(base.flightDate), // e.g., "2025-12-01T00:00:00"
          DateTimeStatus: 'Scheduled',
          DateTimeType: 'Departure',
        },
      },
    },
  }),

  deadload: (base) => ({ ...base, DeadloadRequest: { weight: 1500, description: 'Cargo' } }),
  viewOwnership: (base) => ({
    ...base,
    OwnershipRequest: { ownerId: '123', ownerName: 'OpsTeam' },
  }),
  forecast: (base) => ({ ...base, ForecastRequest: { forecastType: 'Load', horizonDays: 7 } }),
  capacity: (base) => ({
    ...base,
    CapacityRequest: { includeContainers: true, includePallets: true },
  }),
  comments: (base) => ({
    ...base,
    CommentsRequest: { includeCrewComments: true, includeOpsComments: true },
  }),
  loadPlan: (base) => ({ ...base, LoadPlanRequest: { planVersion: 'v1', includeULD: true } }),
  fitment: (base) => ({ ...base, FitmentRequest: { fitmentType: 'Current', includeNG: true } }),
  passenger: (base) => ({
    ...base,
    PassengerRequest: { includeCabinDetails: true, includeMealCodes: false },
  }),
  product: (base) => ({
    ...base,
    ProductRequest: { includeOwnerDetails: true, includeManifestTimes: true },
  }),
  flightStatus: (base) => ({
    ...base,
    FlightStatusRequest: { includeScheduleStatus: true, includeLoadStatus: true },
  }),
  aircraft: (base) => ({
    ...base,
    AircraftRequest: { includeRegistration: true, includeSubtype: true },
  }),
  crew: (base) => ({ ...base, CrewRequest: { includeCrewList: true, includeCrewRoles: true } }),
  delay: (base) => ({ ...base, DelayRequest: { includeDelayCodes: true, includeReason: true } }),
};

export function buildViewFlightSummaryRequest(
  base: FlightSearchPayload,
  product: string,
  fmLoadIndicator: boolean = true
) {
  return {
    ViewFlightSummaryRequest: {
      CommodityCode: getCommodityCodes(product ?? ''),
      DatedFlightLeg: {
        OperationalFlightNumber: base.flightNumbers?.[1] ?? '', // second element
        OperatingCarrierCode: base.flightNumbers?.[0] ?? '', // first element
        OriginStation: base.departureStation,
        ScheduledDepartureDateLocal: formatDate(base.flightDate),
      },
      FMLoadIndicator: fmLoadIndicator,
    },
  };
}

export const buildFlightAnomalyPayload = (base: FlightSearchPayload): FlightAnomalyRequest => {
  return {
    FlightAnomalyAndSystemDetails: {
      DatedFlightLeg: {
        FlightCode: {
          FlightNumber: base.flightNumbers?.[1] ?? '',
          CarrierCode: base.flightNumbers?.[0]  ?? '',
        },
        Leg: {
          OriginStation: base.departureStation,
        },
        DateTimes: {
          DateTimeLocal: formatDate(base.flightDate), // e.g., "2025-12-01T00:00:00"
          DateTimeStatus: 'Scheduled',
          DateTimeType: 'Departure',
        },
      },
    },
  };
};

// return {
//   ...base,
//   DatedFlightLeg: {
//     FlightCode: {
//       FlightNumber: base.flightNumbers.join('/'),
//       CarrierCode: base.flightNumbers[0]?.slice(0, 2) ?? '',
//     },
//     Leg: {
//       OriginStation: base.departureStation,
//     },
//     DateTimes: {
//       DateTimeLocal: formatDate(base.flightDate),
//       DateTimeStatus: 'Scheduled',
//       DateTimeType: 'Departure',
//     },
//   },
// };



// src/app/shared/forecast/forecast-mapper.ts
export type ForecastItem = {
  LoadType: 'BLK' | 'ULD';
  OffpointStation?: string;          // Dest
  UnitType?: string;                 // e.g., AKE
  SerialNumber?: string;             // e.g., 14102
  OwnerCode?: string;                // e.g., BA
  GrossWeight?: number;
  TareWeight?: number;
  Deadload?: {
    CommodityCode?: string;          // 'C'
    NetWeight?: number;
    EstimatedIndicator?: 'Y' | 'N';
  };
  Com?: string;                      // sometimes present
};

export type ForecastRow = {
  Ind: string | number | null;
  Type: string | null;
  Dest: string | null;
  ULDorBLK: string | null;
  Weight: number | null;
  ArrFlt: string | null;
  Origin: string | null;
  STA: string | null;
  Allot: string | null;
  Com: string | null;
  UnitComments: string | null;
};

export const DISPLAYED_COLUMNS: string[] = [
  'Ind',
  'Type',
  'Dest',
  'ULD or BLK',
  'Weight',
  'Arr Flt',
  'Origin',
  'STA',
  'Allot',
  'Com',
  'Unit Comments',
];

/** Canonical transform: raw API → table rows (used by both components). */
export function mapForecastToRows(items: ForecastItem[]): ForecastRow[] {
  return (items ?? []).map((item, idx) => {
    const type = item?.LoadType ?? null;

    const uldString =
      type === 'ULD'
        ? [item?.UnitType ?? '', item?.SerialNumber ?? '', item?.OwnerCode ?? '']
            .filter(Boolean)
            .join('')
        : 'BLK';

    // Weight rule: prefer Deadload.NetWeight → (Gross - Tare) → Gross
    const net = item?.Deadload?.NetWeight;
    const grossMinusTare =
      item?.GrossWeight != null && item?.TareWeight != null
        ? (item.GrossWeight as number) - (item.TareWeight as number)
        : null;
    const weight =
      net != null ? net : grossMinusTare != null ? grossMinusTare : item?.GrossWeight ?? null;

    const sta = item?.Deadload?.EstimatedIndicator === 'Y' ? 'VAL' : null; // placeholder
    const allot = 'VAL'; // placeholder until you have a real field

    const com = item?.Com ?? item?.Deadload?.CommodityCode ?? null;

    return {
      Ind: '',                      // or idx + 1 if you want numbering
      Type: type,
      Dest: item?.OffpointStation ?? null,
      ULDorBLK: uldString || null,
      Weight: weight ?? null,
      ArrFlt: null,
      Origin: null,
      STA: sta,
      Allot: allot,
      Com: com,
      UnitComments: null,
    };
  });
}

/** Shared trackBy to avoid re-rendering */


export function formatDate(date: string | undefined): string {
  if (!date) return ''; // ✅ Prevent error if date is missing
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

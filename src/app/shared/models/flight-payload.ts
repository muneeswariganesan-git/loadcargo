

// export interface FlightSearchPayload {
//   flightNumbers: string[];
//   flightDate: string;
//   departureStation: string;
//   product?: string;
//   productCode?: string;
// }


export interface FlightSearchPayload {
  // Required by your UI selection
  flightNumbers: string[];            // ["BA", "247", "A"] or ["BA", "247"]
  flightDate: string;                 // "2025-12-05T10:00:00"
  departureStation: string;           // "LHR"

  // New optional header-specific fields
  arrivalStation?: string;            // "JFK" (destination)
  flightNumberSuffix?: string;        // "A"
  iataServiceType?: string;           // "C"

  // Product details
  product?: string;                   // e.g. "Mail", "Cargo"
  productCode?: string;               // "MM"

}


export interface ViewInfoExtra {
  ViewFlightSummaryRequest: {
    CommodityCode: string[];
    DatedFlightLeg: {
      OperationalFlightNumber: string;
      OperatingCarrierCode: string;
      OriginStation: string;
      ScheduledDepartureDateLocal: string;
    };
    FMLoadIndicator: boolean;
  };
}


export interface FlightAnomalyRequest {
FlightAnomalyAndSystemDetails :{ 
DatedFlightLeg: {
  FlightCode: {
    FlightNumber: string;
    CarrierCode: string;
  };
  Leg: {
    OriginStation: string;
  };
  DateTimes: {
    DateTimeLocal: string;   // e.g., "2025-12-01T00:00:00"
    DateTimeStatus: string;  // e.g., "Scheduled"
    DateTimeType: string;    // e.g., "Departure"
  };
};
}
}

export interface AnomalyRow {
Status: string;
Priority: string;
Type: string;
Item: string;
Description: string;
}

export interface CargoAnomaliesApiResponse {
ViewCargoAnomaliesResponse: {
  DatedFlightLegAnomalyInformation: {
    DatedFlightLeg: {
      FlightCode: {
        FlightNumber: string;
        CarrierCode: string;
      };
      Leg: {
        OriginStation: string;
      };
      DateTimes: {
        DateTimeLocal: string;
        DateTimeStatus: string;
        DateTimeType: string;
      };
    };
    AnomalyInformation: Anomaly[];
  };
};
}

export interface Anomaly {

  AnomalyCode: string;
  AnomalyStatus: string;             
  AirWayBillIdentifier: string;     
  AnomalyPriority: string;           
  AnomalyDescription: string;       
  CargoProduct?: {
    CargoProductCode: string;
  };
  AnomalyTypeDetails: {
    AnomalyType: string;           
  };
};







export interface DeadloadExtra { DeadloadRequest: { weight: number; description: string }; }
export interface ViewOwnershipExtra { OwnershipRequest: { ownerId: string; ownerName: string }; }
export interface ForecastExtra { ForecastRequest: { forecastType: string; horizonDays: number }; }
export interface CapacityExtra { CapacityRequest: { includeContainers: boolean; includePallets: boolean }; }
export interface CommentsExtra { CommentsRequest: { includeCrewComments: boolean; includeOpsComments: boolean }; }
export interface LoadPlanExtra { LoadPlanRequest: { planVersion: string; includeULD: boolean }; }
export interface FitmentExtra { FitmentRequest: { fitmentType: string; includeNG: boolean }; }
export interface PassengerExtra { PassengerRequest: { includeCabinDetails: boolean; includeMealCodes: boolean }; }
export interface ProductExtra { ProductRequest: { includeOwnerDetails: boolean; includeManifestTimes: boolean }; }
export interface FlightStatusExtra { FlightStatusRequest: { includeScheduleStatus: boolean; includeLoadStatus: boolean }; }
export interface AircraftExtra { AircraftRequest: { includeRegistration: boolean; includeSubtype: boolean }; }
export interface CrewExtra { CrewRequest: { includeCrewList: boolean; includeCrewRoles: boolean }; }
export interface DelayExtra { DelayRequest: { includeDelayCodes: boolean; includeReason: boolean }; }

export interface ServiceExtras {
  viewInfo: ViewInfoExtra;
 // anomaly: FlightAnomalyRequest;
  deadload: DeadloadExtra;
  viewOwnership: ViewOwnershipExtra;
  forecast: ForecastExtra;
  capacity: CapacityExtra;
  comments: CommentsExtra;
  loadPlan: LoadPlanExtra;
  fitment: FitmentExtra;
  passenger: PassengerExtra;
  product: ProductExtra;
  flightStatus: FlightStatusExtra;
  aircraft: AircraftExtra;
  crew: CrewExtra;
  delay: DelayExtra;
}


export type ServicePayload<S extends keyof ServiceExtras> =
  FlightSearchPayload & ServiceExtras[S];

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CargoFlight {
  Flight: { OperationalFlightNumber: string; OperatorCarrierCode: string };
  ScheduledDepartureDateTime: string;
  Leg: { DepartureStationIATACode: string; ArrivalStationIATACode: string };
  AirfliteAircraftSubtype: string;
  IATAServiceType: string;
  ScheduledFlightStatus: string;
  CargoActivityDetails: {
    PlannedBuildCloseDateTime: string;
    PlannedManifestDateTime: string;
    PlannedLoadReleaseDateTime: string;
  };
  LoadReleaseStatus: string;
  AnomalyDetails?: {
    HighAnomalyCount?: string;
    LowAnomalyCount?: string;
    CapacityAnomalyCount?: string;
    FlightAnomalyCount?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FlightListService {
  getFlightList(payload: { ViewFlightListRequest: any }) {
    const response: any = {
      ViewFlightListResponse: {
        CargoFlights: [
          {
            Flight: {
              OperationalFlightNumber: '112',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T18:15:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77H',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T15:15:00',
              PlannedManifestDateTime: '2025-12-08T16:15:00',
              PlannedLoadReleaseDateTime: '2025-12-08T15:45:00',
            },
            LoadReleaseStatus: 'OPERATING',
            AnomalyDetails: {
              HighAnomalyCount: '0',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },

          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          {
            Flight: {
              OperationalFlightNumber: '178',
              OperatorCarrierCode: 'BA',
            },
            ScheduledDepartureDateTime: '2025-12-08T08:05:00',
            Leg: {
              DepartureStationIATACode: 'JFK',
              ArrivalStationIATACode: 'LHR',
            },
            AirfliteAircraftSubtype: '77M',
            IATAServiceType: 'J',
            ScheduledFlightStatus: 'NOT CANCELLED',
            CargoActivityDetails: {
              PlannedBuildCloseDateTime: '2025-12-08T05:05:00',
              PlannedManifestDateTime: '2025-12-08T06:05:00',
              PlannedLoadReleaseDateTime: '2025-12-08',
            },
            LoadReleaseStatus: 'Final',
            AnomalyDetails: {
              HighAnomalyCount: '1',
              LowAnomalyCount: '0',
              CapacityAnomalyCount: '0',
              FlightAnomalyCount: '0',
            },
          },
          
        ],
      },
    };

    return response?.ViewFlightListResponse?.CargoFlights.map((f: any) => ({
      flight: `${f.Flight.OperatorCarrierCode}${f.Flight.OperationalFlightNumber}`,
      Date: f.ScheduledDepartureDateTime, // raw iso; formatted in component
      STD: f.ScheduledDepartureDateTime, // raw iso; formatted in component to HHMM
      Dest: f.Leg.ArrivalStationIATACode, // <-- FIXED (was Departure)
      BC: f.CargoActivityDetails?.PlannedBuildCloseDateTime,
      CRE: f.CargoActivityDetails?.PlannedLoadReleaseDateTime,
      CRS: f.CargoActivityDetails?.PlannedLoadReleaseDateTime,
      ME: f.CargoActivityDetails?.PlannedManifestDateTime,
      Owner: '12345',
      Status: f.LoadReleaseStatus, // e.g., Provisional / Final
      High: f.AnomalyDetails?.HighAnomalyCount ?? '0',
      Low: f.AnomalyDetails?.LowAnomalyCount ?? '0',
      Cap: f.AnomalyDetails?.CapacityAnomalyCount ?? '0',
      Flt: f.AnomalyDetails?.FlightAnomalyCount ?? '0',
    }));
  }
}

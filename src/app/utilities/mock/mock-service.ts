import { Injectable } from '@angular/core';
import { defer, delay, map, Observable, of } from 'rxjs';
import { CargoAnomaliesApiResponse } from '../../shared/models/flight-payload';
import { FlightPayload, ViewFlightDGSLRequest } from '../../shared/models/dangerous-goods';


export interface FlightSearchPayload {
  flightNumbers: [string, string?];
  flightDate: string; // "DD-MMM-YYYY" (e.g., "25-NOV-2025")
  departureStation: string; // e.g., "LHR"
  productCode?: string; // MM/RR/NN/AA (optional for mock)
}




// src/app/models/airway-bill.model.ts
export interface AirWayBill {
  AirwayBillNumber: string;
  BoardPoint: string;
  OffPoint: string; // Destination
  Weight: number;
  Pieces: number;
  SpecialHandlingCodes?: string[];
  HazardousContent: boolean;
}

// src/app/models/view-flight-cargo-load-request.model.ts
export interface ViewFlightCargoLoadRequest {
  ViewFlightCargoLoadRequest: {
    DatedFlightLeg: {
      Flight: {
        OperatorCarrierCode: string;
        OperationalFlightNumber: string;
      };
      Leg: {
        OriginStation: string;
      };
      DateTimes: {
        DateTimeLocal: string; // ISO
        DateTimeStatus: 'Scheduled' | string;
        DateTimeType: 'Departure' | string;
      };
    };
    AWBInfoRequired: 'true' | 'false' | boolean;
  };
}

// src/app/models/view-flight-cargo-load-request.model.ts
export interface ViewFlightCargoLoadRequest {
  ViewFlightCargoLoadRequest: {
    DatedFlightLeg: {
      Flight: {
        OperatorCarrierCode: string;
        OperationalFlightNumber: string;
      };
      Leg: {
        OriginStation: string;
      };
      DateTimes: {
        DateTimeLocal: string; 
        DateTimeStatus: 'Scheduled' | string;
        DateTimeType: 'Departure' | string;
      };
    };
    AWBInfoRequired: 'true' | 'false' | boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MockService {

  
 private readonly mockResponse = {
  ViewFlightCargoLoadResponse: {
    FlightLoadDetails: {
      DatedFlightLegLoadDetails: {
        AirWayBillInformation: [
          {
            AirwayBillNumber: '12519922523',
            BoardPoint: 'JFK',
            OffPoint: 'LHR',
            Weight: 8,
            Pieces: 1,
            SpecialHandlingCodes: ['XCG', 'XPS'],
            HazardousContent: false
          },
          {
            AirwayBillNumber: '12519277414',
            BoardPoint: 'JFK',
            OffPoint: 'LHR',
            Weight: 2112,
            Pieces: 0,
            HazardousContent: false
          },
          {
            AirwayBillNumber: '12519738633',
            BoardPoint: 'JFK',
            OffPoint: 'LHR',
            Weight: 0.9,
            Pieces: 1,
            SpecialHandlingCodes: ['UPR'],
            HazardousContent: false
          }
        ]
      }
    }
  }
};

  /** Mock ViewFlightHeaderResponse */
  getFlightHeader(headerPayload: { ViewFlightHeaderRequest: any }): Observable<any> {
    console.log('[MOCK] getFlightHeader payload:', headerPayload);
    const mockHeaderResponse = {
      ViewFlightHeaderResponse: {
        CargoFlightHeaderDetails: {
          DatedFlightLeg: {
            OperatorCarrierCode: 'BA',
            OperationalFlightNumber: headerPayload?.ViewFlightHeaderRequest?.DatedFlightLeg?.OperationalFlightNumber,
            OriginStation: 'LHR',
            ScheduledDepartureDateLocal: '2025-11-25T08:20:00',
          },
           AircraftRegistrationCode: 'GVIIS',
          AirfliteAircraftSubtype: '77M',
          FMAircraftSubType: 'B777-236IGW',
          StandNumber: '534',
          FlightLeg: {
            FlightLegOrigin: 'LHR',
            FlightLegDestination: 'JFK',
            DateTimes: [
              {
                DateTimeLocal: '2025-11-25T11:20:00',
                DateTimeStatus: 'Scheduled',
                DateTimeType: 'Arrival',
              },
              {
                DateTimeLocal: '2025-11-25T08:20:00',
                DateTimeStatus: 'Scheduled',
                DateTimeType: 'Departure',
              },
            ],
            CancelledLeg: false,
          },
          FlightStatus: {
            GeneralStatusCode: 'GD',
            LoadControlStatusCode: 'LSF',
            LoadReleaseStatus: 'Final',
            ScheduleStatus: 'Not Cancelled',
          },
          CurrentFlightFitment: { PalletCount: 5, ContainerCount: 16 },
          NGRMFitment: { PalletCount: 6, ContainerCount: 14 },
          PassengerSummary: {
            Origin: 'LHR',
            Destination: 'JFK',
            CabinStatusCount: [
              { CabinCode: 'F', BookedCount: 5, AcceptedCount: 5 },
              { CabinCode: 'J', BookedCount: 50, AcceptedCount: 49 },
              { CabinCode: 'W', BookedCount: 29, AcceptedCount: 29 },
              { CabinCode: 'M', BookedCount: 137, AcceptedCount: 136 },
            ],
          },
          Product: {
            OwnerName: '',
            OwnerId: '',
            PlannedLoadReleaseTime: '2025-11-25T05:50:00',
            PlannedBuildCloseTime: '2025-11-25T05:20:00',
            PlannedManifestTime: '2025-11-25T06:20:00',
            ProductCode: 'MM',
          },
          IATAServiceType: 'V',
        },
      },
    };
    return of(mockHeaderResponse);
  }

  /** Mock ViewFlightSummaryResponse */
  getFlightSummary(payload: { ViewFlightSummaryRequest: any }): Observable<any> {
    console.log('[MOCK] getFlightSummary payload:', JSON.stringify(payload));
    const mockSummaryResponse = {
      ViewFlightSummaryResponse: {
        CargoFlightSummaryDetails: {
          DatedFlightLeg: {
            OperationalFlightNumber: '117',
            OperatingCarrierCode: 'BA',
            OriginStation: 'LHR',
            DestinationStation: 'JFK',
            ScheduledDepartureDateLocal: '2025-11-25T08:20:00',
            DateTimes: {
              DateTimeLocal: '2025-11-25T08:20:00',
              DateTimeStatus: 'Scheduled',
              DateTimeType: 'Departure',
            },
          },
          Comments: [
            {
              Comment: 'Remaining Empty Positions at Handover: NIL',
              UserName: 'Rutuja Gaikwad',
              DateTime: '2025-11-24T14:24:35',
            },
            {
              Comment: 'Baggage Offer at Handover: 7AKE',
              UserName: 'Rutuja Gaikwad',
              DateTime: '2025-11-24T14:24:41',
            },
            {
              Comment: 'RMD Travelling',
              UserName: 'Rutuja Gaikwad',
              DateTime: '2025-11-24T14:24:51',
            },
            {
              Comment: 'Fitment changed from 6P 14C to 5P 16C',
              UserName: 'Jonathan Brimicombe',
              DateTime: '2025-11-25T02:29:49',
            },
            {
              Comment: 'Mail telex sent',
              UserName: 'Alfiya Hussain',
              DateTime: '2025-11-25T04:56:59',
            },
            {
              Comment: 'Flight Cargo Released',
              UserName: 'Matthew Daley',
              DateTime: '2025-11-25T06:07:10',
            },
          ],
          LoadItems: [
            {
              LoadType: 'BLK',
              CLIPALoadIdentifier: '513975607',
              OffpointStation: 'JFK',
              SentToFMIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510171163',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 0,
                EstimatedIndicator: 'Y',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
            {
              LoadType: 'ULD',
              CLIPALoadIdentifier: '514001577',
              UnitType: 'AKE',
              SerialNumber: '14102',
              OwnerCode: 'BA',
              OffpointStation: 'JFK',
              GrossWeight: 375,
              TareWeight: 84,
              Priority: 3,
              ConfirmationStatus: true,
              SentToFMIndicator: true,
              BA80DeleteIndicator: false,
              Deadload: {
                CLIPADeadloadIdentifier: '510197133',
                DGSLCount: 0,
                CommodityCode: 'C',
                NetWeight: 291,
                EstimatedIndicator: 'N',
              },
            },
           
          ],
          CapacityBreakdown: {
            Commodities: [
              {
                CommodityCode: 'Cargo', //C
                NGRMPalletCount: 4,
                NGRMContainerCount: 6,
                EstimatedPalletCount: 3,
                EstimatedContainerCount: 6,
              },
              {
                CommodityCode: 'Prioritise', //Q-CHO
                NGRMPalletCount: 2,
                NGRMContainerCount: 3,
                EstimatedPalletCount: 2,
                EstimatedContainerCount: 2,
              },
              {
                CommodityCode: 'Courier', //Q-CHO
                NGRMPalletCount: 2,
                NGRMContainerCount: 3,
                EstimatedPalletCount: 2,
                EstimatedContainerCount: 2,
              },
              {
                CommodityCode: 'Mail', //M
                NGRMPalletCount: 0,
                NGRMContainerCount: 0,
                EstimatedPalletCount: 0,
                EstimatedContainerCount: 1,
              },
              {
                CommodityCode: 'Baggage', //B
                NGRMPalletCount: 0,
                NGRMContainerCount: 8,
                EstimatedPalletCount: 0,
                EstimatedContainerCount: 7,
              },
              {
                CommodityCode: 'EIC', //E
                NGRMPalletCount: 0,
                NGRMContainerCount: 0,
                EstimatedPalletCount: 0,
                EstimatedContainerCount: 0,
              },
              {
                CommodityCode: 'Others', //L
                NGRMPalletCount: 0,
                NGRMContainerCount: 0,
                EstimatedPalletCount: 0,
                EstimatedContainerCount: 0,
              },
              {
                CommodityCode: 'Empties', //L
                NGRMPalletCount: 0,
                NGRMContainerCount: 0,
                EstimatedPalletCount: 0,
                EstimatedContainerCount: 0,
              },
              {
                CommodityCode: 'Available', //A
                EstimatedPalletCount: 0,
                EstimatedContainerCount: 0,
              },
            
              {
                CommodityCode: 'Transit', //T
                NGRMPalletCount: 0,
                NGRMContainerCount: 0,
                EstimatedPalletCount: 0,
                EstimatedContainerCount: 0,
              },
            ],
          },
        },
      },
    };
    return of(mockSummaryResponse);
  }

  getAnomalies(request: any): Observable<CargoAnomaliesApiResponse> {
    const mock: CargoAnomaliesApiResponse = {
      ViewCargoAnomaliesResponse: {
        DatedFlightLegAnomalyInformation: {
          DatedFlightLeg: {
            FlightCode: {
              FlightNumber: 'BA',
              CarrierCode: '123',
            },
            Leg: {
              OriginStation: 'LHK',
            },
            DateTimes: {
              DateTimeLocal: '25',
              DateTimeStatus: 'Scheduled',
              DateTimeType: 'Departure',
            },
          },
          AnomalyInformation: [
            {
            AnomalyCode: '25-AWB-12517598302',
            AnomalyStatus: 'N',
            AirWayBillIdentifier: '12517598302',
            AnomalyPriority: 'Low',
            AnomalyDescription: 'HazDocs not on LAN',
            CargoProduct: { CargoProductCode: 'M' },
            AnomalyTypeDetails: { AnomalyType: 'Airwaybill' },
          },
          {
            AnomalyCode: '25-AWB-12517598302',
            AnomalyStatus: 'Y',
            AirWayBillIdentifier: '12517598302',
            AnomalyPriority: 'High',
            AnomalyDescription: 'HazDocs not on LAN',
            CargoProduct: { CargoProductCode: 'X' },
            AnomalyTypeDetails: { AnomalyType: 'Airwaybill' },
          },
          {
            AnomalyCode: '25-AWB-12517598302',
            AnomalyStatus: 'Z',
            AirWayBillIdentifier: '12517598302',
            AnomalyPriority: 'Medium',
            AnomalyDescription: 'HazDocs not on LAN',
            CargoProduct: { CargoProductCode: 'M' },
            AnomalyTypeDetails: { AnomalyType: 'Airwaybill' },
          },
          {
            AnomalyCode: '25-AWB-12517598302',
            AnomalyStatus: 'N',
            AirWayBillIdentifier: '12517598302',
            AnomalyPriority: 'Low',
            AnomalyDescription: 'HazDocs not on LAN',
            CargoProduct: { CargoProductCode: 'M' },
            AnomalyTypeDetails: { AnomalyType: 'Airwaybill' },
          }
        ],
        },
      },
    };

    return defer(() => of(mock)).pipe(delay(0));
  }

  getDeadloadGoods(req: ViewFlightDGSLRequest): Observable<FlightPayload> {
    // You can inspect req.ViewFlightDGSLRequest.CommodityCode here if you want different mock responses.

    const response: FlightPayload = {
      FlightInformation: {
        OperationalFlightNumber: '117',
        OperatorCarrierCode: 'BA',
        ScheduledDepartureDateTimeLocal: '2025-12-03T08:20:00',
        BoardPointStation: 'LHR',
      },
      DangerousGoodsDetails: [
        {
          SystemIdentifier: {
            DGSLIdentifier: {
              UniqueIdentifier: '157783893',
            },
            CLIPALoad: null,
            CLIPADeadload: null,
          },
          OffPointStation: 'JFK',
          AirwayBillNumber: '12521419160',
          ProperShippingName: 'Ethanol solution',
          ClassDivision: '3',
          UnitedNationsIdentifier: '1170',
          Pieces: '1',
          NetQuantityPerPackage: '0.302LT',
          DangerousGoodsCode: 'RFL',
          CargoAircraftOnly: 'false',
          EmergencyResponseCode: '3L',
          PackingGroup: 'II',
          NetWeight: '1',
          UnitLoadDevice: null,
          ULDSentToFM: null,
        },
        {
          SystemIdentifier: {
            DGSLIdentifier: {
              UniqueIdentifier: '157783894',
            },
            CLIPALoad: null,
            CLIPADeadload: null,
          },
          OffPointStation: 'JFK',
          AirwayBillNumber: '12521419160',
          ProperShippingName: 'Environmentally hazardous substance, liquid, n.o.s',
          ClassDivision: '9',
          UnitedNationsIdentifier: '3082',
          Pieces: '1',
          NetQuantityPerPackage: '1.03LT',
          DangerousGoodsCode: 'RMD',
          CargoAircraftOnly: 'false',
          EmergencyResponseCode: '9L',
          PackingGroup: 'III',
          NetWeight: '2',
          UnitLoadDevice: null,
          ULDSentToFM: null,
        },
        {
          SystemIdentifier: {
            DGSLIdentifier: {
              UniqueIdentifier: '157783912',
            },
            CLIPALoad: null,
            CLIPADeadload: null,
          },
          OffPointStation: 'JFK',
          AirwayBillNumber: '12521419160',
          ProperShippingName: 'Environmentally hazardous substance, liquid, n.o.s',
          ClassDivision: '9',
          UnitedNationsIdentifier: '3082',
          Pieces: '1',
          NetQuantityPerPackage: '0.153LT',
          DangerousGoodsCode: 'RMD',
          CargoAircraftOnly: 'false',
          EmergencyResponseCode: '9L',
          PackingGroup: 'III',
          NetWeight: '1',
          UnitLoadDevice: null,
          ULDSentToFM: null,
        },
        {
          SystemIdentifier: {
            DGSLIdentifier: {
              UniqueIdentifier: '157783906',
            },
            CLIPALoad: null,
            CLIPADeadload: null,
          },
          OffPointStation: 'JFK',
          AirwayBillNumber: '12521419160',
          ProperShippingName: 'Aviation regulated liquid, n.o.s',
          ClassDivision: '9',
          UnitedNationsIdentifier: '3334',
          Pieces: '1',
          NetQuantityPerPackage: '21.7LT',
          DangerousGoodsCode: 'RMD',
          CargoAircraftOnly: 'false',
          EmergencyResponseCode: '9A',
          PackingGroup: 'III',
          NetWeight: '22',
          UnitLoadDevice: null,
          ULDSentToFM: null,
        },
        {
          SystemIdentifier: {
            DGSLIdentifier: {
              UniqueIdentifier: '157789924',
            },
            CLIPALoad: {
              UniqueIdentifier: '514533928',
            },
            CLIPADeadload: {
              UniqueIdentifier: '510729484',
            },
          },
          OffPointStation: 'JFK',
          AirwayBillNumber: '12516990466',
          ProperShippingName: 'CONSUMER COMMODITY',
          ClassDivision: '9',
          UnitedNationsIdentifier: '8000',
          Pieces: '6',
          NetQuantityPerPackage: '12.8KG',
          DangerousGoodsCode: 'RMD',
          CargoAircraftOnly: 'false',
          EmergencyResponseCode: '9L',
          PackingGroup: null,
          NetWeight: '77',
          UnitLoadDevice: {
            UnitType: 'PMC',
            SerialNumber: '21484',
            OwnerCode: 'IB',
          },
          ULDSentToFM: 'True',
        },
      ],
      SpecialLoadDetails: [
        {
          SystemIdentifier: {
            DGSLIdentifier: {
              UniqueIdentifier: '157783295',
            },
            CLIPALoad: {
              UniqueIdentifier: '514533936',
            },
            CLIPADeadload: {
              UniqueIdentifier: '510729492',
            },
          },
          OffPointStation: 'JFK',
          AirwayBillNumber: '12521601285',
          Description: 'VALUABLE CARGO',
          Packages: '1',
          NetQuantityPerPackage: '1KG',
          SpecialLoadCode: 'VAL',
          NetWeight: '1',
          ULDSentToFM: 'True',
        },
      ],
    };

    return of(response);
  }

  

  fetchAirWayBillsWithMock(
    _payload: ViewFlightCargoLoadRequest
  ): Observable<AirWayBill[]> {
    const raw =
      this.mockResponse?.ViewFlightCargoLoadResponse?.FlightLoadDetails
        ?.DatedFlightLegLoadDetails?.AirWayBillInformation ?? [];

    return of(raw).pipe(
      delay(300),
      map((items: any[]) =>
        items.map((it) => ({
          AirwayBillNumber: it.AirwayBillNumber,
          BoardPoint: it.BoardPoint,
          OffPoint: it.OffPoint,
          Weight: Number(it.Weight ?? 0),
          Pieces: Number(it.Pieces ?? 0),
          SpecialHandlingCodes: it.SpecialHandlingCodes ?? [],
          HazardousContent: !!it.HazardousContent
        }))
      )
    );
  }

  
// mock-service.ts
getDeadloadSummary(payload: any) {

  const deadloadResponse = {
    "ViewFlightSummaryResponse": {
      "Errors": {
        "SIPError": [
          {
            "Code": "FWB30002",
            "SupplementaryInformation": {
              "FreeText": "Rejected due to Flight not found",
              "TextSubjectQualifier": "1",
              "Language": "EN",
              "Source": "S",
              "Encoding": "2"
            },
            "UUID": "dd9e5e0c-78a6-44c5-880c-807009180b67",
            "TimeStamp": "2025-12-15T11:18:33"
          },
          {
            "Code": "FWB30002",
            "SupplementaryInformation": {
              "FreeText": "Flight image request rejected. Flight not found.",
              "TextSubjectQualifier": "1",
              "Language": "EN",
              "Source": "S",
              "Encoding": "2"
            },
            "UUID": "03012ebe-0dca-4348-84b3-5d3cfe3f2a98",
            "TimeStamp": "2025-12-15T11:18:33"
          }
        ]
      },
      "CargoFlightSummaryDetails": {
        "DatedFlightLeg": {
          "OperationalFlightNumber": 117,
          "OperatingCarrierCode": "BA",
          "DestinationStation": "JFK",
          "OriginStation": "LHR",
          "ScheduledDepartureDateLocal": "2025-12-03T08:20:00",
          "DateTimes": {
            "DateTimeLocal": "2025-12-03T08:20:00",
            "DateTimeStatus": "Scheduled",
            "DateTimeType": "Departure"
          }
        },
        "LoadItems": [
          {
            "LoadType": "BLK",
            "CLIPALoadIdentifier": 514533936,
            "OffpointStation": "JFK",
            "SentToFMIndicator": true,
            "CustomerAllotmentCode": "VAL",
            "Deadload": {
              "CLIPADeadloadIdentifier": 510729492,
              "DGSLCount": 1,
              "CommodityCode": "C",
              "NetWeight": 1,
              "EstimatedIndicator": "N"
            }
          },
          {
            "LoadType": "BLK",
            "CLIPALoadIdentifier": 514533943,
            "OffpointStation": "JFK",
            "SentToFMIndicator": false,
            "Deadload": {
              "CLIPADeadloadIdentifier": 510729499,
              "DGSLCount": 0,
              "CommodityCode": "C",
              "NetWeight": 0,
              "EstimatedIndicator": "Y"
            }
          },
          {
            "LoadType": "ULD",
            "CLIPALoadIdentifier": 514533928,
            "UnitType": "PMC",
            "SerialNumber": 21484,
            "OwnerCode": "IB",
            "OffpointStation": "JFK",
            "GrossWeight": 2550,
            "TareWeight": 122,
            "Priority": 2,
            "CargoAgentComment": "PLANNED",
            "ConfirmationStatus": true,
            "SentToFMIndicator": true,
            "BA80DeleteIndicator": false,
            "AnomalyIndicator": false,
            "Deadload": {
              "CLIPADeadloadIdentifier": 510729484,
              "DGSLCount": 1,
              "CommodityCode": "C",
              "NetWeight": 2428,
              "EstimatedIndicator": "N"
            }
          },
          {
            "LoadType": "ULD",
            "CLIPALoadIdentifier": 514533937,
            "UnitType": "PAJ",
            "SerialNumber": "03736",
            "OwnerCode": "IB",
            "OffpointStation": "JFK",
            "GrossWeight": 430,
            "TareWeight": 120,
            "Priority": 3,
            "CargoAgentComment": "PLANNED",
            "ConfirmationStatus": true,
            "SentToFMIndicator": true,
            "BA80DeleteIndicator": false,
            "AnomalyIndicator": false,
            "Deadload": {
              "CLIPADeadloadIdentifier": 510729493,
              "DGSLCount": 0,
              "CommodityCode": "C",
              "NetWeight": 310,
              "EstimatedIndicator": "N"
            }
          },
          {
            "LoadType": "ULD",
            "CLIPALoadIdentifier": 514554003,
            "UnitType": "AKE",
            "SerialNumber": 12200,
            "OwnerCode": "BA",
            "OffpointStation": "JFK",
            "GrossWeight": 585,
            "TareWeight": 86,
            "Priority": 2,
            "CargoAgentComment": "PLANNED",
            "ConfirmationStatus": true,
            "SentToFMIndicator": true,
            "BA80DeleteIndicator": false,
            "AnomalyIndicator": true,
            "Deadload": {
              "CLIPADeadloadIdentifier": 510749559,
              "DGSLCount": 0,
              "CommodityCode": "C",
              "NetWeight": 499,
              "EstimatedIndicator": "N"
            }
          },
          {
            "LoadType": "ULD",
            "CLIPALoadIdentifier": 514554004,
            "UnitType": "AKE",
            "SerialNumber": 18103,
            "OwnerCode": "BA",
            "OffpointStation": "JFK",
            "GrossWeight": 325,
            "TareWeight": 70,
            "Priority": 3,
            "CargoAgentComment": "PLANNED",
            "ConfirmationStatus": true,
            "SentToFMIndicator": true,
            "BA80DeleteIndicator": false,
            "AnomalyIndicator": true,
            "Deadload": {
              "CLIPADeadloadIdentifier": 510749560,
              "DGSLCount": 0,
              "CommodityCode": "C",
              "NetWeight": 255,
              "EstimatedIndicator": "N"
            }
          }
        ]
      }
    }
  }
  return of(deadloadResponse);
}


}

import {
  serviceMappers,
  buildViewFlightSummaryRequest,
  // buildFlightAnomalyPayload,
  mapForecastToRows,
  formatDate
} from './payload-mapper';

import { getCommodityCodes } from '../models/product-mapping';

describe('payload-mapper utilities', () => {
  const base: any = {
    product: 'general',
    flightNumbers: ['BA123', 'BA456'],
    departureStation: 'LHR',
    flightDate: '01-JAN-2025'
  };

  // --------------------------------------------------------
  // formatDate()
  // --------------------------------------------------------
  describe('formatDate()', () => {
    it('should convert dd-MMM-yyyy to YYYY-MM-DDT00:00:00', () => {
      expect(formatDate('01-JAN-2025')).toBe('2025-01-01T00:00:00');
    });

    it('should return empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('');
    });
  });


  describe('buildViewFlightSummaryRequest() - FULL COVERAGE', () => {
    it('should map all fields correctly including formatted date', () => {
      const result = buildViewFlightSummaryRequest(base, 'general', true);
  
      expect(result.ViewFlightSummaryRequest.CommodityCode)
        .toEqual(getCommodityCodes('general'));
  
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperationalFlightNumber)
        .toBe('BA456'); // second element
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperatingCarrierCode)
        .toBe('BA123'); // first element
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OriginStation)
        .toBe('LHR');
  
      // IMPORTANT: This was missing
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.ScheduledDepartureDateLocal)
        .toBe('2025-01-01T00:00:00');
  
      expect(result.ViewFlightSummaryRequest.FMLoadIndicator).toBeTrue();
    });
  
    it('should fallback to empty OperationalFlightNumber if second element missing', () => {
      const base2 = {
        ...base,
        flightNumbers: ['BA123']
      };
  
      const result = buildViewFlightSummaryRequest(base2, 'general');
  
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperationalFlightNumber)
        .toBe('');
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperatingCarrierCode)
        .toBe('BA123'); // works because base2.flightNumbers[0]
    });
  
    it('should return empty date if flightDate is undefined', () => {
      const base3 = {
        ...base,
        flightDate: undefined
      };
  
      const result = buildViewFlightSummaryRequest(base3, 'general');
  
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.ScheduledDepartureDateLocal)
        .toBe(''); // formatDate(undefined) => ''
    });
  
    it('should allow overriding FMLoadIndicator to false', () => {
      const result = buildViewFlightSummaryRequest(base, 'general', false);
  
      expect(result.ViewFlightSummaryRequest.FMLoadIndicator).toBeFalse();
    });
  
    it('should return empty commodity array for unknown product', () => {
      const result = buildViewFlightSummaryRequest(base, 'unknown');
  
      expect(result.ViewFlightSummaryRequest.CommodityCode).toEqual([]);
    });
  });

  // --------------------------------------------------------
  // buildViewFlightSummaryRequest()
  // --------------------------------------------------------
  describe('buildViewFlightSummaryRequest()', () => {
    it('should build correct payload', () => {
      const result = buildViewFlightSummaryRequest(base, 'general', true);

      expect(result.ViewFlightSummaryRequest.CommodityCode)
        .toEqual(getCommodityCodes('general'));

      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperationalFlightNumber)
        .toBe('BA456');
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperatingCarrierCode)
        .toBe('BA123');
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OriginStation)
        .toBe('LHR');
      expect(result.ViewFlightSummaryRequest.FMLoadIndicator).toBeTrue();
    });
  });


  describe('buildViewFlightSummaryRequest() – FULL COVERAGE', () => {

    it('should map all fields when full data is present', () => {
      const base = {
        product: 'general',
        flightNumbers: ['BA123', 'BA456'],
        departureStation: 'LHR',
        flightDate: '01-JAN-2025'
      };
  
      const result = buildViewFlightSummaryRequest(base, 'general', true);
  
      expect(result.ViewFlightSummaryRequest.CommodityCode)
        .toEqual(getCommodityCodes('general'));
  
      // index 1 → BA456
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperationalFlightNumber)
        .toBe('BA456');
  
      // index 0 → BA123
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperatingCarrierCode)
        .toBe('BA123');
  
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OriginStation)
        .toBe('LHR');
  
      // date formatted
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.ScheduledDepartureDateLocal)
        .toBe('2025-01-01T00:00:00');
  
      expect(result.ViewFlightSummaryRequest.FMLoadIndicator).toBeTrue();
    });
  
  
    it('should fallback to empty OperationalFlightNumber if index 1 missing', () => {
      const base = {
        product: 'general',
        flightNumbers: ['BA123'],   // ❗ only one element → triggers fallback
        departureStation: 'LHR',
        flightDate: '01-JAN-2025'
      };
  
      const result = buildViewFlightSummaryRequest(base, 'general');
  
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperationalFlightNumber)
        .toBe('');
    });
  
  
    it('should fallback to empty OperatingCarrierCode if index 0 missing', () => {
      const base = {
        product: 'general',
        flightNumbers: [],          // ❗ empty array → triggers fallback
        departureStation: 'LHR',
        flightDate: '01-JAN-2025'
      };
  
      const result = buildViewFlightSummaryRequest(base, 'general');
  
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperatingCarrierCode)
        .toBe('');
    });
  
  
    
    it('should return empty date when flightDate is undefined', () => {
      const base3 = {
        product: 'general',
        flightNumbers: ['BA123', 'BA456'],
        departureStation: 'LHR',
        flightDate: undefined
      } as any;   // 👈 FIX: force-cast to bypass TS strict typing
    
      const result = buildViewFlightSummaryRequest(base3, 'general');
    
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.ScheduledDepartureDateLocal)
        .toBe('');
    });
  
    it('should default fmLoadIndicator to true when not passed', () => {
      const base = {
        product: 'general',
        flightNumbers: ['BA123', 'BA456'],
        departureStation: 'LHR',
        flightDate: '01-JAN-2025'
      };
  
      const result = buildViewFlightSummaryRequest(base, 'general');
  
      expect(result.ViewFlightSummaryRequest.FMLoadIndicator).toBeTrue();
    });
  
  
    it('should set fmLoadIndicator to false when provided', () => {
      const base = {
        product: 'general',
        flightNumbers: ['BA123', 'BA456'],
        departureStation: 'LHR',
        flightDate: '01-JAN-2025'
      };
  
      const result = buildViewFlightSummaryRequest(base, 'general', false);
  
      expect(result.ViewFlightSummaryRequest.FMLoadIndicator).toBeFalse();
    });
  
  
    it('should return empty commodity list for unknown product', () => {
      const base = {
        product: 'xyz',
        flightNumbers: ['BA123', 'BA456'],
        departureStation: 'LHR',
        flightDate: '01-JAN-2025'
      };
  
      const result = buildViewFlightSummaryRequest(base, 'xyz');
  
      expect(result.ViewFlightSummaryRequest.CommodityCode).toEqual([]);
    });
  
  
    it('should handle product = undefined using product ?? ""', () => {
      const base = {
        product: undefined,
        flightNumbers: ['BA123', 'BA456'],
        departureStation: 'LHR',
        flightDate: '01-JAN-2025'
      };
  
      const result = buildViewFlightSummaryRequest(base, undefined as any);
  
      expect(result.ViewFlightSummaryRequest.CommodityCode)
        .toEqual([]); // because getCommodityCodes('')
    });
  });

  // --------------------------------------------------------
  // buildFlightAnomalyPayload()
  // --------------------------------------------------------
  // describe('buildFlightAnomalyPayload()', () => {
  //   it('should map anomaly request correctly', () => {
  //     const result = buildFlightAnomalyPayload(base);

  //     expect(result.FlightAnomalyAndSystemDetails.DatedFlightLeg.FlightCode.FlightNumber)
  //       .toBe('BA456');
  //     expect(result.FlightAnomalyAndSystemDetails.DatedFlightLeg.FlightCode.CarrierCode)
  //       .toBe('BA123');
  //     expect(result.FlightAnomalyAndSystemDetails.DatedFlightLeg.Leg.OriginStation)
  //       .toBe('LHR');
  //     expect(result.FlightAnomalyAndSystemDetails.DatedFlightLeg.DateTimes.DateTimeLocal)
  //       .toBe('2025-01-01T00:00:00');
  //   });
  // });

  // --------------------------------------------------------
  // serviceMappers
  // --------------------------------------------------------
  describe('serviceMappers', () => {

    it('should run all mappers without errors', () => {
      Object.keys(serviceMappers).forEach(key => {
        const fn = (serviceMappers as any)[key];
        const result = fn(base);
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
      });
    });

    it('viewInfo mapper should return correct structure', () => {
      const result = serviceMappers.viewInfo(base);

      expect(result.ViewFlightSummaryRequest.CommodityCode)
        .toEqual(getCommodityCodes('general'));

      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperationalFlightNumber)
        .toBe('BA123/BA456');
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OperatingCarrierCode)
        .toBe('BA');
      expect(result.ViewFlightSummaryRequest.DatedFlightLeg.OriginStation)
        .toBe('LHR');
    });

    // it('anomaly mapper should return correct structure', () => {
    //   const res = serviceMappers.anomaly(base);

    //   expect(res.FlightAnomalyAndSystemDetails.DatedFlightLeg.FlightCode.FlightNumber)
    //     .toBe('BA123/BA456');
    // });

    it('deadload mapper works', () => {
      const res = serviceMappers.deadload(base);
      expect(res.DeadloadRequest.weight).toBe(1500);
    });

    it('viewOwnership mapper works', () => {
      const r = serviceMappers.viewOwnership(base);
      expect(r.OwnershipRequest.ownerId).toBe('123');
    });

    it('forecast mapper works', () => {
      const r = serviceMappers.forecast(base);
      expect(r.ForecastRequest.horizonDays).toBe(7);
    });

    it('capacity mapper works', () => {
      const r = serviceMappers.capacity(base);
      expect(r.CapacityRequest.includeContainers).toBeTrue();
    });

    it('comments mapper works', () => {
      const r = serviceMappers.comments(base);
      expect(r.CommentsRequest.includeCrewComments).toBeTrue();
    });

    it('loadPlan mapper works', () => {
      const r = serviceMappers.loadPlan(base);
      expect(r.LoadPlanRequest.planVersion).toBe('v1');
    });

    it('fitment mapper works', () => {
      const r = serviceMappers.fitment(base);
      expect(r.FitmentRequest.fitmentType).toBe('Current');
    });

    it('passenger mapper works', () => {
      const r = serviceMappers.passenger(base);
      expect(r.PassengerRequest.includeCabinDetails).toBeTrue();
    });

    it('product mapper works', () => {
      const r = serviceMappers.product(base);
      expect(r.ProductRequest.includeOwnerDetails).toBeTrue();
    });

    it('flightStatus mapper works', () => {
      const r = serviceMappers.flightStatus(base);
      expect(r.FlightStatusRequest.includeLoadStatus).toBeTrue();
    });

    it('aircraft mapper works', () => {
      const r = serviceMappers.aircraft(base);
      expect(r.AircraftRequest.includeRegistration).toBeTrue();
    });

    it('crew mapper works', () => {
      const r = serviceMappers.crew(base);
      expect(r.CrewRequest.includeCrewList).toBeTrue();
    });

    it('delay mapper works', () => {
      const r = serviceMappers.delay(base);
      expect(r.DelayRequest.includeDelayCodes).toBeTrue();
    });
  });

  // --------------------------------------------------------
  // mapForecastToRows
  // --------------------------------------------------------
  describe('mapForecastToRows()', () => {

    it('should map ULD correctly', () => {
      const rows = mapForecastToRows([
        {
          LoadType: 'ULD',
          UnitType: 'AKE',
          SerialNumber: '12345',
          OwnerCode: 'BA',
          Deadload: { NetWeight: 500 },
          Com: 'GEN'
        }
      ]);

      expect(rows[0].ULDorBLK).toBe('AKE12345BA');
      expect(rows[0].Weight).toBe(500);
      expect(rows[0].Com).toBe('GEN');
    });

    it('should map BLK with GrossWeight', () => {
      const rows = mapForecastToRows([{ LoadType: 'BLK', GrossWeight: 700 }]);
      expect(rows[0].ULDorBLK).toBe('BLK');
      expect(rows[0].Weight).toBe(700);
    });

    it('should compute (Gross - Tare)', () => {
      const rows = mapForecastToRows([
        { LoadType: 'BLK', GrossWeight: 900, TareWeight: 300 }
      ]);

      expect(rows[0].Weight).toBe(600);
    });

    it('should handle missing fields gracefully', () => {
      const rows = mapForecastToRows([{} as any]);
      expect(rows[0].Type).toBeNull();
      expect(rows[0].ULDorBLK).toBe('BLK');
    });
  });
});
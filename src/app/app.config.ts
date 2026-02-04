// app.config.ts (FINAL)
import {
  ApplicationConfig,
  APP_INITIALIZER,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';

import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withFetch,
} from '@angular/common/http';

import {
  IPublicClientApplication,
  PublicClientApplication,
  BrowserCacheLocation,
  LogLevel,
  InteractionType,
} from '@azure/msal-browser';

import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
} from '@azure/msal-angular';

import { routes } from './app.routes';
import { environment } from '../environments/environment.development';
//import { BackButtonDisableModule } from 'angular-disable-browser-back-button';

export function loggerCallback(level: LogLevel, message: string) {
  console.log(`[MSAL] ${message}`);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.msalConfig.auth.authority,
      redirectUri: environment.msalConfig.auth.redirectUri,
      postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
      // allowNativeBroker: false,
    },
  });
}

export function MSALGuardConfigFactory() {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {},
    loginFailedRoute: '/login-failed',
  };
}

export function MSALInterceptorConfigFactory() {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);

  protectedResourceMap.set(environment.loadCargoApi.uri, environment.loadCargoApi.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

// REQUIRED for MSAL 5.x to avoid uninitialized_public_client_application
export function initializeMsalFactory(msalService: MsalService) {
  return () => msalService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    importProvidersFrom(CommonModule),

    provideRouter(routes, withEnabledBlockingInitialNavigation()),

    provideHttpClient(withInterceptorsFromDi(), withFetch()),

    // MSAL Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },

    // MSAL Providers
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },

    MsalService,
    MsalGuard,
    MsalBroadcastService,

    // Ensure MSAL initializes BEFORE guards/interceptors/components run
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsalFactory,
      multi: true,
      deps: [MsalService],
    },

    // importProvidersFrom(
    //   BackButtonDisableModule.forRoot({ preserveScroll: true })
    // ),
  ],
};

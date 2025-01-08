import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {httpTokenInterceptor} from './services/interceptor/http-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpTokenInterceptor]), // Add your interceptor here
      withInterceptorsFromDi(), // To allow other DI-based interceptors
      withFetch()
    ),
     importProvidersFrom(
          CodeInputModule,
          ApiModule.forRoot({ rootUrl: 'http://localhost:8085/api/v1' })
        )
  ]
};

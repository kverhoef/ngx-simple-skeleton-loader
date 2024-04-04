import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { skeletonLoaderHttpInterceptor } from 'skeleton-loader';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors(
                [skeletonLoaderHttpInterceptor],
            )
        )
    ],
};

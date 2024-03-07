import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpParams, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SkeletonLoaderService } from './skeleton-loader.service';

export const skeletonLoaderHttpInterceptor: HttpInterceptorFn = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: HttpRequest<any>,
    next: HttpHandlerFn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Observable<HttpEvent<any>> => {
  const loaderService = inject(SkeletonLoaderService);
  const paramName = 'loader';

  const reqParams = request.params || new HttpParams();
  let showLoader = reqParams.get(paramName) !== 'false';
  if (reqParams.has(paramName)) {
    request = request.clone({
      params: reqParams.delete(paramName)
    });
  }

  if (showLoader) {
    showLoader = loaderService.startFullPageLoading();
  }

  return next(request)
      .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(error);
          }),
          finalize(() => {
            if (showLoader) {
              loaderService.stopFullPageLoading();
            }
          })
      );
}

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SkeletonLoaderService } from './skeleton-loader.service';

describe('SkeletonLoaderService', () => {
  let service: SkeletonLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkeletonLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit show loader event on start loading after delay time', fakeAsync(() => {
    let eventEmitted = false;
    const subscription = service.onShowFullPageLoader.subscribe(() => eventEmitted = true);
    service.startFullPageLoading();
    tick(0);
    expect(eventEmitted).toBe(false);
    tick(750);
    expect(eventEmitted).toBe(true);
    subscription.unsubscribe();
  }));

  it('should not emit show loader event twice if delay timer is already running', fakeAsync(() => {
    let numberOfEventEmitions = 0;
    const subscription = service.onShowFullPageLoader.subscribe(() => numberOfEventEmitions++);
    service.startFullPageLoading();
    service.startFullPageLoading();
    tick(750);
    expect(numberOfEventEmitions).toBe(1);
    subscription.unsubscribe();
  }));

  it('should emit hide loader event on stop loading if loader is shown', fakeAsync(() => {
    let eventEmitted = false;
    const subscription = service.onHideFullPageLoader.subscribe(() => eventEmitted = true);
    service.startFullPageLoading();
    tick(750);
    service.stopFullPageLoading();
    expect(eventEmitted).toBe(true);
    subscription.unsubscribe();
  }));

  it('should not emit hide loader event on stop loading if loader is not shown', fakeAsync(() => {
    let eventEmitted = false;
    const subscription = service.onHideFullPageLoader.subscribe(() => eventEmitted = true);
    service.startFullPageLoading();
    tick(100);
    service.stopFullPageLoading();
    expect(eventEmitted).toBe(false);
    subscription.unsubscribe();
  }));

  it('should not emit hide loader event on stop loading if loader is shown and multiple loading-starts exist', fakeAsync(() => {
    let eventEmitted = false;
    const subscription = service.onHideFullPageLoader.subscribe(() => eventEmitted = true);
    service.startFullPageLoading();
    tick(100);
    service.startFullPageLoading();
    tick(750);
    service.stopFullPageLoading();
    expect(eventEmitted).toBe(false);
    subscription.unsubscribe();
  }));

});

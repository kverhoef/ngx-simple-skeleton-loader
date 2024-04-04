# Skeleton loader

## Full page skeleton loader

The full page skeleton loader is the simplest way to add skeleton loading to your application.
All that has to be done is implement the interceptor (see below for the code example). Once added it will watch for http calls.
While http calls are requesting the skeleton loader will cover the whole page and block ui-input.

```{ provide: HTTP_INTERCEPTORS, useClass: SkeletonLoaderHttpInterceptor, multi: true }```

## Customizing the skeleton loader

### Excluding parts for the skeleton loading placeholder

Parts can be excluded for skeleton loading by adding the css class **skip-skeleton-loader** to the element.

```<div class="skip-skeleton-loader">This part will not be covered by the skeleton loader</div>```

### Add elements to be replaced by the skeleton loader

By default only text elements will be replaced by the skeleton loader placeholder. To add any other element, add the class **add-skeleton-loader**.

```<div class="add-skeleton-loader">This part will not be covered by the skeleton loader</div>```

## Partial skeleton loader ##
You can get more control to where the skeleton loader should be placed. This requires to specify which element should be blocked by the skeleton loader and which observable it should observe.

```
// 1 Reference a html element for the skeleton loader placement
@ViewChild('skeletonLoaderContainer') skeletonLoaderContainer: ElementRef;

// 2 Add the SkeletonLoaderService
constructor(private skeletonLoaderService: SkeletonLoaderService, private httpClient: HttpClient)

// 3 Use the loadWithSkeleton function
someMethod() {
    this.skeletonLoaderService.loadWithSkeleton(
        httpClient.get('http://example.com'),
        this.skeletonLoaderContainer
    ).subscribe();
}
```


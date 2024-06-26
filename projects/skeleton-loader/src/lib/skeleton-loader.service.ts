import { ApplicationRef, ComponentFactoryResolver, createComponent, ElementRef, EventEmitter, Injectable, Injector } from '@angular/core';
import { Observable, take } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SkeletonLoaderStyleComponent } from './skeleton-loader-style/skeleton-loader-style.component';

@Injectable({
    providedIn: 'root'
})
export class SkeletonLoaderService {

    public onShowFullPageLoader = new EventEmitter<void>();
    public onHideFullPageLoader = new EventEmitter<void>();
    public onShowSkeletonLoader = new EventEmitter<void>();
    public onHideSkeletonLoader = new EventEmitter<void>();

    private static CSS_CLASS_SHIMMER_CONTAINER = 'skeleton-loader-shimmer-container';
    private static CSS_CLASS_SHIMMER = 'skeleton-loader-shimmer';
    private static CSS_CLASS_REPLACED_ELEMENT = 'skeleton-loader-replaced-element';
    private static CSS_CLASS_SKIP_ELEMENT = 'skip-skeleton-loader';
    private static CSS_CLASS_ADD_ELEMENT = 'add-skeleton-loader';

    private delayTimer?: any;
    private delayTime = 500; // milliseconds
    private fullPageLoaderStarts = 0;
    private customLoaderStarts = 0;
    private loaderIsShown = false;

    constructor(
        private applicationRef: ApplicationRef,
    ) {
        // Add th style component to inject the styling for the skeleton loader
        const hostElement = this.getRootElement();
        const environmentInjector = applicationRef.injector;
        createComponent(SkeletonLoaderStyleComponent, {hostElement, environmentInjector});
    }

    /**
     * Do some action while blocking the UI with a skeleton loader.
     *
     * @param observable The observable on which we want to wait and show the skeleton loader while not completed.
     * @param elementRef The element ref which should be blocked by the skeleton loader.
     * @param dummyLoaderData optional argument with data to show while the skeleton-loader is shown.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public loadWithSkeleton<G>(observable: Observable<G>, elementRef: ElementRef, dummyLoaderData?: any): Observable<G> {
        this.customLoaderStarts++;
        return new Observable((wrapperObserver) => {
            setTimeout(() => {
                if (dummyLoaderData) {
                    // Show dummy data while loading
                    wrapperObserver.next(dummyLoaderData);
                }
                setTimeout(() => {
                    this.onShowSkeletonLoader.emit();
                    this.showSkeletonLoader(elementRef.nativeElement);

                    observable.pipe(take(1), finalize(() => {
                        this.customLoaderStarts--;
                        wrapperObserver.complete();

                        this.hideSkeletonLoader(elementRef.nativeElement);
                        this.onHideSkeletonLoader.emit();
                    })).subscribe(
                        res => wrapperObserver.next(res),
                    );
                });
            })
        });
    }

    public startFullPageLoading(): boolean {
        if (this.customLoaderStarts !== 0) {
            return false;
        }

        this.fullPageLoaderStarts++;
        if (!this.delayTimer) {
            this.delayTimer = setTimeout(() => {
                this.showFullPageLoader();
            }, this.delayTime);
        }

        return true;
    }

    public stopFullPageLoading(): void {
        this.fullPageLoaderStarts--;
        if (this.fullPageLoaderStarts === 0) {
            if (this.delayTimer) {
                clearTimeout(this.delayTimer);
                this.delayTimer = undefined;
            }
            this.hideFullPageLoader();
        }
    }

    private showSkeletonLoader(rootSkeletonElement: HTMLElement): void {
        rootSkeletonElement.classList.add(SkeletonLoaderService.CSS_CLASS_SHIMMER_CONTAINER);

        const div = document.createElement('div');
        div.classList.add(SkeletonLoaderService.CSS_CLASS_SHIMMER);
        rootSkeletonElement.appendChild(div);

        const nodesToBeReplaced: Node[] = this.getNodesToBeReplaced(rootSkeletonElement);
        nodesToBeReplaced.forEach(node => {
            if (!(node.parentNode as Element).classList.contains(SkeletonLoaderService.CSS_CLASS_REPLACED_ELEMENT)) {
                const span = document.createElement('loader');
                span.classList.add(SkeletonLoaderService.CSS_CLASS_REPLACED_ELEMENT);
                (node as Element).after(span);
                span.appendChild(node);
            }
        });
    }

    private hideSkeletonLoader(rootSkeletonElement: HTMLElement): void {
        rootSkeletonElement.classList?.remove(SkeletonLoaderService.CSS_CLASS_SHIMMER_CONTAINER);
        rootSkeletonElement.removeChild(rootSkeletonElement.lastChild as Node);

        const loaderElements = Array.from(document.getElementsByClassName(SkeletonLoaderService.CSS_CLASS_REPLACED_ELEMENT));
        loaderElements.forEach(element => {
            const textNode = element.firstChild;
            element.after(textNode as Element)
            element?.parentNode?.removeChild(element)
        });
    }

    private getNodesToBeReplaced(node: Node | undefined): Node[] {
        let nodesToBeReplaced: Node[] = [];
        for (node = node?.firstChild || undefined; node; node = node?.nextSibling || undefined) {
            const shouldSkipElement = (node as Element).classList?.contains(SkeletonLoaderService.CSS_CLASS_SKIP_ELEMENT);
            const shouldReplaceWithPlaceholder = node.nodeType === Node.TEXT_NODE || (node as Element).classList?.contains(SkeletonLoaderService.CSS_CLASS_ADD_ELEMENT)
            if (!shouldSkipElement && shouldReplaceWithPlaceholder) {
                nodesToBeReplaced.push(node);
            } else if (!shouldSkipElement) {
                nodesToBeReplaced = nodesToBeReplaced.concat(this.getNodesToBeReplaced(node));
            }
        }
        return nodesToBeReplaced;
    }

    private showFullPageLoader(): void {
        this.loaderIsShown = true;
        this.onShowFullPageLoader.emit();

        const rootElement = this.getRootElement();
        if (rootElement) {
            this.showSkeletonLoader(rootElement);
        }
    }

    private hideFullPageLoader(): void {
        if (this.loaderIsShown) {
            this.loaderIsShown = false;
            this.onHideFullPageLoader.emit();
            const rootElement = this.getRootElement();
            if (rootElement) {
                this.hideSkeletonLoader(rootElement);
            }
        }
    }

    private getRootElement(): HTMLElement {
        return document.getElementsByTagName('app-root')?.[0] as HTMLElement;
    }

}

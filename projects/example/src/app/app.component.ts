import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SkeletonLoaderService } from 'skeleton-loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild('skeletonLoaderContainer')
  skeletonLoaderContainer!: ElementRef<any>;

  catFacts: any;

  constructor(private httpClient: HttpClient, private skeletonLoaderService: SkeletonLoaderService) {

  }

  fullPageSkeletonLoaderExample() {
    this.getTestObservable$().subscribe(catFacts => {
      this.catFacts = catFacts
    });
  }

  partialSkeletonLoaderExample() {
    this.skeletonLoaderService.loadWithSkeleton(
        this.getTestObservable$(),
        this.skeletonLoaderContainer,
        [
          { text: 'Dummy data that will be shown while loading' }
        ]
    )
        .subscribe(catFacts => {
          this.catFacts = catFacts
        });
  }

  private getTestObservable$() {
    return this.httpClient.get('https://api.allorigins.win/raw?url=https://app.requestly.io/delay/2000/http://cat-fact.herokuapp.com/facts?' + Date.now());
  }

}

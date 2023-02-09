import { DOCUMENT, LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor( 
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly locationStrategy: LocationStrategy) {
  }
  
  getHomeUrl(): string {
    return `${this.document.location.origin}${this.locationStrategy.getBaseHref()}`
  }
}

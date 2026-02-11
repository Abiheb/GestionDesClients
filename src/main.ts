import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(
      routes,
      withComponentInputBinding(),    // 🔑 Lie les params/route data aux @Input() signals
      withViewTransitions()           // ✨ Transitions natives navigateur (Angular 17+)
    ),
    provideAnimations()
  ]
}).catch(err => console.error(err));
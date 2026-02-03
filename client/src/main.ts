import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { registerLicense } from '@syncfusion/ej2-base';

/**
 * Register Syncfusion license key
 * IMPORTANT: Replace with your own license key from https://www.syncfusion.com/account/manage-trials/downloads
 * You can get a free 30-day trial license or use a commercial license
 */
registerLicense('YOUR_SYNCFUSION_LICENSE_KEY_HERE');

/**
 * Bootstrap the Angular application
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

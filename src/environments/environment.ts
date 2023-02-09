// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBxxbbHq76AATfhAxi52sqgLyGVylLrsDg',
    authDomain: 'eq-help.firebaseapp.com',
    databaseURL: 'https://eq-help-default-rtdb.firebaseio.com',
    projectId: 'eq-help',
    storageBucket: 'eq-help.appspot.com',
    messagingSenderId: '181473157161',
    appId: '1:181473157161:web:f590e59cd3beeb2fb6fc38',
    measurementId: 'G-95906D6S63'
  },
  apis: {
    default: {
      url: 'https://localhost:5001'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

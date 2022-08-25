// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'avaulto-v2',
    appId: '1:486710240868:web:fa5f82cc3cb9219106e171',
    databaseURL: 'https://avaulto-v2-default-rtdb.firebaseio.com',
    storageBucket: 'avaulto-v2.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyDmXSWO04FnnBhsUJnRNRHyKtcMISBSfpo',
    authDomain: 'avaulto-v2.firebaseapp.com',
    messagingSenderId: '486710240868',
    measurementId: 'G-8GLJQE2K70',
  },
  production: false,
  solanaCluster:'https://api.devnet.solana.com',
  solanaEnv: 'dev'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

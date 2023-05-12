// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  ga:'',
  production: false,
  solanaEnv: 'devnet',
  orcaWhirlPool: {programId:'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',config:'FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR', poolAPI: 'https://api.devnet.orca.so/v1/whirlpool/list'},
  solanaCluster: 'https://rpc-devnet.helius.xyz/?api-key=fdfa656e-52a7-426c-a92c-7ba543750c52',// 'https://api.devnet.solana.com',//
  serverlessAPI: 'https://dev.compact-defi.xyz',
  HyperspaceKey:'',
  platformFeeCollector:'81QNHLve6e9N2fYNoLUnf6tfHWV8Uq4qWZkkuZ8sAfU1'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

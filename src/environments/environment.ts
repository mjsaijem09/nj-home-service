// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // api_url: "http://3.139.122.234:8090/api/pwa/", // hosted server
  // api_url: "http://localhost:9080/api/pwa/", //Local host
  api_url: 'https://home.dev.thebookus.com/api/pwa/',
  // image_url: "http://localhost:9080", //Local host
  image_url: 'https://home.dev.thebookus.com',
  // socket_url: "http://localhost:9080", //Local host
  socket_url: 'https://home.dev.thebookus.com',
  platform_url: 'https://app.dev.thebookus.com',
  webPush: {
    subject: 'https://fcm.googleapis.com/fcm/send/',
    publicKey:
      'BC1S9aHAHAZDj787AdEiLs11YIXcp58ecag13NsOsFQqQ4gM7G6jnWkyxSA_NejwMG-RXAVi63brxxT0E9303UE',
    privateKey: 'ofS8g75yVjr7iMZdGebA9pnT8CN6oo77kv7QjgqJrfw',
  },
  firebase: {
    apiKey: 'AIzaSyBHGJV3zUidq6hWG_P8EPLeM01fO8u1FTA',
    authDomain: 'massage-now-241210.firebaseapp.com',
    databaseURL: 'https://massage-now-241210.firebaseio.com',
    projectId: 'massage-now-241210',
    storageBucket: 'massage-now-241210.appspot.com',
    messagingSenderId: '105299849652',
    appId: '1:105299849652:web:84086403781290b07902e1',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

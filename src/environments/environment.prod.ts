export const environment = {
  production: true,
  // api_url: "http://3.139.122.234:8090/api/pwa/", // hosted server
  // api_url: "http://localhost:8090/api/pwa/", Local host
  api_url: 'https://home.thebookus.com/api/pwa/',
  image_url: 'https://home.thebookus.com',
  socket_url: 'https://home.thebookus.com',
  platform_url: 'https://app.thebookus.com',
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

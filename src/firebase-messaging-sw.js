importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js");
firebase.initializeApp({
  apiKey: "AIzaSyBHGJV3zUidq6hWG_P8EPLeM01fO8u1FTA",
  authDomain: "massage-now-241210.firebaseapp.com",
  databaseURL: "https://massage-now-241210.firebaseio.com",
  projectId: "massage-now-241210",
  storageBucket: "massage-now-241210.appspot.com",
  messagingSenderId: "105299849652",
  appId: "1:105299849652:web:84086403781290b07902e1",
});

const messaging = firebase.messaging();

// Handle Background Notifications
self.addEventListener("notificationclick", function (event) {
  console.log("On notification click: ", event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  console.log("event.action------", event.action);
  // console.log("user---------------", JSON.parse(localStorage.getItem('customerLogin')))
  if (event.action == "goNotificationPage") {
  }
  if (event.action == "likeReview") {
    // fetch('https://home.dev.thebookus.com/api/appointment/613b1a6de06fd80012b0a7d1', {
    // method: 'DELETE',
    // // body: {}, // string or object
    // headers: {
    //   'Content-Type': 'application/json'
    // }
    // }).then(response => {
    //   const myJson = response.json();
    //   console.log("myJson------", myJson)
    // })
    // .catch(error => {
    //   console.log("error------", error)
    // });
  }
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/notifications");
      })
  );
});

// If you would like to customize notifications that are received in the background (Web app is closed or not in browser focus) then you should implement this optional method
messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  var notificationTitle = "BookUs";
  var notificationOptions = {
    body: payload.data.text,
    icon: "https://home.thebookus.com/assets/website-logos/logo.png",
    image: "https://home.thebookus.com/assets/images/BookUs_logo.png",
    badge: "https://home.thebookus.com/assets/website-logos/logo.png",
  };

  if (
    payload.data.status == "10" ||
    payload.data.status == "5" ||
    payload.data.status == "9" ||
    payload.data.status == "16"
  ) {
    var appointment = JSON.parse(payload.data.appointmentData);
    var location = JSON.parse(payload.data.locationData);
    notificationTitle = location.name + " - " + appointment.service.name;
    notificationImage = location.image;
    var notificationOptions = {
      body:
        "Your booking at " +
        new Date(appointment.startTime).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "long",
          hour: "2-digit",
          hour12: false,
          minute: "2-digit",
        }) +
        " has been cancelled.",
      data: payload,
      actions: [{ icon: "like", title: "View", action: "goNotificationPage" }],
      icon: "https://home.thebookus.com/assets/website-logos/logo.png",
      image: "https://home.thebookus.com/assets/images/BookUs_logo.png",
      badge: "https://home.thebookus.com/assets/website-logos/logo.png",
    };
    console.log(notificationOptions);
    console.log(payload);
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

import PromiseApi       from 'services/promiseApi.js';
import PushNotification from 'react-native-push-notification';
import User             from 'stores/Account.js'
/*PushNotification.configure({

// (required) Called when a remote or local notification is opened or received
onNotification: function(notification) {
//console.log( 'NOTIFICATION:', notification );
},

// ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
//senderID: "YOUR GCM SENDER ID",
// Should the initial notification be popped automatically
// default: true
popInitialNotification: true,

/**
* (optional) default: true
* - Specified if permissions (ios) and token (android and ios) will requested or not,
* - if not, you must call PushNotificationsHandler.requestPermissions() later
*/
/*requestPermissions: true,
});*/

var alreadySendNotifs = [];

function isNew(id) {
  for (notif of alreadySendNotifs) {
    //console.log("notif : ", notif, " id : ", id);
    if (notif == id) {
      //console.log("False");
      return false;
    }
  }
  alreadySendNotifs.push(id);
  return true;
}

PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        //console.log( 'TOKEN:', token );
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        //console.log( 'NOTIFICATION:', notification );
        if (notification.userInteraction) {
          //console.log("User open notification !!!!!!");
        }
    },

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});

module.exports = () => {
  //console.log("######notif job#######");
  if (User.getState().notification == true) {
  PromiseApi.auth().get('/notifications/unread')
  .then((result) => {
      //console.log("read : ", result);
      for(notif of result) {
        //console.log("notif : ", notif);
        PushNotification.localNotification({
            /* Android Only Properties */
            // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            //ticker: "My Notification Ticker", // (optional)
            //autoCancel: true, // (optional) default: true
            //largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            //smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            //bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
            //subText: "This is a subText", // (optional) default: none
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'Visite', // (optional) add tag to message
            //group: "group", // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            /* iOS and Android properties */
            title: notif.title, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message: notif.body, // (required)
            playSound: false, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            //number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            //repeatType: 'day', // (Android only) Repeating interval. Could be one of `week`, `day`, `hour`, `minute, `time`. If specified as time, it should be accompanied by one more parameter 'repeatTime` which should the number of milliseconds between each interval
            //actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
          });
        }
        if (result.length !== 0) {
          PromiseApi.auth().put('/notifications/read')
          .then((result) => {
            //console.log("notifications put to read");
          })
          .catch((err) => {
            //console.log("catch !!!!!!!!", err);
          });
        }
      })
    .catch((err) => {
      //console.log("catch !!!!!!!!", err);
    });
  }
}

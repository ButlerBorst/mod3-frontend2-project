(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// const breakURL = 'http://localhost:3000/api/v1/breaks';
// const accountSid = 'AC90f8b4c917046d37d6af128295b2fe4d';
// const authToken = 'cb0191398a42c8c5531bbf4157ac32c1';
// const client = require('twilio')(accountSid, authToken);

let date = Date.now();
// let countdownMaxInMin = 20;
// let countdownMaxInSec = countdownMaxInMin * 60;
// let countdownMaxInMS = countdownMaxInSec * 1000;
//
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({})],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

chrome.storage.local.set({
  date: date
  isPaused: false,
  // countdownMaxInMin: countdownMaxInMin
});
//
// clearAndCreateAlarm(countdownMaxInMin,countdownMaxInMin);

// Add a listener for when the alarm is up.
// When the alarm is up, create a window with timer.html.

chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.storage.local.get('redirect_url', function (result) {
      chrome.windows.create({
        type: 'popup',
        url: result.redirect_url,
        focused: true
      })
      // let win = window.open(url, result.redirect_url);
      // win.focus()
      deactivateAlarm()
      // sendMessage()
    })
})


function sendMessage(){
  let message = ""
  chrome.storage.local.get('phone_number', function (result) {
    message = result.phone_number;


  client.messages.create({
  to: `+1${message}`,
  from: '+12406410870',
  body: 'This is a test for our break timer app!'
})

})
}

function deactivateAlarm(){

  let break_id = "";
  chrome.storage.local.get('break_id', function (result) {
    break_id = result.break_id;
    return fetch((breakURL + '/' + break_id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({active: false})
      })
      .then(res => res.json())
      .then (json => alert('Success:', JSON.stringify(json)))
      .catch(error => alert('Error:', error));
  });



}

// chrome.alarms.onAlarm.addListener(function(alarm) {
//   if (alarm.name == 'breakAlarm' + date) {
//     let nextAlarmTime = alarm.scheduledTime + countdownMaxInMS;
//     chrome.storage.local.set({nextAlarmTime: nextAlarmTime});
//
//     chrome.windows.create({
//       type: 'popup',
//       url: 'timer.html',
//       width: 500,
//       height: 520,
//       left: 5,
//       top: 100,
//       focused: true
//     });
//   } else {
//     chrome.alarms.getAll(function(data) {
//       data.forEach(function(alarm) {
//         if (alarm.name != 'breakAlarm' + date) {
//           chrome.alarms.clear(alarm.name);
//         }
//       });
//     });
//   }
// });

},{}]},{},[1]);

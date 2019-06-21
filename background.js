const breakURL = 'http://localhost:3000/api/v1/breaks';

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
  date: date,
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


// function sendMessage(){
//   let message = ""
//   chrome.storage.local.get('phone_number', function (result) {
//     message = result.phone_number;
//
//
//   client.messages.create({
//   to: `+1${message}`,
//   from: '+12406410870',
//   body: 'This is a test for our break timer app!'
// })
//
// })
// }

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

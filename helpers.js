let clearAndCreateAlarm = function(delayInMins) {
  alert("in clear and create")
  let delayInMS = delayInMins * 60000;
  chrome.storage.local.get('date', function(data) {
    chrome.alarms.get('breakAlarm' + data.date, function(alarm) {
      if (alarm) {
        chrome.alarms.clear('breakAlarm' + data.date);
      }
      chrome.alarms.create('breakAlarm' + data.date, {delayInMinutes: delayInMins/10});
      chrome.storage.local.set({nextAlarmTime: Date.now()+delayInMS});
    });
  });
}

let clearAlarm = function() {
  chrome.storage.local.get('date', function(data) {
    chrome.alarms.clear('breakAlarm' + data.date);
  });
}

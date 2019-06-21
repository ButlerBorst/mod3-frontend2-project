let clearAndCreateAlarm = function(delayInMins) {
  let delayInMS = delayInMins * 60000;
  chrome.storage.local.get('date', function(data) {
    chrome.alarms.get('breakAlarm' + data.date, function(alarm) {
      if (alarm) {
        chrome.alarms.clear('breakAlarm' + data.date);
      }
      chrome.alarms.create('breakAlarm' + data.date, {delayInMinutes: delayInMins});
      chrome.storage.local.set({nextAlarmTime: Date.now()+delayInMS});
    });
  });
}

let clearAlarm = function() {
  chrome.storage.local.get('date', function(data) {
    // chrome.alarms.clear('breakAlarm' + data.date);
    chrome.alarms.clearAll()
  });
}

const breakURL = 'http://localhost:3000/api/v1/breaks';
const usersURL = 'http://localhost:3000/api/v1/users';
let userID = 0;
let counterElement = document.getElementById('counter');
let switchButton = document.getElementById('switch');
let switchClasses = switchButton.classList;
let countdownInterval;
let count;
let newUserSubmitform = document.getElementById('new_profile_form')
let newUserNameInput = document.getElementById('new_user_name')
let defaultTime = document.getElementById('new_time')
let defaultUrlInput = document.getElementById('new_url')
let defaultPhoneInput = document.getElementById('new_phone')

let timerSubmitForm = document.getElementById("comment_form")
let timerInput = document.getElementById("time_input")
let urlInput = document.getElementById("url_input")
let phoneInput = document.getElementById("phone_input")

newUserSubmitform.addEventListener('submit', ev => {
  console.log('inside submit button')
  ev.preventDefault()
  submitNewUser(ev, newUserNameInput.value, defaultTime.value, defaultUrlInput.value, defaultPhoneInput.value)
})

function submitNewUser(ev, newUserName, defaultTime, defaultUrl, defaultPhone){
  return fetch(usersURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user_name: newUserName, default_break_time: defaultTime, default_url: defaultUrl, phone_number: defaultPhone})
  })
  .then(res => res.json())
  .then(json => {
    chrome.storage.local.set({'user_name': json.user_name})
    chrome.storage.local.set({'default_phone_number': json.phone_number})
    chrome.storage.local.set({'default_url': json.default_url})
    chrome.storage.local.set({'default_break_time': json.default_break_time})
    alert(`inside post to users`)

})
}


timerSubmitForm.addEventListener('submit', (ev) => {
  ev.preventDefault()
  initiateNewBreak(ev, parseInt(timerInput.value), urlInput.value, phoneInput.value)
})

function initiateNewBreak(ev, timerLength, urlInput, phoneInput){
  return fetch(breakURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({active: true, chosen_url: urlInput, chosen_break_time: timerLength, user_id: userID, phone_number: phoneInput})
  })
  .then(res => res.json())
  .then(json => {
    chrome.storage.local.set({'break_id': json.id})
    chrome.storage.local.set({'phone_number': json.phone_number})
    chrome.storage.local.set({'redirect_url': json.chosen_url})
    alert(`id: ${json.id}`)
    clearAndCreateAlarm(json.chosen_break_time)
})
}


let secToMin = function(timeInSec){
  let sec = timeInSec%60;
  let min = (timeInSec-sec)/60;
  if (sec < 10) {
    sec = '0' + sec;
  }
  return min + ':' + sec;
}

// This will get the next alarm time from storage,
// calculate that time minus the current time,
// convert to seconds, then set the popup to that time.
let updateCountdown = function() {
  chrome.storage.local.get('nextAlarmTime', function(data) {
    // This sort of prevents the race condition by choosing between
    // 0 and the actual count. We basically want to prevent the popup
    // from ever displaying a negative number.
    count = Math.max(0, Math.ceil((data.nextAlarmTime - Date.now())/1000));
    counterElement.textContent = secToMin(count);
  });
};

// Check if isPaused. If not,
// Call the update countdown function immediately
// Then update the countdown every 0.1s
chrome.storage.local.get('isPaused', function(data) {
  if (!data.isPaused) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 100);
    isNotPausedDisplay();
  } else {
    chrome.storage.local.get('pausedCount', function(data) {
      counterElement.innerHTML = secToMin(data.pausedCount);
    });
    isPausedDisplay();
  }
});

let isNotPausedDisplay = function() {
  switchClasses.add('is-not-paused');
  switchClasses.remove('is-paused');
  switchButton.textContent = 'Pause';
};

let isPausedDisplay = function() {
  switchClasses.add('is-paused');
  switchClasses.remove('is-not-paused');
  switchButton.textContent = 'Resume';
};

// If the switch is set on, continue counting down.
// If the switch is set to off, clear the existing alarm.
switchButton.onclick = function() {
  if (!switchClasses.contains('is-not-paused')) {
    // If isPaused = false, create the new alarm here.
    isNotPausedDisplay();
    chrome.storage.local.set({ isPaused: false });
    chrome.storage.local.get(['pausedCount','countdownMaxInMin'], function(data) {
      clearAndCreateAlarm(data.pausedCount/60);
    });
    countdownInterval = setInterval(updateCountdown, 100);
  } else {
    // If isPaused = true, store the existing count to pass back to
    // background.js, clear the existing alarm by using the date
    // in storage.
    isPausedDisplay();
    chrome.storage.local.set({
      isPaused: true,
      pausedCount: count
    });
    clearInterval(countdownInterval);
    clearAlarm();
  }
}

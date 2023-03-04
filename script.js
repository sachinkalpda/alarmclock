// alarm array
const alarm = (function () {


    const clock = document.querySelector('.clock');

    var alarms = [];

    const time = document.querySelector('.time');
    const zone = document.querySelector('.zone');
    const day = document.querySelector('.day');

    const add = document.querySelector('.add');
    const setAlarm = document.querySelector('.set-alarm');
    const addNewAlarmBtn = document.querySelector('#setAlarm');


    const newHrs = document.querySelector('#hour');
    const newMin = document.querySelector('#minutes');
    const newZone = document.querySelector('#zone');

    const alarmList = document.querySelector('#alarm-list');



    addNewAlarmBtn.addEventListener('click', function () {
        let alarmHrs = newHrs.value;
        let alarmMins = newMin.value;
        let alarmZone = newZone.value;
        // validate the hours from user
        if (alarmHrs == '' || alarmHrs <= 0 || alarmHrs > 12) {
            newHrs.style.borderColor = "red";
            return;
        }
        newHrs.style.borderColor = "cyan";

        // validate the minutes from user
        if (alarmMins == '' || alarmMins < 0 || alarmMins > 59) {
            newMin.style.borderColor = "red";
            return;
        }
        newMin.style.borderColor = "cyan";
        addAlarm(alarmHrs, alarmMins, alarmZone);
        resetValues();
        showAllAlarms();
    });

    add.addEventListener('click', function () {
        setAlarm.classList.toggle('visible');
    });


    //  to reset the input 

    function resetValues() {
        newHrs.value = '';
        newMin.value = '';
    }



    //  render alarm list

    function showAllAlarms() {

        alarmList.innerHTML = '';
        if (alarms.length > 0) {
            for (let i in alarms) {
                let li = document.createElement('li');
                console.log(i);
                let alarmTime = getTimeString(alarms[i].hours, alarms[i].minutes, 0);

                li.innerHTML = `<div class="alarm-time">
                                <div class="alarm-zone">${alarms[i].zone}</div>
                                <div class="alarm-time">${alarmTime}</div>
                            </div>
                            <div class="alarm-action">
                                <i class="delete fa-solid fa-trash" data-id="${alarms[i].id}"></i>
                            </div>`;
                alarmList.append(li);
            }
        } else {
            alarmList.innerHTML = `<li id="emptyListmsg">
                                    No Pending Alarms!
                                </li>`;
        }
    }



    // add new alarm
    function addAlarm(hrs, mins, zone) {
        let uniqueId = new Date().getUTCMilliseconds();
        // for create alarm object
        const alarm = {
            id: uniqueId,
            hours: hrs,
            minutes: mins,
            zone: zone
        }
        alarms.push(alarm);
    }






    // to start the time in clock
    function getTime() {
        let currentTime = new Date();
        let currentDay = currentTime.getDay();
        let hours = currentTime.getHours();
        let currentZone = getZone(hours);
        if (hours > 12) {
            hours = hours % 12;
        }
        let minutes = currentTime.getMinutes();
        let seconds = currentTime.getSeconds();
        let timeString = getTimeString(hours, minutes, seconds);
        time.innerHTML = timeString;
        zone.innerHTML = currentZone;
        day.innerHTML = dayName(currentDay);

        for (let i in alarms) {
            if (hours == alarms[i].hours && minutes == alarms[i].minutes && currentZone == alarms[i].zone && seconds == 0) {
                console.log('Triggered');
                let alarmId = alarms[i].id;
                clock.classList.add('vibrate');
                // play sound
                let audio = new Audio('./sound/clock_sound.mp3');
                audio.play();

                // loop sound
                audio.loop = true;

                // stop sound after 60 seconds
                setTimeout(function () {
                    clock.classList.remove('vibrate');
                    audio.pause();
                    deleteAlarm(alarmId);
                }, 60000);

            }
        }

    }


    // get day name
    function dayName(value) {
        if (value == 1) {
            return "Monday";
        }
        if (value == 2) {
            return "Tuesday";
        }
        if (value == 3) {
            return "Wednesday";
        }
        if (value == 4) {
            return "Thursday";
        }
        if (value == 5) {
            return "Friday";
        }
        if (value == 6) {
            return "Saturday";
        }
        if (value == 7) {
            return "Sunday";
        }
        return null;
    }

    // get time zone
    function getZone(hours) {
        if (hours >= 12) {
            return "PM";
        } else {
            return "AM";
        }
    }


    // get time string 
    function getTimeString(hours, minutes, seconds) {
        if (seconds / 10 < 1) {
            seconds = "0" + seconds;
        }

        if (minutes / 10 < 1) {
            minutes = "0" + minutes;
        }
        if (hours / 10 < 1) {
            hours = "0" + hours;
        }
        let timeString = hours + " : " + minutes + " : " + seconds;
        return timeString;
    }


    // to delete the alarm
    function deleteAlarm(id) {
        let result = alarms.filter(function (e) {
            return e.id != id;
        });
        alarms = result;
        // console.log(alarms);
        showAllAlarms();
    }



    // handle click events on dom
    function handleClickEvent(e) {
        const target = e.target;
        if (target.classList[0] === 'delete') {
            const alarmId = target.dataset.id;
            deleteAlarm(alarmId);
        }
    }

    function initialize() {
        window.addEventListener('click', handleClickEvent);


        // start the clock after interval of 1 sec
        setInterval(getTime, 1000);
    }

    return {
        initialize : initialize
    }
})();


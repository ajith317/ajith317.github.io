const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

const kickOffWorldCupDate = new Date('2024-07-07 09:00:00')

function zeroLeft (number) {
    return String(number).padStart(2, '0')
}

function diffKickOffDateWorldCup () {
    const currentDate = new Date().getTime()
    return kickOffWorldCupDate.getTime() - currentDate
}

function setCountDown (element, value) {
    document.querySelector(`.${element}`).innerHTML = value
}

function diffDay (diff) {
    return Math.floor(diff / day)
}

function diffHour (diff) {
    const round = Math.floor(diff % day / hour)
    return zeroLeft(round)
}

function diffMinute (diff) {
    const round = Math.floor(diff % hour / minute)
    return zeroLeft(round)
}

function diffSecond (diff) {
    const round = Math.floor(diff % minute / second)
    return zeroLeft(round)
}

function countDown() {
    const diff = diffKickOffDateWorldCup();

    if (diff <= 0) {
        // Countdown has reached zero, hide the countdown and display "It's completed"
        document.getElementById('count-down').style.display = 'none';
        document.getElementById('count-down-completed').style.display = 'block';
        clearInterval(window.load); // Stop the countdown interval
    } else {
       
        document.getElementById('count-down').style.display = 'flex';
        document.getElementById('count-down-completed').style.display = 'none'; // Hide "It's completed"
        setCountDown('days', diffDay(diff));
        setCountDown('hours', diffHour(diff));
        setCountDown('minutes', diffMinute(diff));
        setCountDown('seconds', diffSecond(diff));
    }
}

window.load = setInterval(countDown, 1000)


// Select all countdown elements
const countdownElements = document.querySelectorAll('#count-down li');

// Add click event listener to each countdown element
countdownElements.forEach(element => {
    element.addEventListener('click', () => {
        // Add a class to the clicked countdown element to trigger the animation
        element.classList.add('clicked');
        element.classList.add('pulsate');
        
        setTimeout(() => {
            element.classList.remove('pulsate');
        }, 1000); // Adjust the delay to match the animation duration
    });
});




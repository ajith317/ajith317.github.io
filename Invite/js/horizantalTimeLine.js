//About Mdu horizantal timeLine
const elH = document.querySelectorAll(".timeline li > div");

// START
window.addEventListener("load", init);

function init() {
    setEqualHeights(elH);
}

// SET EQUAL HEIGHTS
function setEqualHeights(el) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
    const singleHeight = el[i].offsetHeight;

    if (counter < singleHeight) {
        counter = singleHeight;
    }
    }

    for (let i = 0; i < el.length; i++) {
    el[i].style.height = `${counter}px`;
    }
}



    /********** Slider image ****************/


const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);


document.addEventListener("DOMContentLoaded", function() {
    var timePicker = flatpickr("#timePicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: new Date(), // Set the default date to now
    });
    debugger;

    // Add event listener to the time picker to detect changes
    timePicker.config.onChange.push(function(selectedDates, dateStr, instance) {
        var selectedTime = selectedDates[0];
        var currentHours = selectedTime.getHours();
        var currentMonth = selectedTime.getMonth(); // Get the current month (January is 0)
        var currentDay = selectedTime.getDate(); // Get the current day of the month

        // Check if current date is July 6th or July 7th
        if ((currentMonth === 6 && currentDay === 6 && currentHours >= 18 && currentHours < 22) || // July 6th 6 PM to 10 PM
            (currentMonth === 6 && currentDay === 7 && currentHours >= 8 && currentHours < 13)) { // July 7th 8 AM to 1 PM
            alert("Visiting during this time period is not allowed.");
            disableButtons();
            return; // Exit function
        } else {
            enableButtons();
        }

        // Check if current time is between 12 AM and 5 AM
        if (currentHours >= 0 && currentHours < 5) {
            alert("Are you sure you want to visit between 12AM and 5AM?");
            disableButtons();
        }
    });

    // Get all visit buttons
    var visitButtons = document.querySelectorAll('.visit-button');

    // Add click event listeners to the visit buttons
    visitButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth(); // Get the current month (January is 0)
            var currentDay = currentDate.getDate(); // Get the current day of the month
           
            debugger;
            var holdingTimesList = document.getElementById('holdingTimesList');

            var dataTime = parseInt(button.getAttribute('data-time')); // Get the data-time attribute value

            // Check if data-time attribute is valid
            if (!isNaN(dataTime)) {
                var selectedTime = timePicker.selectedDates[0]; // Get the selected time from flatpickr
                if (!selectedTime) {
                    alert("Please select a time.");
                    return; // Exit function if time is not selected
                }
                // Calculate the visit time by adding data-time hours to the selected time
                var visitTime = new Date(selectedTime.getTime() + dataTime * 60 * 60 * 1000);
				
				
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            var formattedDate = monthNames[currentDate.getMonth()] + '-' + currentDate.getDate(); // Format the date

                if (this.textContent === 'Remove Visit') {
                    // Subtract the data-time hours from the selected time
                    var newSelectedTime = new Date(selectedTime.getTime() - dataTime * 60 * 60 * 1000);
                    timePicker.setDate(newSelectedTime);
                } else {
                    // Set the visit time to the time picker
                    timePicker.setDate(visitTime);
                }

                // Check if the button text is 'Visit Now'
                if (this.textContent === 'Visit Now') {
                    this.textContent = 'Remove Visit';
                    this.setAttribute('data-visit-added', 'true'); // Mark button as having added visit
                    // Create a new list item for holding times
                    var listItem = document.createElement('li');
                    listItem.textContent = 'Holding Time: ' + visitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Use visit time
                    holdingTimesList.appendChild(listItem);

                    // Create a new timeline step
                    var timelineStep = document.createElement('div');
                    timelineStep.className = 'timeline-step';
                    timelineStep.setAttribute('data-year', formattedDate);
                    timelineStep.innerHTML = `
                        <div class="timeline-content" data-toggle="popover" data-trigger="hover" data-placement="top" title data-content="And here's some amazing content. It's very engaging. Right?" data-original-title="${formattedDate}">
                            <div class="inner-circle"></div>
                            <p class="h6 mt-3 mb-1">${formattedDate}</p>
                            <p class="h6 text-muted mb-0 mb-lg-0">You will return at: ${visitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    `;

                    var timelineSteps = document.querySelector('.timeline-steps');
                    timelineSteps.appendChild(timelineStep);
                } else {
                    this.textContent = 'Visit Now';
                    this.removeAttribute('data-visit-added'); // Remove added visit mark from button
                    // Remove the holding time from the list
                    var holdingTimes = holdingTimesList.querySelectorAll('li');
                    holdingTimes.forEach(function(holdingTime) {
                        var holdingTimeValue = holdingTime.textContent.split(': ')[1]; // Extract the time value from the list item
                        if (holdingTimeValue === visitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) {
                            holdingTimesList.removeChild(holdingTime);
                        }
                    });
                    // Remove the corresponding timeline step
                    var timelineSteps = document.querySelector('.timeline-steps');
                    var timelineStepToRemove = timelineSteps.querySelector(`.timeline-step[data-year="${formattedDate}"]`);
                    if (timelineStepToRemove) {
                        timelineSteps.removeChild(timelineStepToRemove);
                    }
                }
            }
        });
    });

    function disableButtons() {
        var visitButtons = document.querySelectorAll('.visit-button');
        visitButtons.forEach(function(button) {
            button.disabled = true;
        });
    }

    function enableButtons() {
        var visitButtons = document.querySelectorAll('.visit-button');
        visitButtons.forEach(function(button) {
            button.disabled = false;
        });
    }
});

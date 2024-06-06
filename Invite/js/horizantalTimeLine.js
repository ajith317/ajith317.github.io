const wrapper = document.querySelector(".timeLine-wrapper");
const carousel = document.querySelector(".TimeLine-carousel");
const firstCardWidth = carousel.querySelector(".timeLine-card").offsetWidth;
const arrowBtns = document.querySelectorAll(".timeLine-wrapper i");
const carouselChildren = [...carousel.children];

let isDragging = false, startX, startScrollLeft;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Update arrow button states
const updateArrowButtonState = () => {
    arrowBtns[0].style.display = carousel.scrollLeft <= 0 ? 'none' : 'block'; // Hide left arrow if at start
    arrowBtns[1].style.display = carousel.scrollLeft >= (carousel.scrollWidth - carousel.offsetWidth) ? 'none' : 'block'; // Hide right arrow if at end
};

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.id === "left") {
            carousel.scrollLeft -= firstCardWidth;
        } else {
            carousel.scrollLeft += firstCardWidth;
        }
        setTimeout(updateArrowButtonState, 300); // Update button state after scrolling animation
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
    if (!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
    updateArrowButtonState();
}

const checkEndOfScroll = () => {
    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    updateArrowButtonState();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", checkEndOfScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", checkEndOfScroll);

document.addEventListener("DOMContentLoaded", function() {
    var timePicker = flatpickr("#timePicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: new Date(), // Set the default date to now
    });

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
            alert("During this time, nothing will be open, so please change time");
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
				
                // Generate a unique ID for this visit
                var visitId = 'visit-' + visitTime.getTime();

                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                var formattedDate = monthNames[currentDate.getMonth()] + '-' + currentDate.getDate(); // Format the date

                if (this.textContent === 'Remove Visit') {
                    var newSelectedTime = new Date(selectedTime.getTime() - dataTime * 60 * 60 * 1000);
                    timePicker.setDate(newSelectedTime);
                } else {
                    timePicker.setDate(visitTime);
                }

                // Check if the button text is 'Visit Now'
                if (this.textContent === 'Visit Now') {
                    this.textContent = 'Remove Visit';
                    this.setAttribute('data-visit-added', 'true'); // Mark button as having added visit
                    this.setAttribute('data-visit-id', visitId); // Store the visit ID in the button
                    // Create a new list item for holding times
                    var listItem = document.createElement('li');
                    listItem.setAttribute('data-visit-id', visitId); // Store the visit ID in the list item
                    listItem.textContent = 'Holding Time: ' + visitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Use visit time
                    holdingTimesList.appendChild(listItem);

                    // Create a new timeline step
                    var timelineStep = document.createElement('div');
                    timelineStep.className = 'timeline-step';
                    timelineStep.setAttribute('data-visit-id', visitId); // Store the visit ID in the timeline step
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
                    var visitId = this.getAttribute('data-visit-id'); // Get the visit ID from the button
                    // Remove the holding time from the list
                    var holdingTimeToRemove = holdingTimesList.querySelector(`li[data-visit-id="${visitId}"]`);
                    if (holdingTimeToRemove) {
                        holdingTimesList.removeChild(holdingTimeToRemove);
                    }
                    // Remove the corresponding timeline step
                    var timelineStepToRemove = document.querySelector(`.timeline-step[data-visit-id="${visitId}"]`);
                    if (timelineStepToRemove) {
                        timelineStepToRemove.remove();
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

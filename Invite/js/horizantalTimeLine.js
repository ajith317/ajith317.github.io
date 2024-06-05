const wrapper = document.querySelector(".timeLine-wrapper");
const carousel = document.querySelector(".TimeLine-carousel");
const firstCardWidth = carousel.querySelector(".timeLine-card").offsetWidth;
const arrowBtns = document.querySelectorAll(".timeLine-wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Ensure there are enough cards to enable infinite scrolling
if (carouselChildrens.length > cardPerView) {
    // Insert copies of the last few cards to beginning of carousel for infinite scrolling
    carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
        carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });

    // Insert copies of the first few cards to end of carousel for infinite scrolling
    carouselChildrens.slice(0, cardPerView).forEach(card => {
        carousel.insertAdjacentHTML("beforeend", card.outerHTML);
    });
}

// Scroll the carousel at the appropriate position to hide the first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
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
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
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
            alert("During this time, nothing will be open");
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

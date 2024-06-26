/**
 * @author Mayur Patil <mayurpatild94@gmail.com>
 */
(function ($) {
    "use strict";
      $('.sakura-falling').sakura();
})(jQuery);

// $(document).on('click', function(){
//     document.getElementById("my_audio").play();
//     console.log('Shaadi me zaroor aana');
// });


// function onYouTubeIframeAPIReady() {
//     var ctrlq = document.getElementById("youtube-player");
//     var player = new YT.Player('youtube-player', {
//         height: ctrlq.dataset.height,
//         width: ctrlq.dataset.width,
//         events: {
//             'onReady': function (e) {
//                 e.target.cueVideoById({
//                     videoId: ctrlq.dataset.video,
//                     startSeconds: ctrlq.dataset.startseconds,
//                     endSeconds: ctrlq.dataset.endseconds
//                 });
//             }
//         }
//     });
// }


function openPopup() {
    $('#smallPopupModal').modal('show');
}



$(document).ready(function() {
    
    $('#yesBtn').click(function() {
        window.open('https://maps.app.goo.gl/yXatoLY6J7ivSffV6', '_blank'); 
        $('#smallPopupModal').modal('hide');       
    });

    $('#noBtn').click(function() {
        window.open('https://maps.app.goo.gl/jtxuZeSRJHA8Yh5u8', '_blank');
        $('#smallPopupModal').modal('hide');
    });

    $(window).click(function(event) {
        if (event.target === document.getElementById('smallPopupModal')) {
            $('#smallPopupModal').modal('hide');
        }
    });
});


/* openInvitation & downloadInvitation button design and logic*/
let hoverCountDownload = 0;
const btnDownload = document.querySelector('.btn-success');
const emojiDownload = document.querySelector('.btn-success .emoji');
const btnTextDownload = document.querySelector('.btn-success .btn-text');


let hoverCountOpen = 0;
const btnOpen = document.querySelector('.btnOpen');
const emojiOpen = document.querySelector('.btnOpen .emoji');
const btnTextOpen = document.querySelector('.btnOpen .btn-text');

document.addEventListener('mouseover', (event) => {
    const btnDownload = event.target.closest('.btn-success');
    const btnOpen = event.target.closest('.btnOpen');
    

    // Handle hover effect for "Download Invitation" button
    if (btnDownload) {
        hoverCountDownload++;
        if (hoverCountDownload > 8 && hoverCountDownload < 20) {
            emojiDownload.textContent = '😅'; // Change to sad emoji
            btnTextDownload.textContent = "Open invitation to save storage";
          
        } 
        else if(hoverCountDownload >= 20) {
            emojiDownload.textContent = '😢'; 
            btnTextDownload.textContent = "You will download or not?"; 
        }
        else {
            emojiDownload.textContent = '😍'; 
            btnTextDownload.textContent = "Download Invitation"; 
        } 
    }
    else {
        btnTextDownload.textContent = "Download Invitation"; // Reset text when mouse is not over the button
    }

    // Handle hover effect for "Open Invitation" button
    if (btnOpen) {
        hoverCountOpen++;
        if (hoverCountOpen > 8 && hoverCountOpen < 20) {
            emojiOpen.textContent = '🤨'; // Change to sad emoji
            btnTextOpen.textContent = "Not going to open?"; // Update button text
        } 
        else if(hoverCountOpen >= 20) {
            emojiOpen.textContent = '🤫'; // Change to angry emoji
            btnTextOpen.textContent = "Open & play game is availabel"; // Update button text
        }
        else {
            emojiOpen.textContent = '😊'; // Change to smile emoji
            btnTextOpen.textContent = "Open Invitation"; // Update button text
        } 
    }
    else {
        btnTextOpen.textContent = "Open Invitation"; // Reset text when mouse is not over the button
    }
});

document.addEventListener('click', (event) => {
    const btnDownload = event.target.closest('.btn-success');
    const btnOpen = event.target.closest('.btnOpen');
    console.log("asf");

    if (btnDownload) {
        hoverCountDownload = 0; // Reset hover count on click
    }

    if (btnOpen) {
        hoverCountOpen = 0; // Reset hover count on click
    }
});


//const images = ["image1.jpg", "image2.jpg", "image3.jpg"]; // List of image URLs

const images = [
    "D:/finalDInvite/assets/img/mapHeart2.jpg",
    "D:/finalDInvite/assets/img/right.jpg",
    "D:/finalDInvite/assets/img/left.jpg"
    // Add more image file paths as needed
];

let currentIndex = 0;

document.getElementById("showImageBtn").addEventListener("click", function() {
  showImage();
});

function showImage() {
  document.getElementById("displayedImage").src = images[currentIndex];
  document.getElementById("imageContainer").style.display = "block";
  toggleArrows();
}

function hideImage() {
  document.getElementById("imageContainer").style.display = "none";
}

function navigate(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  document.getElementById("displayedImage").src = images[currentIndex];
  toggleArrows();
}

function toggleArrows() {
  document.getElementById("prevBtn").style.display = currentIndex === 0 ? "none" : "block";
  document.getElementById("nextBtn").style.display = currentIndex === images.length - 1 ? "none" : "block";
}



// onclick imageGallery
const imageGallery = [
    "./Invite/assets/images/landingPics/out1.jpg",
    "./Invite/assets/images/landingPics/out2.jpg",
    "./Invite/assets/images/landingPics/out3.jpg",
    "./Invite/assets/images/landingPics/out4.jpg",
    "./Invite/assets/images/landingPics/out5.jpg",
    "./Invite/assets/images/landingPics/out6.jpg",
    "./Invite/assets/images/landingPics/out7.jpg",
    "./Invite/assets/images/landingPics/out8.jpg",
];

let intervalId;

let imagesPreloaded = [];

// Preload images
function preloadImages() {
    imageGallery.forEach(src => {
        const img = new Image();
        img.src = src;
        imagesPreloaded.push(img);
    });
}

// Show image
function showImage() {
    currentIndex = 0;
    displayImage();
    updateButtonsVisibility();
    updateIndicators();
    document.getElementById("onClickGalleryImages").style.display = "block";
    startSlideshow();
}

// Hide image
function hideImage() {
    document.getElementById("onClickGalleryImages").style.display = "none";
    clearInterval(intervalId);
}

// Navigate through images
function navigate(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = imageGallery.length - 1;
    } else if (currentIndex >= imageGallery.length) {
        currentIndex = 0;
    }
    displayImage();
    updateButtonsVisibility();
    updateIndicators();
}

// Display the current image
function displayImage() {
    const imgElement = document.getElementById("displayedImage");
    imgElement.src = imagesPreloaded[currentIndex].src;

    // Remove previous click event listener
    imgElement.removeEventListener("click", imageClickHandler);

    // Add click event listener to the displayed image
    imgElement.addEventListener("click", imageClickHandler);
}

// Handle image click
function imageClickHandler() {
    navigate(1); // Navigate to the next image
}

// Event listener for show image button
document.getElementById("showImageBtn").addEventListener("click", showImage);

// Preload images on page load
window.onload = preloadImages;

function updateButtonsVisibility() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    if (currentIndex === 0) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.display = "block";
    }
    if (currentIndex === imageGallery.length - 1) {
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "block";
    }
}

function updateIndicators() {
    const indicatorsContainer = document.getElementById("indicators");
    indicatorsContainer.innerHTML = "";
    for (let i = 0; i < imageGallery.length; i++) {
        const indicator = document.createElement("span");
        indicator.classList.add("indicator");
        if (i === currentIndex) {
            indicator.classList.add("active");
        }
        if (i < currentIndex) {
            indicator.classList.add("completed"); // Add completed class for indicators corresponding to displayed images
        }
        indicator.addEventListener("click", () => {
            currentIndex = i;
            displayImage();
            updateButtonsVisibility();
            updateIndicators();
        });
        indicatorsContainer.appendChild(indicator);
    }
}

function showImage() {
    currentIndex = 0;
    displayImage();
    updateButtonsVisibility();
    updateIndicators();
    document.getElementById("onClickGalleryImages").style.display = "block";
    startSlideshow(); // Start the slideshow when showing the image container
}

function startSlideshow() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        currentIndex++;
        if (currentIndex >= imageGallery.length) {
            clearInterval(intervalId); // Stop the slideshow after reaching the last image
            return;
        }
        displayImage();
        updateButtonsVisibility();
        updateIndicators();
    }, 4000); // Change slide interval as needed
}

document.getElementById("showImageBtn").addEventListener("click", showImage);


//*********************detailInfromationPopup ********************

// Get all trigger elements
var popupTriggers = document.querySelectorAll(".popup-trigger");

// Attach click event listener to each trigger element
popupTriggers.forEach(function(trigger) {
    trigger.addEventListener("click", function() {
        var popupId = this.getAttribute("data-popup-id");
        var popup = document.getElementById(popupId);
        popup.style.display = "block";
    });
});

// Close button functionality
var closeBtns = document.querySelectorAll(".close");
closeBtns.forEach(function(closeBtn) {
    closeBtn.addEventListener("click", function() {
        var popup = this.parentElement.parentElement; // Adjusted to reach the parent .detail-show-popup
        popup.style.display = "none";
    });
});

// Close popup when clicked outside of it
window.addEventListener("click", function(event) {
    popupTriggers.forEach(function(trigger) {
        var popupId = trigger.getAttribute("data-popup-id");
        var popup = document.getElementById(popupId);
        if (event.target !== trigger && event.target !== popup && !popup.contains(event.target)) {
            popup.style.display = "none";
        }
    });
});

// ********************* download invitation strat  *********************
function downloadFile(button) {
    var fileName = 'AjithAnuWeddingInvitation.png';
    var rawGitHubUrl = 'https://raw.githubusercontent.com/ajith317/ajith317.github.io/main/invitation/' + fileName;    

    fetch(rawGitHubUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            button.style.backgroundColor = '#9b6e98';
            button.style.borderColor = '#9b6e98';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


// // ********************* profile content  ********************* 
$(document).ready(function(){
    $('.popup-trigger').click(function(){
        var contentBlockId = $(this).attr('data-target');
        if ($(contentBlockId).is(':visible')) {
            $(contentBlockId).fadeOut(); // Hide the content block if it's already visible
        } else {
            $('.contentBlock').fadeOut(); // Hide any other visible content blocks
            $(contentBlockId).fadeIn(); // Show the clicked content block
        }
    });

    // Hide popup when clicking outside of it
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.contentBlock, .popup-trigger').length) {
            $('.contentBlock').fadeOut();
        }
    });
});

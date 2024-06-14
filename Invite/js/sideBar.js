$(document).ready(function () {
  // Function to validate phone number
  function validatePhoneNumber(phoneNumber) {
    // Check if phone number is exactly 10 digits
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phoneNumber);
  }

  // Function to validate OTP
  function validateOTP(otp) {
    // Check if OTP is non-empty
    return otp.trim().length > 0;
  }
  function updateButtonText(tabId) {
    $('#input-comment').css('opacity', tabId === "content1" ? '1' : '0');
    if (tabId === "content1") {
      $('#addCommentsBtn').html('<i class="fas fa-arrow-up"></i>');
    } else if (tabId === "content2") {
      $('#addCommentsBtn').html('Make my availability');
    }
  }

  // Handle tab change event
  $('#popupTabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var activeTab = $(e.target).attr('href').substring(1); // Get the ID of the active tab without the # prefix
    updateButtonText(activeTab); // Update the button text based on the active tab
  });

  // Show phone modal when addCommentsBtn is clicked
  $('#addCommentsBtn').click(async function () {
    const hasAccessToken = !!getAccessToken();
    const isClickActionForMakeMyAvailabilty = $('#addCommentsBtn').text().includes('Make my availability');
    if (hasAccessToken) {

      if (isClickActionForMakeMyAvailabilty) {
        const isAttend = confirm('Will you attend the event?');
        await makeMyAvailability(isAttend);
        renderAttendeesContent();
        return
      }

      // Hide phone number input, label, and OTP group
      $('#phoneNumber, label[for="phoneNumber"]').hide();
      $('#otpGroup').hide();

      // Hide Get OTP and Submit buttons
      $('#getOTPBtn').hide();
      $('#submitBtn').hide();

      // Hide basic details input
      $('#uname-group').hide();
      $('#relationType-group').hide();
      $('#colleagueRef-group').hide();
      $('#isAttend-group').hide();

      $('#textEditor').show();
      $('#submitCmnds').show();
      $('#submitAndDropdownRow').show();

      $('#phoneModal').modal('hide');

      const message = $('#input-comment').val().trim();
      if (!message) {
        $('#input-comment').focus();
        return;
      }
      await addComment(message);
      $('#input-comment').val('');
      reloadComments();
      
    } else {
      $('#comments').val($('#input-comment').val());
      $('#phoneModal').modal('show');
      $('#popupComment').modal('hide');
    }
  });


  // Event listener for phone number input
  $('#phoneNumber').on('input', function () {
    var phoneNumber = $(this).val().trim();
    if (validatePhoneNumber(phoneNumber)) {
      $('#getOTPBtn').show(); // Show Get OTP button when phone number is valid
    } else {
      $('#getOTPBtn').hide(); // Hide Get OTP button when phone number is invalid
      $('#otpGroup').hide(); // Hide OTP group when phone number is invalid
      $('#submitBtn').hide(); // Hide Submit button when phone number is invalid
    }
  });

  // Event listener for OTP input
  $('#otp').on('input', function () {
    var otp = $(this).val().trim();
    if (validateOTP(otp)) {
      $('#submitBtn').show(); // Show Submit button when OTP is entered
    } else {
      $('#submitBtn').hide(); // Hide Submit button when OTP is empty
    }
  });

  // Handle Submit button click
  $('#submitBtn').click(function () {
    var phoneNumber = $('#phoneNumber').val().trim();
    var otp = $('#otp').val().trim();

    // Check if phone number is empty
    if (phoneNumber === '') {
      // Indicate that phone number is required
      $('#phoneNumber').addClass('is-invalid');
      return;
    }

    // Remove any existing validation error styles
    $('#phoneNumber').removeClass('is-invalid');

    // Check if OTP is empty
    if (!validateOTP(otp)) {
      // Display error message or handle invalid OTP input
      return;
    }

    // confirmationResult.confirm(otp).then(result => {
    verifyOtp(phoneNumber ,otp, () => {
      // Hide phone number input, label, and OTP group
      $('#phoneNumber, label[for="phoneNumber"]').hide();
      $('#otpGroup').hide();

      // Hide Get OTP and Submit buttons
      $('#getOTPBtn').hide();
      $('#submitBtn').hide();

      // Show text editor and submit button
      $('#textEditor').show();
      $('#uname-group').show();
      $('#relationType-group').show();
      $('#relationType').change(() => {
        if ($('#relationType').val() === 'COLLEAGUE') {
          $('#colleagueRef-group').show();
        }
      })
      $('#isAttend-group').show();
      $('#submitCmnds').show();
      $('#submitAndDropdownRow').show(); // Show dropdown container

      $('#phoneModalLabel').text('Post your whises');
    }).catch(otpVerifyErr => {
      console.log(otpVerifyErr);
      alert('Invalid otp');
    })

  });


  $(document).ready(function () {
    // Toggle filter section when search button (filter icon) is clicked
    $('.filter-icon').click(function () {
      $('.filter-section').toggle();
    });
  });


});


// Function to handle filter section display
function toggleFilterSection() {
  var filterSection = document.querySelector('.filter-section');
  var modalContent = document.querySelector('.modal-content');

  if (filterSection.classList.contains('active')) {
    modalContent.classList.add('with-filter');
  } else {
    modalContent.classList.remove('with-filter');
  }
}

// Event listener for filter icon click
document.querySelector('.filter-icon').addEventListener('click', function () {
  var filterSection = document.querySelector('.filter-section');
  filterSection.classList.toggle('active');
  toggleFilterSection();
});

// Initially, check if filter section is active on page load
window.addEventListener('DOMContentLoaded', function () {
  toggleFilterSection();
});

// import * as firebase from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'
// const firebaseConfig = {
//     apiKey: "AIzaSyDj8UBeTKvqagXVdHPc5H04TcQ74Dza-Zw",
//     authDomain: "ajithbabu-8f783.firebaseapp.com",
//     projectId: "ajithbabu-8f783",
//     storageBucket: "ajithbabu-8f783.appspot.com",
//     messagingSenderId: "401394948115",
//     appId: "1:401394948115:web:f4b4c09bc5d5c8888287e6"
// };

// // Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// const auth = getAuth();
// auth.useDeviceLanguage();
// window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
//     'size': 'invisible',
//     'callback': (response) => {
//         // reCAPTCHA solved, allow signInWithPhoneNumber.
//     }
// });

$(document).ready(function () {
    // Handle Get OTP button click
    $('#getOTPBtn').click(async function () {
        // signInWithPhoneNumber(auth, `+91${$('#phoneNumber').val()}`, window.recaptchaVerifier)
        //     .then((confirmationResult) => {
        //         $('#loader').hide();
        //         // SMS sent. Prompt user to type the code from the message, then sign the
        //         // user in with confirmationResult.confirm(code).
        //         window.confirmationResult = confirmationResult;
        //         console.log(confirmationResult);
        //         $('#otpGroup').show(); // Show OTP input field
        //         $('#getOTPBtn').hide(); // Hide Get OTP button
        //         $('#submitBtn').hide(); // Hide Submit button until OTP is entered
        //         // ...
        //     }).catch((error) => {
        //         $('#loader').hide();
        //         // Error; SMS not sent
        //         // ...
        //         console.error(error)
        //         alert('Failed to send otp');
        //         window.recaptchaVerifier.render().then(function (widgetId) {
        //             grecaptcha.reset(widgetId);
        //         });
        //     });
        sendOtp($('#phoneNumber').val())
        $('#otpGroup').show(); // Show OTP input field
        $('#getOTPBtn').hide(); // Hide Get OTP button
        $('#submitBtn').hide(); // Hide Submit button until OTP is entered
    });

    $('#submitCmnds').click(async () => {
        const mobileNumber = $('#phoneNumber').val().trim();
        const otp = $('#otp').val().trim();
        const relationType = $('#relationType').val().trim();
        const name = $('#uname').val().trim();
        const colleagueRef = $('#colleagueRef').val().trim();
        const message = $('#comments').val().trim();
        const isAttend = $('#isAttend').prop('checked');
        const hasAccessToken = !!getAccessToken();
        const error = [];

        if (!message) {
            error.push('Message is required');
        }

        if (!hasAccessToken) {
            if (!mobileNumber || !otp) {
                location.reload();
                return;
            }

            if (!name) {
                error.push('Name is required');
            }

            if (!relationType) {
                error.push('Choose Relation Type');
            }

            if (relationType === 'COLLEAGUE' && !colleagueRef) {
                error.push('Emp Ref is required');
            }

            if (error.length > 0) {
                alert(error.join(', '));
                return;
            }
            await initialize(mobileNumber, otp, name, isAttend, relationType, colleagueRef, message);
            $('#phoneModal').modal('toggle');
            resetFormInput();
            reloadComments();
            reloadAttendees();
            location.reload();
        } else {
            if (error.length > 0) {
                alert(error.join(', '));
                return;
            }
            await addComment(message);
            $('#phoneModal').modal('toggle');
            resetFormInput();
            reloadComments();
            reloadAttendees();
        }
    });
});
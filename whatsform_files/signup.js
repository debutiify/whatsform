/* eslint-disable */

if (isMobileDevice()) {
  $('#signup-container-mobile').fadeIn('slow');
} else {
  $('#signup-container-desktop').fadeIn('slow');
}

// if (getCookie('wf-token')) {
//   $('#signup-container-desktop').hide();
//   $('#signup-container-mobile').show();
//   $('.login-button-text').text('Dashboard');
// }

function getIp(callback) {
  fetch('https://retrieve.whatsform.com/')
    .then((response) => response.json())
    .then((response) => callback(response.country.toLowerCase()))
    .catch(() => ({ country: 'us' }));
}

const phoneInputField = document.querySelector('#phone');
const phoneInput = window.intlTelInput(phoneInputField, {
  utilsScript:
    'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
  initialCountry: 'auto',
  separateDialCode: true,
  geoIpLookup: getIp,
});

const OTP_COUNTRIES = [
  '51',
  '52',
  '54',
  '55',
  '56',
  '57',
  '58',
  '593',
  '598',
  '595',
  '591',
  '971',
];

let intervalRef;
async function processSignup(event, lang) {
  event.preventDefault();
  event.stopImmediatePropagation();

  if (window.gtag) window.gtag('event', 'signedup');
  if (window.plausible) window.plausible('Signup');

  if (lang) createCookie('wf-language', lang, 30);

  $('.error-message').hide();

  const phoneNumber = phoneInput.getNumber().substring(1);

  if (phoneNumber.slice(0, 2) === '90' || phoneNumber.slice(0, 3) === '599') {
    return $('#error-401006').show();
  }

  if (!phoneInput.isValidNumber()) {
    return $('#error-401005').show();
  }

  $('#signup-form > button.action-button').hide();
  $('.loading-button').show();

  try {
    const response = await fetch(`${dashboardURL}/auth/whatsapp`, {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber: phoneNumber,
        language: lang,
      }),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      $('.hide-on-token-screen').hide();

      const isOTP = OTP_COUNTRIES.some(
        (code) => phoneNumber.indexOf(code) === 0
      );

      $('.signup-container-desktop-token-input').show();
      tokenInputs[0].focus();

      // if (isOTP) {
      //   $('.signup-container-desktop-token-input').show();
      //   tokenInputs[0].focus();
      // } else {
      //   $('.signup-container-desktop-waiting').show();
      //   intervalRef = setInterval(async () => {
      //     // check for user status
      //     const response = await fetch(
      //       `${dashboardURL}/auth/whatsapp/status?whatsappNumber=${phoneNumber}`,
      //       {
      //         mode: 'cors',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //       }
      //     );
      //     if (response.ok) {
      //       const data = await response.json();
      //       if (data.status === 'verified') {
      //         clearInterval(intervalRef);
      //         createCookie('wf-token', data.token, 31);
      //         window.location = dashboardURL;
      //       }
      //     }
      //   }, 2000);
      // }
    } else {
      $('#error-401004').show();
    }
  } catch (error) {
    $('.error-generic').show();
  }
  $('.loading-button').hide();
  $('#signup-form > button.action-button').show();
}

let verificationFailedOnce = false;
async function verifyToken() {
  $('.error-message').hide();

  const phoneNumber = phoneInput.getNumber().substring(1);
  const token = getToken();

  const tokenRegex = /^[0-9]{6}$/;

  if (tokenRegex.test(token)) {
    disableTokenInputs();
    $('#verification-token-input-loading').show();

    try {
      const response = await fetch(`${dashboardURL}/auth/whatsapp/callback`, {
        method: 'POST',
        body: JSON.stringify({
          whatsappNumber: phoneNumber,
          token: token,
        }),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        $('#verification-token-input-loading').hide();
        const data = await response.json();

        createCookie('wf-token', data.token, 31);
        return (window.location = dashboardURL);
      } else {
        const errorObject = await response.json();
        setTokenInputEmpty();
        $(`#error-${errorObject.code}`).show();
      }
    } catch (e) {
      $(`.error-generic`).show();
    }
  } else {
    $('#error-401003').show();
  }
  enableTokenInputs();
  verificationFailedOnce = true;
  $('#verification-token-input-loading').hide();
}

function cancelTokenVerification() {
  $('.error-message').hide();
  $('.signup-container-desktop-token-input').hide();
  $('.signup-container-desktop-waiting').hide();
  $('.hide-on-token-screen').fadeIn();
  setTokenInputEmpty();
  enableTokenInputs();
  if (intervalRef) clearInterval(intervalRef);
}

// Handle token input

const tokenSection = document.querySelector('.otp-input-section');
const tokenInputs = tokenSection.querySelectorAll('.otp-input-box');
for (let i = 0; i < tokenInputs.length; i++) {
  const ip = tokenInputs[i];
  ip.addEventListener('input', (event) => {
    if (event.target.value && i < tokenInputs.length - 1) {
      tokenInputs[i + 1].focus();
    }
    const tokenFilled = isTokenInputFilled();
    if (tokenFilled) {
      handleTokenSubmission();
    }
  });

  // Move focus to previous box if backspace is pressed on an empty ip
  ip.addEventListener('keydown', (event) => {
    if (
      !event.target.value &&
      (event.key === 'Backspace' || event.key === 'Delete')
    ) {
      event.preventDefault();
      tokenInputs[i > 0 ? i - 1 : i].focus();
    }
  });

  ip.addEventListener('paste', (event) => {
    event.preventDefault();
    const tokenEmpty = isTokenInputEmpty();
    if (tokenEmpty) {
      const pastedValue = (event.clipboardData || window.clipboardData).getData(
        'text'
      );
      let j;
      for (j = 0; j < pastedValue.length && j < tokenInputs.length; j++) {
        tokenInputs[j].value = pastedValue.charAt(j);
      }
      if (j < tokenInputs.length - 1) {
        tokenInputs[j].focus();
      } else tokenInputs[tokenInputs.length - 1].focus();

      const tokenFilled = isTokenInputFilled();
      if (tokenFilled) {
        handleTokenSubmission();
      }
    }
  });
}

let verifyTokenTimer;
function handleTokenSubmission() {
  clearTimeout(verifyTokenTimer);
  verifyTokenTimer = setTimeout(
    () => {
      if (isTokenInputFilled()) verifyToken();
    },
    verificationFailedOnce ? 2000 : 1000
  );
}

function isTokenInputFilled() {
  let tokenFilled = true;
  tokenInputs.forEach((ip) => {
    if (ip.value == '') tokenFilled = false;
  });
  return tokenFilled;
}

function isTokenInputEmpty() {
  let tokenEmpty = true;
  tokenInputs.forEach((ip) => {
    if (ip.value) tokenEmpty = false;
  });
  return tokenEmpty;
}

function setTokenInputEmpty() {
  tokenInputs.forEach((ip) => {
    ip.value = '';
  });
  tokenInputs[0].focus();
}

function getToken() {
  let value = '';
  tokenInputs.forEach((ip) => {
    value += ip.value;
  });
  return value;
}

function disableTokenInputs() {
  tokenInputs.forEach((ip) => {
    ip.disabled = true;
  });
}

function enableTokenInputs() {
  tokenInputs.forEach((ip) => {
    ip.disabled = false;
  });
}
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}

if (getUrlVars()['utm_source']) {
  if (getUrlVars()['utm_source'] === 'whatsform/broken') {
    $('.contactus').hide();
  } else {
    $('.contactus').attr(
      'href',
      'https://whatsform.help.center/contact/?utm_source=' +
        getUrlVars()['utm_source']
    );
  }
}

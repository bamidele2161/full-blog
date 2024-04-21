const showSuccessMessage = (message, type) => {
  var notificationElement =
    type === "success"
      ? document.getElementById("success-notification")
      : document.getElementById("error-notification");

  notificationElement.textContent = message;
  notificationElement.style.display = "block";

  // Hide the notification after a certain duration (e.g., 3 seconds)
  setTimeout(function () {
    notificationElement.style.display = "none";

    if (type === "success") {
      window.location.href = "../html/personal.html";
    }
  }, 3000); // 3000 milliseconds = 3 seconds
};
const getCsrfToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/csrf-token", {
      credentials: "include",
      method: "GET",
    });
    "wwww", response;
    if (!response.ok) {
      showSuccessMessage("Failed to fetch CSRF token: " + response.status);
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    showSuccessMessage("Error during fetching CSRF token:", error);
    // Handle the error appropriately, e.g., show an error message to the user
  }
};

const fonts = ["cursive", "sans-serif", "serif", "monospace"];
let captchaValue = "";
const generateCaptcha = () => {
  let value = btoa(Math.random() * 1000000000);
  value = value.substring(0, 5 + Math.random() * 5);
  captchaValue = value;
};

const setCaptcha = () => {
  let html = captchaValue
    .split("")
    .map((char) => {
      const rotate = -20 + Math.trunc(Math.random() * 30);
      const font = Math.trunc(Math.random() * fonts.length);
      return `<span style ="transform:rotate(${rotate}deg);
    font-family: ${fonts[font]}"> ${char}</span>`;
    })
    .join("");

  document.querySelector(".captcha .preview").innerHTML = html;
};

const initCaptcha = () => {
  generateCaptcha();
  setCaptcha();
};

initCaptcha();
console.log(captchaValue);
document
  .getElementById("captcha-refresh")
  .addEventListener("click", initCaptcha);

const displayError = (id, message) => {
  const element = document.getElementById(id);
  element.textContent = message;
  element.style.display = "block";
};

const clearError = () => {
  const error = document.querySelectorAll(".error");
  error.forEach((element) => {
    element.textContent = "";
    element.style.display = "none";
  });
};

const validateEmail = (email) => {
  const regEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(email);
};

const submitForm = async (event) => {
  let isValid = true;
  clearError();
  event.preventDefault(); // Prevent the default form submission

  // Retrieve input field values
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var inputCaptchaValue = document.getElementById("captcha-input-value").value;

  if (!validateEmail(email)) {
    displayError("emailError", "Please provide a valid email");
    isValid = false;
  } else if (password.length < 6) {
    displayError("passwordError", "Minimum of 6 characters");
    isValid = false;
  } else if (inputCaptchaValue === captchaValue && isValid) {
    const csrfToken = await getCsrfToken();

    "CSRF token", csrfToken;
    var data = {
      email: email,
      password: password,
    };

    fetch("http://localhost:8000/user/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify(data), // Convert data to JSON format
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          showSuccessMessage(data?.message, "success");
        } else {
          showSuccessMessage(data?.error, "error");
        }
        // Handle success response if required
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error if required
      });
  } else {
    showSuccessMessage("Invalid captcha", "error");
  }
};

document.getElementById("submit-btn").addEventListener("click", submitForm);

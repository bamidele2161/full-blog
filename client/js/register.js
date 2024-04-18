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
      window.location.href = "../html/login.html";
    }
  }, 3000); // 3000 milliseconds = 3 seconds
};

const submitForm = (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Retrieve input field values
  var firstname = document.getElementById("firstname").value;
  var lastname = document.getElementById("lastname").value;
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var inputCaptchaValue = document.getElementById("captcha-input-value").value;

  if (inputCaptchaValue === captchaValue) {
    // Create data object to send to endpoint
    var data = {
      first_name: firstname,
      last_name: lastname,
      // username: username,
      email: email,
      password: password,
      phone: "4345435345",
      image: "http://34535fgddgdfggdgd",
    };
    data;
    fetch("http://localhost:8000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convert data to JSON format
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          showSuccessMessage(data?.message, "success");

          document.cookie = `token=${data?.token}: path=/`;
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

document
  .getElementById("captcha-refresh")
  .addEventListener("click", initCaptcha);

document.getElementById("submit-btn").addEventListener("click", submitForm);

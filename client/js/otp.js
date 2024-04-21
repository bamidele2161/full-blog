const showSuccessMessage = (message, type) => {
  var notificationElement =
    type === "success"
      ? document.getElementById("success-notification")
      : document.getElementById("error-notification");
  message;
  notificationElement.textContent = message;
  notificationElement.style.display = "block";

  // Hide the notification after a certain duration (e.g., 3 seconds)
  setTimeout(function () {
    notificationElement.style.display = "none";

    if (type === "success") {
      window.location.href = "../html/reset.html";
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

const submitForm = async (event) => {
  event.preventDefault(); // Prevent the default form submission
  const csrfToken = await getCsrfToken();
  var code = document.getElementById("code").value;
  // Retrieve input field value
  var email = localStorage.getItem("email");
  const parseEmail = JSON.parse(email);

  // Create data object to send to endpoint
  var data = {
    email: parseEmail,
    ressetcode: code,
  };
  data;
  fetch("http://localhost:8000/user/verify", {
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
        "Success:", data;
        showSuccessMessage(data?.message, "success");
      } else {
        showSuccessMessage(data?.error, "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error if required
    });
};

document.getElementById("sign-up-form").addEventListener("submit", submitForm);

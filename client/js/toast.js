export const showSuccessMessage = (message) => {
  var notificationElement = document.getElementById("success-notification");
  notificationElement.textContent = message;
  notificationElement.style.display = "block";

  // Hide the notification after a certain duration (e.g., 3 seconds)
  setTimeout(function () {
    notificationElement.style.display = "none";
  }, 3000); // 3000 milliseconds = 3 seconds
};

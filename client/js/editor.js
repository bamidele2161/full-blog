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
      window.location.href = "../html/personal.html";
    }
  }, 3000); // 3000 milliseconds = 3 seconds
};

let fileLink;
let bannerPreview = document.getElementById("banner-preview");
const convertToLink = async (image) => {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "t7wur6tn");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dgqbdxvnr/image/upload`,
    {
      method: "post",
      body: data,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
  return await res;
};

const handleFile = async (e) => {
  try {
    const file = e.target.files[0];
    const reader = new FileReader();
    e.target, file, e;
    reader.onload = () => {
      bannerPreview.src = reader.result;
    };
    reader.readAsDataURL(file);
    const link = await convertToLink(file);
    fileLink = link?.url;
    fileLink;
    showSuccessMessage("File Uploaded successfully", "success");
  } catch (error) {
    error;
  }
};

const getCsrfToken = async () => {
  try {
    const response = await fetch("http://localhost:3000/csrf-token", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      fileLink;
      showSuccessMessage("Failed to fetch CSRF token: " + response.status);
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    showSuccessMessage("Error during fetching CSRF token:", error);
    // Handle the error appropriately, e.g., show an error message to the user
  }
};

// Retrieve input field values
var title = document.getElementById("title");
var body = document.getElementById("body");
var userId = 1;

const submitForm = async (event) => {
  const csrfToken = await getCsrfToken();
  event.preventDefault(); // Prevent the default form submission

  // Create data object to send to endpoint
  var data = {
    title: title.value,
    body: body.value,
    image: fileLink,
  };
  data;
  fetch(`http://localhost:8000/blog`, {
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
        data.message;
      } else {
        showSuccessMessage(data?.error, "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error if required
    });
};

const localBlog = JSON.parse(localStorage.getItem("blogItem"));

localBlog;
if (localBlog !== null) {
  title.value = localBlog.title;
  body.value = localBlog.body;
  bannerPreview.src = localBlog.image;

  document.getElementById("publish").addEventListener("click", async () => {
    // Create data object to send to endpoint
    const csrfToken = await getCsrfToken();
    var data = {
      title: title.value,
      body: body.value,
      image: !fileLink ? localBlog.image : fileLink,
    };

    data;
    fetch(`http://localhost:8000/blog/${localBlog.id}`, {
      method: "PUT",
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
          localStorage.clear("blogItem");
          data.message;
        } else {
          showSuccessMessage(data?.error, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error if required
      });
  });
} else {
  document.getElementById("publish").addEventListener("click", submitForm);
}

document.getElementById("banner-upload").addEventListener("change", handleFile);

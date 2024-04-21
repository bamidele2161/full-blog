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
    reader.onload = () => {
      bannerPreview.src = reader.result;
    };
    reader.readAsDataURL(file);
    const link = await convertToLink(file);
    fileLink = link?.url;
    showSuccessMessage("File Uploaded successfully", "success");
  } catch (error) {}
};

const getCsrfToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/csrf-token", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      showSuccessMessage("Failed to fetch CSRF token: " + response.status);
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    showSuccessMessage("Error during fetching CSRF token:", error);
  }
};

// Retrieve input field values
var title = document.getElementById("title");
var body = document.getElementById("body");

const submitForm = async (event) => {
  const csrfToken = await getCsrfToken();
  event.preventDefault(); // Prevent the default form submission

  // Create data object to send to endpoint
  var data = {
    title: title.value,
    body: body.value,
    image: fileLink,
  };

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
        showSuccessMessage(data?.message, "success");
      } else if (data.statusCode === 400) {
        showSuccessMessage(data?.error, "error");
      } else {
        showSuccessMessage(data.error + " Please Sign In", "error");
        window.location.href = "../html/login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const localBlog = JSON.parse(localStorage.getItem("blogItem"));

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
          showSuccessMessage(data?.message, "success");
          localStorage.clear("blogItem");
        } else {
          showSuccessMessage(data.error + " Please Sign In", "error");
          window.location.href = "../html/login.html";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
} else {
  document.getElementById("publish").addEventListener("click", submitForm);
}

const handleLogout = () => {
  document.cookie = "";
  localStorage.clear();

  fetch("http://localhost:8000/user/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        showSuccessMessage(data?.message, "success");
        window.location.href = "../html/login.html";
      } else {
      }
    });
};
document.getElementById("banner-upload").addEventListener("change", handleFile);

document.getElementById("logout").addEventListener("click", handleLogout);

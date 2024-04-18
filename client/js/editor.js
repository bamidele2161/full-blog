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

    // if (type === "success") {
    //   window.location.href = "../html/login.html";
    // }
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

// Retrieve input field values
var title = document.getElementById("title");
var body = document.getElementById("body");
var userId = 1;

const submitForm = (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Create data object to send to endpoint
  var data = {
    title: title.value,
    body: body.value,
    image: fileLink,
  };
  data;
  fetch(`http://localhost:8000/blog/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

  document.getElementById("publish").addEventListener("click", () => {
    // Create data object to send to endpoint
    var data = {
      title: title.value,
      body: body.value,
      image: !fileLink ? localBlog.image : fileLink,
    };

    data;
    fetch(`http://localhost:8000/blog/1/${localBlog.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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

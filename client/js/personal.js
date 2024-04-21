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
  }, 3000); // 3000 milliseconds = 3 seconds
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
    // Handle the error appropriately, e.g., show an error message to the user
  }
};

const submitForm = () => {
  // Create data object to send to endpoint
  fetch("http://localhost:8000/blog/user", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        data?.data?.map((item) => {
          const blogPost = `
              <div class="blog-cards" key=${item.id}>
              <img src=${item.image} class="blog-image" alt="" />
             <div class="down">
                <h1 class="blog-title">${item.title}</h1>
                <p class="blog-overview">
                ${item.body.slice(0, 150)}...
                </p>
                <div class="blog-btns">              
                    <button class="deleteBtn" data-id="${
                      item.id
                    }">Delete</button>
                    <a href="../html/editor.html" class="updateBtn" data-item='${JSON.stringify(
                      item
                    )}'>Update</a>
                </div>  
               </div>       
            </div>
              `;

          document.querySelector(".blogs-sections").innerHTML += blogPost;
        });

        document.querySelectorAll(".deleteBtn").forEach((btn) => {
          btn.addEventListener("click", deleteBlogPost);
        });

        document.querySelectorAll(".updateBtn").forEach((btn) => {
          btn.addEventListener("click", updateBlogPost);
        });
      } else {
        showSuccessMessage(data.error + "No Post, Please create post", "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const deleteBlogPost = async (e) => {
  const csrfToken = await getCsrfToken();
  const postId = e.target.dataset.id;
  fetch(`http://localhost:8000/blog/${postId}`, {
    method: "DELETE",
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        ("Blog post deleted successfully");
        showSuccessMessage(data.message, "success");
        // Remove the deleted blog post card from the UI
        e.target.closest(".blog-cards").remove();
      } else {
        showSuccessMessage(data.error + " Please Sign In", "error");
        window.location.href = "../html/login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const updateBlogPost = (e) => {
  e.stopPropagation();
  const blogItem = e.target.getAttribute("data-item");
  localStorage.setItem("blogItem", blogItem);
};

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

window.addEventListener("load", submitForm);

document.getElementById("logout").addEventListener("click", handleLogout);

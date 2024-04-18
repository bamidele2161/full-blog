const submitForm = () => {
  // Create data object to send to endpoint
  ("tesing");
  const selectedId = JSON.parse(localStorage.getItem("selectedId"));
  "selectedItem", selectedId;
  const id = parseInt(selectedId);
  fetch(`http://localhost:8000/blog/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        data?.data?.forEach((item) => {
          const blogPost = `
          <div class="details-banner">
            <img src=${item.image} class="details-blog-image" alt="" />
          </div>
                <h1 class="details-title">${item.title}</h1>
                <p class="published"><span>published on - ${item.created_at.slice(
                  0,
                  10
                )} </span></p>
                <div class="details-article">
                 ${item.body}
                </div>
                    `;
          blogPost;
          document.querySelector(".blog").innerHTML = blogPost;
        });
      } else {
      }
      // Handle success response if required
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error if required
    });
};

window.addEventListener("load", submitForm);

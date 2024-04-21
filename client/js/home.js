var list;
const searchInput = document.getElementById("searchQuery");

const getData = () => {
  // Create data object to send to endpoint
  ("tesing");
  fetch("http://localhost:8000/blog", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        list = data.data;
        filterData(searchInput.value);
      } else {
        console.error("Failed to fetch data");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const filterData = (searchQuery) => {
  const filteredList =
    searchQuery !== ""
      ? list.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : list;

  renderData(filteredList);
};

const renderData = (data) => {
  document.querySelector(".blogs-section").innerHTML = ""; // Clear previous data

  data.forEach((item) => {
    const blogPost = `
      <div class="blog-card" key=${item.id}>
        <img src=${item.image} class="blog-image" alt="" />
        <h1 class="blog-title">${item.title}</h1>
        <p class="blog-overview">${item.body.slice(0, 100)}...</p>
        <a href="./blog.html" class="btn dark read-btn" data-id="${
          item.id
        }">read</a>
      </div>
    `;

    document.querySelector(".blogs-section").innerHTML += blogPost;
  });

  document.querySelectorAll(".read-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedId = e.target.dataset.id;
      localStorage.setItem("selectedId", JSON.stringify(selectedId));
    });
  });
};

window.addEventListener("load", getData);

// Listen for input changes on search input
searchInput.addEventListener("input", () => {
  filterData(searchInput.value);
});

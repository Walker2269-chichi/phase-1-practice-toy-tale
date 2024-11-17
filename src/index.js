let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const apiUrl = "http://localhost:3000/toys";

  // Fetch and Display Toys
  fetch(apiUrl)
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => renderToy(toy));
    })
    .catch((error) => console.error("Error fetching toys:", error));

  // Render a Toy Card
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.classList.add("card");

    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" alt="${toy.name}" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Add event listener for the like button
    toyCard.querySelector(".like-btn").addEventListener("click", () => {
      handleLike(toy);
    });

    toyCollection.appendChild(toyCard);
  }

  // Handle New Toy Submission
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0,
    };

    // POST Request to Add New Toy
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((createdToy) => {
        renderToy(createdToy); // Add toy to DOM
        toyForm.reset(); // Reset form
      })
      .catch((error) => console.error("Error adding toy:", error));
  });

  // Handle Like Button Click
  function handleLike(toy) {
    const newLikes = toy.likes + 1;

    // PATCH Request to Update Likes
    fetch(`${apiUrl}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        const toyCard = document.getElementById(updatedToy.id).parentElement;
        const likeText = toyCard.querySelector("p");
        likeText.textContent = `${updatedToy.likes} Likes`; // Update DOM
        toy.likes = updatedToy.likes; // Update local toy object
      })
      .catch((error) => console.error("Error updating likes:", error));
  }
});

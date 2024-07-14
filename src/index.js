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

  const toyCollection = document.getElementById("toy-collection");

  // Fetch Andy's toys and render them
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      })
      .catch(error => console.error('Error fetching toys:', error));
  }

  // Render a single toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;
    card.appendChild(h2);

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");
    card.appendChild(img);

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;
    card.appendChild(p);

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.textContent = "Like ❤️";
    likeBtn.addEventListener("click", () => increaseLikes(toy, p));
    card.appendChild(likeBtn);

    toyCollection.appendChild(card);
  }

  // Increase likes of a toy
  function increaseLikes(toy, likesDisplay) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        likesDisplay.textContent = `${toy.likes} Likes`;
      })
      .catch(error => console.error('Error updating likes:', error));
  }

  // Add a new toy
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
      .then(response => response.json())
      .then(newToy => {
        renderToy(newToy);
        event.target.reset();
      })
      .catch(error => console.error('Error adding toy:', error));
  });

  // Initial fetch and render
  fetchToys();
});




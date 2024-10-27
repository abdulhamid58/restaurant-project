const body = document.querySelector("body");
const foodtypes = document.getElementById("ftype-container");
const recipesContainer = document.getElementById("recipes-container");
const backBtn = document.getElementById("back-button");
const foodList = document.getElementById("food-list");
const infoImage = document.getElementById("info-image");
const ingredientsList = document.getElementById("ingredients-list");
const directionsList = document.getElementById("directions-list");
const likeBtn = document.getElementById("like-btn");
const likesCount = document.getElementById("likes-count");
const commentForm = document.getElementById("comment-form");
const commentBox = document.getElementById("comment-box");
const commentsBox = document.getElementById("comments-box");

let currentFoodId = null;
let currentFoodType = null;

function handleFood(food) {
  currentFoodType = food;
  foodtypes.classList.add("hidden");
  recipesContainer.classList.remove("hidden");
  fetchFood(food);

  fetch(`http://localhost:4321/${food}/1`)
    .then((res) => res.json())
    .then((food) => showDetails(food));
}

function fetchFood(food) {
  fetch(`http://localhost:4321/${food}`)
    .then((res) => res.json())
    .then((data) => appendRecipes(data));
}

function appendRecipes(data) {
  console.log(data);
  data.forEach((food) => {
    const foodCard = document.createElement("li");
    foodCard.classList.add("food-card");
    foodCard.innerHTML = `
      <img src="${food.image}" alt="">
      <div>
        <h3>${food.name}</h3>
        <p>Rating: ${food.rating}</p>
      </div>
    `;

    foodCard.addEventListener("click", () => showDetails(food));
    foodList.appendChild(foodCard);
  });
}

function showDetails(food) {
  currentFoodId = food.id;

  foodtypes.classList.add("hidden");
  recipesContainer.classList.remove("hidden");
  infoImage.src = food.image;

  // Display ingredients
  ingredientsList.innerHTML = "";
  food.ingredients.forEach((ingredient) => {
    const ingredientListItem = document.createElement("li");
    ingredientListItem.textContent = ingredient.ingredient;
    ingredientsList.appendChild(ingredientListItem);
  });

  // Display directions
  directionsList.innerHTML = "";
  food.directions.forEach((direction) => {
    const directionListItem = document.createElement("li");
    directionListItem.textContent = direction.direction;
    directionsList.appendChild(directionListItem);
  });

  // Display likes and comments
  likesCount.textContent = `${food.likes} like`;
  commentsBox.innerHTML = "";
  const commentItem = document.createElement("p");
  commentItem.textContent = comment;
  commentsBox.appendChild(commentItem);
}

function navigateBack() {
  foodtypes.classList.remove("hidden");
  recipesContainer.classList.add("hidden");
}

likeBtn.addEventListener("click", () => {
  fetch(`http://localhost:4321/${currentFoodType}/${currentFoodId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likes: 1 }),
  })
    .then((res) => res.json())
    .then((data) => {
      likesCount.textContent = `${data.likes} likes`;
    })
    .catch((error) => console.error("Error updating likes:", error));
});

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const comment = commentBox.value.trim();

  if (comment) {
    fetch(`http://localhost:4321/${currentFoodType}/${currentFoodId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newComment = document.createElement("p");
        newComment.textContent = comment;
        commentsBox.appendChild(newComment);
        commentBox.value = "";
      })
      .catch((error) => console.error("Error posting comment:", error));
  }
});

backBtn.addEventListener("click", navigateBack);

function main() {
  appendFoodTypes();
}

main();

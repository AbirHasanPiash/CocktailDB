async function handleSearch(searchValue = "a") {
  try {
    if (!searchValue.trim()) {
      searchValue = "a";
    }
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.drinks) {
      displaySorry();
    } else {
      displayCard(data.drinks);
    }
  } catch (error) {
    console.error("Error fetching meal data:", error);
  }
}

handleSearch();

function displaySorry() {
  const cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML = ""; // Clear previous content before showing "Not Found"

  const div = document.createElement("div");
  div.innerHTML = `
      <h3>Not Found</h3>
  `;
  cardContainer.appendChild(div);
}

function displayCard(cocktails) {
  const cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML = "";
  cocktails.forEach((cocktail) => {
    const div = document.createElement("div");
    div.className = "card";
    div.id = cocktail.idDrink;
    const instructionsShort =
      cocktail.strInstructions.length > 15
        ? cocktail.strInstructions.substring(0, 15) + "..."
        : cocktail.strInstructions;
    div.innerHTML = `
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      <h2>${cocktail.strDrink}</h2>
      <p><strong>Category:</strong> ${cocktail.strCategory}</p>
      <p><strong>Instructions:</strong> ${instructionsShort}</p>
      <div class="btn-group">
          <button class="btn add">Add to Cart</button>
          <button class="btn details">Details</button>
      </div>
  `;
    cardContainer.appendChild(div);
  });
}

let totalItemInCart = 0;

async function fetchCocktailById(drinkId) {
  try {
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.drinks) {
      console.log("No drink found with the given ID.");
      return null;
    }

    return data.drinks[0]; // Return the first drink found
  } catch (error) {
    console.error("Error fetching cocktail data:", error.message);
    return null;
  }
}

async function addToCart(id) {
  totalItemInCart++;
  if (totalItemInCart === 8) {
    alert("You have reached maximum 7 items limit");
    totalItemInCart--;
    return;
  }
  const addToCartButton = document.getElementById(id).querySelector(".btn.add");
  addToCartButton.innerText = "Added";
  addToCartButton.classList.add("added");
  document.getElementById(
    "cart-heading"
  ).innerText = `Total item: ${totalItemInCart}`;
  const cartContainer = document.getElementById("cart-container");
  const drink = await fetchCocktailById(id);
  const div = document.createElement("div");
  div.innerHTML = `<div class="cart-elements">
            <div class="sl"><h5>${totalItemInCart}</h5></div>
            <div class="cart-img"><img class="cart-img" src="${drink.strDrinkThumb}" alt="${drink.strDrink}" /></div>
            <div class="name"><h5>${drink.strDrink}</h5></div>
          </div>`;
  cartContainer.appendChild(div);
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("added")) {
    return;
  }
  if (event.target.classList.contains("add")) {
    let card = event.target.closest(".card"); // Find closest parent with class "card"
    if (card) {
      let cardId = card.id; // Get the ID of the card
      addToCart(cardId);
    }
  }
});

function openModal() {
  let modal = document.getElementById("cocktail-modal");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10);
}

function closeModal() {
  let modal = document.getElementById("cocktail-modal");
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 500);
  document.getElementById("cocktail-modal").innerHTML = "";
}

async function createModal(id) {
  const drink = await fetchCocktailById(id);
  console.log(drink);
  const modalContainer = document.getElementById("cocktail-modal");
  const div = document.createElement("div");
  div.classList.add("modal-content");
  div.innerHTML = `<span class="close" onclick="closeModal()">&times;</span>
        <img
          src="${drink.strDrinkThumb}" alt="${drink.strDrink}"
        />
        <h2>${drink.strDrink}</h2>
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
        <p>
          <strong>Instructions:</strong> ${drink.strInstructions}</p>`;
  modalContainer.appendChild(div);
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("details")) {
    let card = event.target.closest(".card"); // Find closest parent with class "card"
    if (card) {
      let cardId = card.id; // Get the ID of the card
      createModal(cardId);
      openModal();
    }
  }
});

// Event listener for searching
document.getElementById("search-button").addEventListener("click", () => {
  const searchValue = document.getElementById("search-value").value;
  handleSearch(searchValue);
});

// Allow pressing "Enter" for search
document
  .getElementById("search-value")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const searchValue = document.getElementById("search-value").value;
      handleSearch(searchValue);
    }
  });

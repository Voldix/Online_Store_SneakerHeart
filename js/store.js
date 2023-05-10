import items from "../items.json";
import formatCurrency from "../util/formatCurrency.js";
import { addToCart } from "./shoppingCart.js";
import addGlobalEventListener from "../util/addGlobalEventListener.js";

// access to store template
const storeItemTemplate = document.querySelector("#store-item-template");
// access to acctual container
const storeItemContainer = document.querySelector("[data-store-container]");

export function setupStore() {
    if (storeItemContainer == null) return;
    
    //  setting up a global event listener for all of our different buttons for adding item to the cart
    addGlobalEventListener("click", "[data-add-to-cart-button]", e => {
        // to get the ID of our element
        const id = e.target.closest("[data-store-item]").dataset.itemId;
        // ID will be string, so convert it to a number
        addToCart(parseInt(id));
    })
    // recalling "renderStoreItem" function for each one of items
    items.forEach(renderStoreItem);
}

// function for rendering item in store
// passing 1 item from our list
function renderStoreItem(item) {
    // getting all the content inside of template
    const storeItem = storeItemTemplate.content.cloneNode(true);

    // we need access to all individual sections
    const container = storeItem.querySelector("[data-store-item]");
    container.dataset.itemId = item.id;

    const name = storeItem.querySelector("[data-name]");
    name.innerText = item.name;

    const category = storeItem.querySelector("[data-category]");
    category.innerText = item.category;

    const image = storeItem.querySelector("[data-img]");
    image.src = item.imageColor;

    const price = storeItem.querySelector("[data-price]");
    price.innerText = formatCurrency(item.priceCents / 100);

    // appending clone of template to our acctual container
    storeItemContainer.appendChild(storeItem);
}
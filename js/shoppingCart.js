import items from "../items.json";
import formatCurrency from "../util/formatCurrency.js";
import addGlobalEventListener from "../util/addGlobalEventListener.js";

// access to cart button
const cartButton = document.querySelector("[data-cart-button]");
// access to cart wrapper
const cartItemsWrapper = document.querySelector("[data-cart-items-wrapper]");
// for cart content
let shoppingCart = [];
// access to cart item template
const cartItemTemplate = document.querySelector("#cart-item-template");
// access to cart conteiner for item
const cartItemContainer = document.querySelector("[data-cart-items-container]");
// access to quantity of the cart
const cartQuantity = document.querySelector("[data-cart-quantity]");
// access to total price in the cart
const cartTotal = document.querySelector("[data-cart-total]");
// access to cart section/container
const cart = document.querySelector("[data-cart]");
// KEY for storing information
const SESSION_STORAGE_KEY = "SNEAKERHEART-cart";

export function setupShoppingCart() {
    // glodal event listener for removing the item from the cart button 
    addGlobalEventListener("click", "[data-remove-from-cart-button]", e => {
        const id = parseInt(e.target.closest("[data-item]").dataset.itemId);
        removeFromCart(id);
    })

    shoppingCart = loadCart();
    renderCart();

    // show/hide the cart when clicked
    cartButton.addEventListener("click", () => {
        // showing/hiding the cart content
        cartItemsWrapper.classList.toggle("invisible");
    })
}

// persisting cart across multiple pages
function saveCart() {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart));
}
function loadCart() {
    const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return JSON.parse(cart) || [];
}

export function addToCart(id) { // here we gonna pass in the ID of our item
    // handling multiple of the same item in the cart
    // checking to see if we already have an item with the same ID
    const existingItem = shoppingCart.find(entry => entry.id === id)
    if (existingItem) {
        existingItem.quantity++;
    } else {
        shoppingCart.push({ 
            id: id, 
            quantity: 1 
        });
    }
    renderCart();
    saveCart();
}

// removing items from cart
function removeFromCart(id) {
    const existingItem = shoppingCart.find(entry => entry.id === id)
    // exit out immediately if no item
    if (existingItem == null) return;
    // otherwise, if we have items - we need to get them from the shopping cart
    shoppingCart = shoppingCart.filter(entry => entry.id !== id); 
    renderCart();
    saveCart();
}

// show/hide the cart button when it has no items or when it goes from 0 to 1 item
function renderCart() {
    // checking the amount of items in the cart
    if (shoppingCart.length === 0) {
        hideCart();
    } else {
        showCart();
        renderCartItems();
    }
}

function showCart() {
    cart.classList.remove("invisible");
}
function hideCart() {
    cart.classList.add("invisible");
    cartItemsWrapper.classList.add("invisible");
}

function renderCartItems() {
    cartItemContainer.innerHTML = "";

    // setting up the quantity of the cart
    cartQuantity.innerText = shoppingCart.length;

    // calculating an accurate total 
    const totalCents = shoppingCart.reduce((sum, entry) => { // <-inside of our function, we need to pass it both our accumulator, which is our sum, as well as each entry
        const item = items.find(i => entry.id === i.id);
        return sum + item.priceCents * entry.quantity;
    }, 0) // <- counting from 0
    cartTotal.innerText = formatCurrency(totalCents / 100);

    shoppingCart.forEach(entry => {
        // it will give us the correct item that has the same ID as our entry
        const item = items.find(i => entry.id === i.id);

        // getting all the content inside of template
        const cartItem = cartItemTemplate.content.cloneNode(true);

        // we need access to all individual sections
        const container = cartItem.querySelector("[data-item]");
        container.dataset.itemId = item.id;

        const name = cartItem.querySelector("[data-name]");
        name.innerText = item.name;

        const image = cartItem.querySelector("[data-img]");
        image.src = item.imageColor;
        
        // showing the quantity if the amount of the same items in the cart more than 1
        if (entry.quantity > 1) {
            const quantity = cartItem.querySelector("[data-quantity]");
            quantity.innerText = `x${entry.quantity}`;
        }
        
        const price = cartItem.querySelector("[data-price]");
        price.innerText = formatCurrency(item.priceCents * entry.quantity / 100);

        // appending clone of template to our acctual container
        cartItemContainer.appendChild(cartItem);
    })
}

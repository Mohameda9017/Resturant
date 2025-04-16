
// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM element references
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElem = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to render the cart items and total
function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemTotalPrice = (item.price * item.quantity).toFixed(2);
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <span class="item-name">${item.name} &times; ${item.quantity}</span>
                <span class="item-total">$${itemTotalPrice}</span>
                <button class="remove-item" data-name="${item.name}">Remove</button>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalElem.textContent = totalPrice.toFixed(2);
    updateCartCount();
    saveCart();
}

// Function to update cart count in navbar
function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartToggle) {
        cartToggle.innerText = `Cart (${totalCount})`;
    }
}

// Add item to cart
function addItemToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    renderCart();
}

// Remove item from cart
function removeItemFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();
}

// Clear all cart items
function clearCart() {
    cart = [];
    renderCart();
}

// Event Listeners
if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.toggle('open');
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
}

if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        clearCart();
    });
}

if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const name = e.target.getAttribute('data-name');
            removeItemFromCart(name);
        }
    });
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.menu-card');
        const name = card.querySelector('h3').innerText;
        const priceText = card.querySelector('span').innerText;
        const price = parseFloat(priceText.replace('$', '')) || 0;
        addItemToCart(name, price);
        cartSidebar.classList.add('open');
    });
});

// Initial render
renderCart();

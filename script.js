/**
 * Shopping Cart Logic
 */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalCount;
        el.classList.toggle('hidden', totalCount === 0);
    });
}

function renderCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSubtotal = document.getElementById('cart-subtotal');
    
    if (!cartItemsList) return;

    cartItemsList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="text-neutral-400 text-center py-8">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center gap-4 py-4 border-b border-neutral-800';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded bg-neutral-800">
                <div class="flex-1">
                    <h4 class="font-medium text-white">${item.name}</h4>
                    <p class="text-sm text-neutral-400">₹${item.price.toLocaleString()}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="changeQuantity(${index}, -1)" class="w-6 h-6 flex items-center justify-center rounded border border-neutral-700 hover:bg-neutral-800">-</button>
                        <span class="text-sm">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" class="w-6 h-6 flex items-center justify-center rounded border border-neutral-700 hover:bg-neutral-800">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="text-neutral-500 hover:text-red-500">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            `;
            cartItemsList.appendChild(itemElement);
        });
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = `₹${total.toLocaleString()}`;
    }
    
    // Re-initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    renderCartItems();
    toggleCart(true);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartCount();
    renderCartItems();
}

/**
 * UI Controls
 */
function toggleCart(show) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (show) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartItems();
    
    // Close cart when clicking overlay
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => toggleCart(false));
    }
});

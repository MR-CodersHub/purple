
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');

    renderCart();

    function renderCart() {
        const items = Cart.getItems();

        if (items.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 40px;">Your cart is empty. <a href="shop.html">Continue Shopping</a></td></tr>';
            subtotalEl.innerText = '$0.00';
            totalEl.innerText = '$0.00';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            return;
        }

        if (checkoutBtn) checkoutBtn.style.display = 'block';

        let html = '';
        let subtotal = 0;

        items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            html += `
                <tr class="cart-item">
                    <td class="product-info-cell">
                        <div class="product-item-details">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                            <div class="product-meta">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">Price: $${item.price.toFixed(2)}</div>
                            </div>
                        </div>
                    </td>
                    <td class="qty-cell">
                        <div class="quantity-control">
                             <button class="qty-btn" onclick="updateItem(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                             </button>
                             <input type="text" class="qty-input" value="${item.quantity}" readonly>
                             <button class="qty-btn" onclick="updateItem(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                             </button>
                        </div>
                    </td>
                    <td class="total-cell">$${itemTotal.toFixed(2)}</td>
                    <td class="remove-cell">
                        <button class="remove-btn" onclick="removeItem(${item.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        cartItemsContainer.innerHTML = html;
        subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
        totalEl.innerText = `$${subtotal.toFixed(2)}`; // Add tax/shipping logic later if needed
    }

    // Expose helpers globally
    window.updateItem = (id, validQty) => {
        if (validQty < 1) {
            if (confirm('Remove this item?')) {
                Cart.removeItem(id);
            }
        } else {
            Cart.updateQuantity(id, validQty);
        }
        renderCart();
    };

    window.removeItem = (id) => {
        if (confirm('Are you sure?')) {
            Cart.removeItem(id);
            renderCart();
        }
    };
});

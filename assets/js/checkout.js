
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalEl = document.getElementById('order-total');

    // Load Cart Items into Summary
    const items = Cart.getItems();
    if (items.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    let total = 0;
    let html = '';
    items.forEach(item => {
        total += item.price * item.quantity;
        html += `
            <div class="order-item">
                <span class="order-item-name">${item.name} x ${item.quantity}</span>
                <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    if (orderItemsContainer) orderItemsContainer.innerHTML = html;
    if (orderTotalEl) orderTotalEl.innerText = `$${total.toFixed(2)}`;

    // Handle Form Submit
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation (HTML5 types handles most)
            // Simulate processing
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Processing...';
            btn.disabled = true;

            setTimeout(() => {
                Cart.clear();
                window.location.href = 'order-success.html';
            }, 1500);
        });
    }
});

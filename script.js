// Shared cart logic
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
  const cartItemsBody = document.querySelector('#cart-items tbody');
  const cartTotal = document.getElementById('cart-total');
  cartItemsBody.innerHTML = '';
  let total = 0;

  cartItems.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${(item.Cost / 100).toFixed(2)}</td>
      <td><input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input"></td>
      <td>$${((item.Cost * item.quantity) / 100).toFixed(2)}</td>
      <td><button data-index="${index}" class="remove-button">Remove</button></td>
    `;
    cartItemsBody.appendChild(row);
    total += item.Cost * item.quantity;
  });

  cartTotal.textContent = (total / 100).toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cartItems));

  // Attach event listeners
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = e.target.dataset.index;
      const newQuantity = parseInt(e.target.value, 10);
      if (newQuantity > 0) {
        cartItems[index].quantity = newQuantity;
        updateCartDisplay();
      }
    });
  });

  document.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cartItems.splice(index, 1);
      updateCartDisplay();
    });
  });
}

function addToCart(product) {
  const existingItem = cartItems.find(item => item.name === product.name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  updateCartDisplay();
}

function initializeCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cartItems.push(...JSON.parse(savedCart));
  }
  updateCartDisplay();
}
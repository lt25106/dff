import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, setDoc, getDoc, doc } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSjGR__DtS5jhSljQkO-VI_y4gzKx00Ao",
  authDomain: "dffenterprise-3f446.firebaseapp.com",
  projectId: "dffenterprise-3f446",
  storageBucket: "dffenterprise-3f446.firebasestorage.app",
  messagingSenderId: "98928528109",
  appId: "1:98928528109:web:01bcd20d47abd534219ae4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const products = [
{ name: "Mesclun Salad (150g)", Cost: 350, Type: "salad" },
{ name: "Kale (120g)", Cost: 400, Type: "vegetable" },
{ name: "Crystal Lettuce (120g)", Cost: 200, Type: "vegetable" },
{ name: "Ice Plant (80g)", Cost: 350, Type: "vegetable" },
{ name: "Coriander (60g)", Cost: 250, Type: "vegetable" },
{ name: "Baby Spinach (120g)", Cost: 500, Type: "vegetable" },
{ name: "Arugula (60g)", Cost: 300, Type: "vegetable" },
{ name: "Japanese Tang Oh (150g)", Cost: 350, Type: "vegetable" },
{ name: "Nai Bai (220g)", Cost: 300, Type: "vegetable" },
{ name: "Kailan (150g)", Cost: 250, Type: "vegetable" },
{ name: "Xiao Bai Cai (220g)", Cost: 300, Type: "vegetable" },
{ name: "Chye Sim (200g)", Cost: 300, Type: "vegetable" },
{ name: "Komatsuna (200g)", Cost: 350, Type: "vegetable" },
{ name: "Romaine Lettuce (120g)", Cost: 300, Type: "vegetable" },
{ name: "Red Radish (150g)", Cost: 300, Type: "vegetable" },
{ name: "Red Lettuce (120g)", Cost: 300, Type: "vegetable" },
{ name: "Kang Kong (250g)", Cost: 250, Type: "vegetable" },
{ name: "Bayam Red Spinach (250g)", Cost: 250, Type: "vegetable" },
{name: "Cherry Tomatoes (200g)", Cost: 250, Type: "vegetable"},
{name: "Cherry Tomatoes on Vines (200g)", Cost: 500, Type: "vegetable"},
{name: "White Sweet Corn (250g)", Cost: 300, Type: "vegetable"},
{name: "Australian Pumpkin (500g)", Cost: 300, Type: "vegetable"},
{name: "Australian Asparagus (320g)", Cost: 600, Type: "vegetable"},
{name: "Australian Celery (450g)", Cost: 300, Type: "vegetable"},
{name: "Australian Broccoli (350g)", Cost: 450, Type: "vegetable"},
{name: "Australian Leek (250g)", Cost: 600, Type: "vegetable"},
//dumplings from here on
{name: "Nai Bai Dumplings (400g)", Cost: 500, Type: "dumpling"},
{name: "Tang Oh Dumplings (400g)", Cost: 550, Type: "dumpling"},
{name: "Kailan Dumplings (400g)", Cost: 500, Type: "dumpling"},
{name: "Kale Dumplings (400g)", Cost: 550, Type: "dumpling"},
//pork from here on
{name: "Frozen Pork Loin (1kg)", Cost: 800, Type: "pork"},
{name: "Frozen Pork Ribs (1kg)", Cost: 1250, Type: "pork"},
{name: "Frozen Pork Belly (1kg)", Cost: 1050, Type: "pork"},
{name: "Frozen Minced Pork (500g)", Cost: 540, Type: "pork"},
//fish from here on
{name: "Fried Bean Curd Sheets (240g)", Cost: 9999, Type: "rtc"},
{name: "Fucuk Keping (640g)", Cost: 9999, Type: "rtc"},
{name: "Gegulung Ikan (600g)", Cost: 9999, Type: "rtc"},
{name: "Muar Fish Otah Otah (200g)", Cost: 9999, Type: "rtc"},
{name: "Small Fish Roll (880g)", Cost: 9999, Type: "rtc"},
];

products.forEach(product => {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');
  productDiv.dataset.category = product.Type;
  productDiv.innerHTML = `
  <a href="${product.name}/index.html">
    <img src="Product_images/${product.name}.png" style="height: 9rem; border-radius: 1.25rem"> <br>
    <h2>${product.name}</h2>
    <span style="font-size: 1.25rem">
      <span style="font-weight:1;color:#BBBBBB">$</span>${(product.Cost / 100).toFixed(2)}
    </span>
  </a>
  <br>
  <button>Add to Cart <img src="white c.svg" style="height:1rem;"></button>
  `;
  document.getElementById('shop').appendChild(productDiv);

  productDiv.querySelector('button').addEventListener('click', () => addToCart(product));
});

let cartItems = [];
let total = 0;

// Utility functions
async function saveCartToFirestore(cartItems) {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not logged in.");
    return;
  }
  await setDoc(doc(db, "carts", user.uid), { cart: cartItems }, { merge: true });
}

async function loadCartFromFirestore() {
  const user = auth.currentUser;
  if (!user) return [];
  const docSnap = await getDoc(doc(db, "carts", user.uid));
  return docSnap.exists() ? docSnap.data().cart || [] : [];
}

function calculateTotal(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.Cost * item.quantity, 0);
}

function createTableRow(item, index) {
  const row = document.createElement('tr');
  row.className = item.Type;
  
  row.innerHTML = `
  <td>${item.name}</td>
  <td><span style="font-weight:1;color:#BBBBBB">$</span>${(item.Cost / 100).toFixed(2)}</td>
  <td>
    <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-index="${index}" ${item.Cost === 0 ? 'disabled' : ''}>
  </td>
  <td><span style="font-weight:1;color:#BBBBBB">$</span>${((item.Cost * item.quantity) / 100).toFixed(2)}</td>
  <td>
    <button class="remove-button" data-index="${index}">Remove <img src="remove.svg" style="height:1rem;"></button>
  </td>
  `;
  
  return row;
}

function updateCartDisplay() {
  const cartItemsBody = document.querySelector('#cart-items tbody');
  const cartTotal = document.getElementById('cart-total');
  cartItemsBody.innerHTML = '';
  total = calculateTotal(cartItems);

  cartItems.forEach((item, index) => {
    const row = createTableRow(item, index);
    cartItemsBody.appendChild(row);
  });

  cartTotal.textContent = (total / 100).toFixed(2);
}

// Event delegation for cart actions
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsBody = document.querySelector('#cart-items tbody');
  cartItemsBody.addEventListener('change', async (e) => {
    if (e.target.classList.contains('quantity-input')) {
      const index = e.target.dataset.index;
      const newQuantity = parseInt(e.target.value, 10);
      if (newQuantity > 0) {
        cartItems[index].quantity = newQuantity;
        await saveCartToFirestore(cartItems);
        updateCartDisplay();
      }
    }
  });

  cartItemsBody.addEventListener('click', async (e) => {
    if (e.target.closest('.remove-button')) {
      const button = e.target.closest('.remove-button');
      const index = button.dataset.index;
      cartItems.splice(index, 1);
      await saveCartToFirestore(cartItems);
      updateCartDisplay();
    }
  });
});

async function addToCart(product) {
  const existingItem = cartItems.find(item => item.name === product.name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  await saveCartToFirestore(cartItems);
  updateCartDisplay();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      cartItems = await loadCartFromFirestore();
      updateCartDisplay();
    } else {
      alert("Please log in or sign up before interacting with the cart.");
      window.location.href = 'login/index.html';
    }
  });
});
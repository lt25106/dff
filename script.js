import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, setDoc, getDoc, doc } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSjGR__DtS5jhSljQkO-VI_y4gzKx00Ao",
  authDomain: "dffenterprise-3f446.firebaseapp.com",
  projectId: "dffenterprise-3f446",
  storageBucket: "dffenterprise-3f446.firebasestorage.app",
  messagingSenderId: "98928528109",
  appId: "1:98928528109:web:01bcd20d47abd534219ae4"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

async function saveCartToFirestore(cartItems) {
  const user = auth.currentUser;
  if (!user) return;
  await setDoc(doc(db, "carts", user.uid), { cart: cartItems });
}

async function loadCartFromFirestore() {
  const user = auth.currentUser;
  if (!user) return [];
  const docSnap = await getDoc(doc(db, "carts", user.uid));
  if (docSnap.exists()) {
    return docSnap.data().cart || [];
  }
  return [];
}

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

const shopDiv = document.getElementById('shop');
const cartItemsList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const searchbar = document.getElementById("search");
const categoryFilter = document.getElementById('category-filter');

const cartItems = [];

document.addEventListener('DOMContentLoaded', () => {
  //      const savedCart = localStorage.getItem('cart');
  //    if (savedCart) {
  //    cartItems.push(...JSON.parse(savedCart));
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      cartItems.length = 0;
      cartItems.push(...await loadCartFromFirestore());
      updateCartDisplay();
      await saveCartToFirestore(cartItems);
    }
  });
  updateCartDisplay(); 
  saveCartToFirestore(cartItems);
}
);

async function updateCartDisplay() { // run when a button is pressed
  
  document.getElementById("icon").src = cartItems.length > 0 
  ? "notifyc.svg" 
  : "c.svg";
  
  cartItemsList.style.display = "table" // shows the table
  const cartItemsBody = document.querySelector('#cart-items tbody');
  cartItemsBody.innerHTML = ''; // initializes the table
  let total = 0;
  // localStorage.setItem('cart', JSON.stringify(cartItems)); //saves cart to localStorage
  // await saveCartToFirestore(cartItems); // <-- REMOVE this line
  
  cartItems.forEach((item, index) => {
    const row = document.createElement('tr'); // makes a new row
    
    // Product Name
    const nameCell = document.createElement('td'); // makes new cell in the row
    nameCell.textContent = item.name; // set cell to item name
    row.appendChild(nameCell);
    
    // Price
    const priceCell = document.createElement('td');
    priceCell.innerHTML = `<span style="font-weight:1;color:#BBBBBB">$</span>${(item.Cost / 100).toFixed(2)}`;
    row.appendChild(priceCell);
    
    // Quantity Input
    const quantityCell = document.createElement('td');
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.value = item.quantity;
    quantityInput.classList.add('quantity-input');
    quantityInput.dataset.index = index;
    quantityCell.appendChild(quantityInput);
    row.appendChild(quantityCell);
    
    // Subtotal
    const subtotal = item.Cost * item.quantity;
    total += subtotal;
    const subtotalCell = document.createElement('td');
    subtotalCell.innerHTML = `<span style="font-weight:1;color:#BBBBBB">$</span>${(subtotal / 100).toFixed(2)}`;
    row.appendChild(subtotalCell);
    
    // Remove Button
    const actionCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.innerHTML = 'Remove <img src="remove.svg" style="height:1rem;">';
    removeButton.classList.add('remove-button');
    removeButton.dataset.index = index;
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);
    
    cartItemsBody.appendChild(row);
    
    if (item.Type === 'vegetable') {
      row.style.backgroundColor = '#cbe757'; // Light green for vegetables
    } else if (item.Type === 'pork') {
      row.style.backgroundColor = '#ffe0e0'; // Light red for meat
    } else if (item.Type === 'salad'){
      row.style.backgroundColor = '#e0ffe0' // Lighter green for salads
    } else if (item.Type === 'rtc') {
      row.style.backgroundColor = '#e0f7fa'; // Light blue for fish
    } else if (item.Type === 'dumpling') {
      row.style.backgroundColor = 'yellow'; // Light green for dumplings
    }
    
    if (item.Cost == 0) {
      quantityInput.disabled = true;
    }
  });
  
  cartTotal.textContent = (total / 100).toFixed(2);
  
  // Event Listeners for Quantity Inputs
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', async (e) => {
      const index = e.target.dataset.index;
      const newQuantity = parseInt(e.target.value);
      if (newQuantity > 0) {
        cartItems[index].quantity = newQuantity;
        updateCartDisplay(); // Update DOM immediately
        await saveCartToFirestore(cartItems); // Save in background, now awaited
      }
    });
  });
  
  // Event Listeners for Remove Buttons
  document.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = e.target.dataset.index;
      cartItems.splice(index, 1);
      updateCartDisplay();
      await saveCartToFirestore(cartItems);
    });
  });
  
  if (cartTotal.textContent <= 0) {
    document.getElementById("checkout-button").style.display = "none"; // hides checkout button if cart is empty
  } else {
    document.getElementById("checkout-button").style.display = "block"; // shows checkout button if cart is not empty
  }
}

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
  
  productDiv.querySelector('button').addEventListener('click', async () => {
    if (!auth.currentUser) {
      alert('Please log in or sign up before adding items to your cart.');
      window.location.href = 'login/index.html';
      return;
    }
    const existingItem = cartItems.find(item => item.name === product.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    await saveCartToFirestore(cartItems);
  });
  shopDiv.appendChild(productDiv);
});

function search() {
  const stuff = document.getElementsByClassName("product");
  const searchWords = searchbar.value.toLowerCase().split(" ").filter(Boolean); // split by space and remove empty
  
  Array.from(stuff).forEach(el => {
    const text = el.textContent.toLowerCase();
    const matches = searchWords.every(word => text.includes(word)); // all words must be found
    el.style.display = matches ? "" : "none";
  });
}

categoryFilter.addEventListener('change', function() {
  const selectedCategory = this.value;
  const products = document.querySelectorAll('.product');
  
  products.forEach(product => {
    const productCategory = product.dataset.category;
    if (selectedCategory == 'all' || productCategory == selectedCategory) {
      product.style.display = '';
    } else {
      product.style.display = 'none';
    }
  });
});
searchbar.addEventListener("keyup",search)

document.getElementById('checkout-button').addEventListener('click', () => {
  window.location.href = 'Checkout/index.html';
});

//function elbutton() {
  //document.getElementById('langchoose').style.display = 'none';
  //document.querySelector('body').classList.remove('blur-bg');
//}

window.signUp = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loading = document.querySelector("span");

  loading.style.display = "flex";

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      sendEmailVerification(userCredential.user);
      auth.signOut();
      alert("Signup successful - Verification email sent");
      loading.style.display = "none";
    })
    .catch((error) => {
      alert(error.message);
      loading.style.display = "none";
    });
};

window.signIn = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loading = document.querySelector("span");

  loading.style.display = "flex";

  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    if (!userCredential.user.emailVerified) {
      alert("Please verify your email first!");
      loading.style.display = "none";
      signOut(auth);
      return;
    }
    alert("Login successful");
    loading.style.display = "none";
    window.location.href = "../index.html";
  })
  .catch((error) => {
    alert(error.message);
    loading.style.display = "none";
  });
};

window.signOut = () => {
  signOut(auth)
    .then(() => {
      alert("Signed out");
    })
    .catch((error) => {
      alert(error.message);
    });
};

window.resetPassword = () => {
  const email = document.getElementById("email").value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent! Check your inbox");
    })
    .catch((error) => {
      alert(error.message);
    });
};
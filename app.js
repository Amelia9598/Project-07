// ================= GLOBAL =================
const userAPI = "https://dummyjson.com/users";
const productAPI = "https://fakestoreapi.com/products";

const loader = document.getElementById("loader");

let users = [];
let products = [];

// ================= TAB SWITCH =================
function showTab(tab) {
  document.getElementById("usersSection").classList.add("hidden");
  document.getElementById("productsSection").classList.add("hidden");

  if (tab === "users") document.getElementById("usersSection").classList.remove("hidden");
  else document.getElementById("productsSection").classList.remove("hidden");
}

// ================= USERS =================
const userTable = document.getElementById("userTable");

async function fetchUsers() {
  try {
    loader.classList.remove("hidden");
    const res = await fetch(userAPI);
    const data = await res.json();
    users = data.users;
    renderUsers(users);
  } catch {
    alert("User fetch error");
  } finally {
    loader.classList.add("hidden");
  }
}

function renderUsers(data) {
  userTable.innerHTML = "";
  data.forEach(u => {
    userTable.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.firstName}</td>
        <td>${u.lastName}</td>
        <td>${u.email}</td>
        <td>${u.phone}</td>
        <td>
          <button onclick="editUser(${u.id})">Edit</button>
          <button onclick="deleteUser(${u.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// CREATE / UPDATE USER
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = userId.value;
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value
  };

  try {
    if (id) {
      await fetch(`${userAPI}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      users = users.map(u => u.id == id ? { ...u, ...data } : u);
      alert("Updated!");
    } else {
      const res = await fetch(`${userAPI}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const newUser = await res.json();
      users.unshift(newUser);
      alert("User added!");
    }

    renderUsers(users);
    e.target.reset();
    userId.value = "";

  } catch {
    alert("Error saving user");
  }
});

// EDIT USER
function editUser(id) {
  const u = users.find(u => u.id === id);
  userId.value = u.id;
  firstName.value = u.firstName;
  lastName.value = u.lastName;
  email.value = u.email;
  phone.value = u.phone;
}

// DELETE USER
async function deleteUser(id) {
  await fetch(`${userAPI}/${id}`, { method: "DELETE" });
  users = users.filter(u => u.id !== id);
  renderUsers(users);
}

// SEARCH
document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  renderUsers(users.filter(u => u.firstName.toLowerCase().includes(val)));
});

// ================= PRODUCTS =================
const container = document.getElementById("products");

async function fetchProducts(url = productAPI) {
  try {
    loader.classList.remove("hidden");
    const res = await fetch(url);
    products = await res.json();
    renderProducts(products);
  } catch {
    alert("Product fetch error");
  } finally {
    loader.classList.add("hidden");
  }
}

function renderProducts(data) {
  container.innerHTML = "";

  if (!data.length) {
    container.innerHTML = "No products found";
    return;
  }

  data.forEach(p => {
    container.innerHTML += `
      <div class="bg-white p-3 shadow">
        <img src="${p.image}" class="h-24 mx-auto">
        <h3>${p.title}</h3>
        <p class="${p.price < 20 ? 'text-green-600' : ''}">$${p.price}</p>
        <p>${p.category}</p>
        <p>${p.description.substring(0, 40)}...</p>
        <button onclick="editProduct(${p.id})">Edit</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    `;
  });
}

// CREATE / UPDATE PRODUCT
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = productId.value;

  const data = {
    title: title.value,
    price: +price.value,
    description: description.value,
    image: image.value,
    category: category.value
  };

  try {
    if (id) {
      await fetch(`${productAPI}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });

      products = products.map(p => p.id == id ? { ...p, ...data } : p);
      alert("Updated!");
    } else {
      const res = await fetch(productAPI, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const newProduct = await res.json();
      products.unshift(newProduct);
      alert("Added!");
    }

    renderProducts(products);
    e.target.reset();
    productId.value = "";

  } catch {
    alert("Error saving product");
  }
});

// EDIT PRODUCT
function editProduct(id) {
  const p = products.find(p => p.id === id);
  productId.value = p.id;
  title.value = p.title;
  price.value = p.price;
  description.value = p.description;
  image.value = p.image;
  category.value = p.category;
}

// DELETE PRODUCT
async function deleteProduct(id) {
  await fetch(`${productAPI}/${id}`, { method: "DELETE" });
  products = products.filter(p => p.id !== id);
  renderProducts(products);
}

// FILTER
document.getElementById("filter").addEventListener("change", e => {
  const cat = e.target.value;
  if (!cat) fetchProducts();
  else fetchProducts(`${productAPI}/category/${cat}`);
});

// ================= INIT =================
fetchUsers();
fetchProducts();
const searchInput = document.getElementById("searchInput");
const categoryCheckboxes = document.querySelectorAll(".category");
const productGrid = document.getElementById("productGrid");
const loading = document.getElementById("loading");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const limit = 6;
let debounceTimer;

// Fetch products from backend
async function fetchProducts() {
  loading.style.display = "block";
  productGrid.innerHTML = "";

  const search = searchInput.value.trim();

  const selectedCategories = Array.from(categoryCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const category = selectedCategories.join(",");

  const params = new URLSearchParams({
    search: search,
    category: category,
    page: currentPage,
    limit: limit
  });

  try {
    const response = await fetch(`/api/products?${params}`);
    const result = await response.json();

    displayProducts(result.data);
    updatePagination(result.pagination);
  } catch (error) {
    productGrid.innerHTML = "<p>Something went wrong.</p>";
  } finally {
    loading.style.display = "none";
  }
}

// Display product cards
function displayProducts(products) {
  if (products.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p class="category">${product.category}</p>
      <p class="price">₹${product.price}</p>
    `;

    productGrid.appendChild(card);
  });
}

// Update pagination
function updatePagination(pagination) {
  pageInfo.textContent =
    `Page ${pagination.page} of ${pagination.totalPages || 1}`;

  prevBtn.disabled = pagination.page <= 1;
  nextBtn.disabled =
    pagination.page >= pagination.totalPages || pagination.totalPages === 0;
}

// Debounced search
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    currentPage = 1;
    fetchProducts();
  }, 500);
});

// Category filter
categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    currentPage = 1;
    fetchProducts();
  });
});

// Previous page
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchProducts();
  }
});

// Next page
nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchProducts();
});

// Initial load
fetchProducts();
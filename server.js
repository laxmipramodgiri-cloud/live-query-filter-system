const express = require("express");
const path = require("path");
const products = require("./data/products.json");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", (req, res) => {
  const {
    search = "",
    category = "",
    page = 1,
    limit = 6
  } = req.query;

  let filteredProducts = products;

  // Search filter
  if (search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Category filter
  if (category) {
    const categories = category.split(",");

    filteredProducts = filteredProducts.filter((product) =>
      categories.includes(product.category)
    );
  }

  // Pagination
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limitNumber);

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;

  const results = filteredProducts.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: results,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
      totalPages: totalPages
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
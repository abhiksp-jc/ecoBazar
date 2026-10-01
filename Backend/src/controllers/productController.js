const Product = require("../models/product");
const Category = require("../models/category");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      discount,
      stock,
      unit,
      status
    } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      stock === undefined ||
      !unit
    ) {
      return res.status(400).json({
        message: "Name, category, price, stock and unit are required"
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      description: description?.trim() || "",
      images: req.files
        ? req.files.map((file) => `/uploads/products/${file.filename}`)
        : [],
      price: Number(price),
      discount: Number(discount || 0),
      stock: Number(stock),
      unit: unit.trim(),
      status: status || "ACTIVE"
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name image");

    res.status(201).json({
      message: "Product created successfully",
      product: populatedProduct
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { status, category, type, sort, limit, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status.toUpperCase();
    }

    if (category) {
      filter.category = category;
    }

    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      let categoryCondition = [];
      try {
        const matchingCats = await Category.find({
          name: { $regex: trimmedSearch, $options: "i" }
        }).select("_id");
        if (matchingCats && matchingCats.length > 0) {
          categoryCondition = [{ category: { $in: matchingCats.map(c => c._id) } }];
        }
      } catch (catErr) {
        console.warn("Category search lookup:", catErr.message);
      }

      filter.$or = [
        { name: { $regex: trimmedSearch, $options: "i" } },
        { description: { $regex: trimmedSearch, $options: "i" } },
        ...categoryCondition
      ];
    }

    if (type === "best-selling") {
      try {
        const topSold = await Order.aggregate([
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.product",
              totalSold: { $sum: "$items.quantity" }
            }
          },
          { $sort: { totalSold: -1 } },
          { $limit: Number(limit) || 10 }
        ]);

        if (topSold.length > 0) {
          const productIds = topSold.map((item) => item._id);
          const topProducts = await Product.find({
            ...filter,
            _id: { $in: productIds }
          }).populate("category", "name image");

          if (topProducts.length >= 3) {
            topProducts.sort((a, b) => {
              return (
                productIds.findIndex(id => id.toString() === a._id.toString()) -
                productIds.findIndex(id => id.toString() === b._id.toString())
              );
            });

            return res.status(200).json({
              count: topProducts.length,
              products: topProducts
            });
          }
        }
      } catch (aggErr) {
        console.warn("Aggregate best selling warning:", aggErr.message);
      }
    }

    let query = Product.find(filter).populate("category", "name image");

    if (type === "hot-deals") {
      filter.discount = { $gt: 0 };
      query = Product.find(filter).populate("category", "name image").sort({ discount: -1 });
    } else if (sort === "newest" || type === "latest") {
      query = query.sort({ createdAt: -1 });
    } else if (sort === "price-low") {
      query = query.sort({ price: 1 });
    } else if (sort === "price-high") {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const products = await query;

    res.status(200).json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name image");

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      product
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      discount,
      stock,
      unit,
      status
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (category !== undefined) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          message: "Category not found"
        });
      }

      product.category = category;
    }

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (description !== undefined) {
      product.description = description.trim();
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (discount !== undefined) {
      product.discount = Number(discount);
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    if (unit !== undefined) {
      product.unit = unit.trim();
    }

    if (status !== undefined) {
      product.status = status;
    }

    if (req.files && req.files.length > 0) {
      product.images.push(
        ...req.files.map(
          (file) => `/uploads/products/${file.filename}`
        )
      );
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name image");

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.images.forEach((image) => {
      const imagePath = path.join(
        __dirname,
        "../../",
        image.replace(/^\//, "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const checkoutProducts = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty or invalid items list provided"
      });
    }

    // Step 1: Validate stock for all products
    for (const item of items) {
      const productId = item.productId || item._id;
      const quantity = Number(item.quantity);

      if (!productId || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: "Invalid product ID or quantity in cart items"
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${productId} not found`
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Only ${product.stock} ${product.unit || 'units'} available in stock.`
        });
      }
    }

    // Step 2: Deduct stock atomically for all products
    for (const item of items) {
      const productId = item.productId || item._id;
      const quantity = Number(item.quantity);

      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -quantity }
      });
    }

    res.status(200).json({
      success: true,
      message: "Order placed successfully! Stock has been updated."
    });
  } catch (error) {
    console.error("CHECKOUT PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Server error during checkout"
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  checkoutProducts
};
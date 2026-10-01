const Category = require("../models/category");
const fs = require("fs");
const path = require("path");

const createCategory = async (req, res) => {
  try {
    const {
      name,
      description
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const existingCategory =
      await Category.findOne({
        name: {
          $regex: `^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i"
        }
      });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    const image = req.file
      ? `/uploads/categories/${req.file.filename}`
      : null;

    const category =
      await Category.create({
        name: name.trim(),
        description: description?.trim() || "",
        image
      });

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    res.status(500).json({
      message: error.message || "Failed to create category"
    });
  }
};

const createCategoriesBulk = async (req, res) => {
  const uploadedFiles = req.files || [];

  try {
    let categories;

    try {
      categories = JSON.parse(req.body.categories || "[]");
    } catch {
      return res.status(400).json({
        message: "Invalid categories data"
      });
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        message: "At least one category is required"
      });
    }

    if (categories.length > 50) {
      return res.status(400).json({
        message: "You can add maximum 50 categories at a time"
      });
    }

    const names = categories.map((category) =>
      String(category.name || "").trim()
    );

    if (names.some((name) => !name)) {
      return res.status(400).json({
        message: "Every category must have a name"
      });
    }

    const normalizedNames = names.map((name) =>
      name.toLowerCase()
    );

    const duplicateNames = normalizedNames.filter(
      (name, index) =>
        normalizedNames.indexOf(name) !== index
    );

    if (duplicateNames.length > 0) {
      uploadedFiles.forEach((file) => {
        fs.unlink(
          path.join(file.destination, file.filename),
          () => {}
        );
      });

      return res.status(409).json({
        message: "Duplicate category names found in the list"
      });
    }

    const existingCategories =
      await Category.find({
        name: {
          $in: names.map((name) =>
            new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")
          )
        }
      });

    if (existingCategories.length > 0) {
      uploadedFiles.forEach((file) => {
        fs.unlink(
          path.join(file.destination, file.filename),
          () => {}
        );
      });

      return res.status(409).json({
        message: `Category already exists: ${existingCategories
          .map((category) => category.name)
          .join(", ")}`
      });
    }

    const documents = categories.map((category, index) => {
      const matchedFile = uploadedFiles.find(
        (f) => f.fieldname === `image_${index}`
      ) || uploadedFiles[index];

      return {
        name: names[index],
        description: String(
          category.description || ""
        ).trim(),
        image: matchedFile
          ? `/uploads/categories/${matchedFile.filename}`
          : null
      };
    });

    const createdCategories =
      await Category.insertMany(documents);

    res.status(201).json({
      message: `${createdCategories.length} categories created successfully`,
      categories: createdCategories
    });
  } catch (error) {
    console.error(
      "CREATE BULK CATEGORIES ERROR:",
      error
    );

    uploadedFiles.forEach((file) => {
      fs.unlink(
        path.join(file.destination, file.filename),
        () => {}
      );
    });

    if (error.code === 11000) {
      return res.status(409).json({
        message: "One or more category names already exist"
      });
    }

    res.status(500).json({
      message: "Failed to create categories"
    });
  }
};

const getCategories = async (
  req,
  res
) => {
  try {
    const categories =
      await Category.find().sort({
        createdAt: -1
      });

    res.status(200).json({
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error(
      "GET CATEGORIES ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch categories"
    });
  }
};

const updateCategory = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      name,
      description
    } = req.body;

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    if (name !== undefined) {
      const trimmedName =
        name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          message: "Category name is required"
        });
      }

      if (
        trimmedName.toLowerCase() !==
        category.name.toLowerCase()
      ) {
        const existingCategory =
          await Category.findOne({
            name: {
              $regex: `^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
              $options: "i"
            },
            _id: {
              $ne: id
            }
          });

        if (existingCategory) {
          return res.status(409).json({
            message: "Category already exists"
          });
        }
      }

      category.name = trimmedName;
    }

    if (description !== undefined) {
      category.description =
        description.trim();
    }

    if (req.file) {
      category.image =
        `/uploads/categories/${req.file.filename}`;
    }

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    console.error(
      "UPDATE CATEGORY ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to update category"
    });
  }
};

const deleteCategory = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const category =
      await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.status(200).json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error(
      "DELETE CATEGORY ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to delete category"
    });
  }
};

module.exports = {
  createCategory,
  createCategoriesBulk,
  getCategories,
  updateCategory,
  deleteCategory
};

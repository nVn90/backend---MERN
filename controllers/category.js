const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "Category not found in DB",
      });
    }
    req.category = category;
    next();
  });
};

// Creation of a Category in DB
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save category in DB",
      });
    }
    // console.log({ category });
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        err: "NO categories found",
      });
    }
    res.json(categories);
  });
};

// update
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        err: "Failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};

// Delete
exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "Failed to delete this category",
      });
    }
    res.json({
      message: `${category} is deleted successfully`,
    });
  });
};

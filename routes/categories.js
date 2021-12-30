const express = require("express");
const Course = require("../models/course");
const Category = require("../models/category");
const router = express.Router();

router.get("/create", (req, res) => res.render("categories/create"));

router.post("/", async (req, res) => {
  const { name } = req.body;
  let category = new Category({ name });
  try {
    category = await category.save();
    res.redirect(`/categories/${category.id}`);
  } catch (err) {
    console.error(err);
    res.render("categories/create", { category });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const courses = await Course.find({ category: req.params.id });
    if (category) res.render("categories/category", { category, courses });
    else res.status(404);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

module.exports = router;

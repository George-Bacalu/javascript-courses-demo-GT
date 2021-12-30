const express = require("express");
const Course = require("../models/course");
const Category = require("../models/category");
const router = express.Router();

router.get("/create", async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.render("create", { course: new Course(), categories });
});

router.get("/edit/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("edit", { course });
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("category");
    if (course) res.render("course", { course });
    else res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

router.post("/", async (req, res) => {
  const { category: categoryName, title, image, description } = req.body;
  const category = categoryName && (await Category.findOne({ name: categoryName }));
  let course = new Course({ title, image, description, category: category?.id });
  try {
    course = await course.save();
    res.redirect(`/courses/${course.id}`);
  } catch (err) {
    console.error(err);
    res.render("create", { course });
  }
});

router.put("/:id", async (req, res) => {
  let course = await Course.findById(req.params.id);
  const { title, description, image } = req.body;
  course.title = title;
  course.description = description;
  course.image = image;
  try {
    course = await course.save();
    res.redirect(`/courses/${course.id}`);
  } catch (err) {
    console.error(err);
    res.render("edit", { course });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

module.exports = router;

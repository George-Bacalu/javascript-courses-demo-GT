const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Course = require("./models/Course");

const app = express();
const port = process.env.PORT || 3000;

const dbURL = "mongodb+srv://admin-george:$7u7BM_taHn5x$h@javascript-courses.ni9g1.mongodb.net/courses?retryWrites=true&w=majority";
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(data => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
    console.log("Successfully connected to mongodb database");
  })
  .catch(error => console.error("Connection to mongodb database failed", error));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

app.get("/", (req, res) => res.redirect("/courses"));
app.get("/create", (req, res) => res.render("create"));
app.get("/edit", (req, res) => res.render("edit"));

app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("index", { courses });
  } catch (err) {
    console.error(err);
    res.sendStatus(404);
  }
});

app.post("/create", async (req, res) => {
  const { title, image, description } = req.body;
  const course = new Course({ title, image, description });
  await course.save();
  res.redirect(`/courses/${course.id}`);
});

app.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) res.render("course", { course });
    else res.status(404);
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

app.delete("/courses/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ redirect: "/courses" });
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

app.patch("/courses/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findByIdAndUpdate(course.id, { title, description }, { new: true });
    res.redirect("/courses");
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

/*
app.post("/edit", async (req, res) => {
  try {
    const { title, image, description } = req.body;
    const course = new Course({ title, image, description });
    await Course.findByIdAndDelete(course.id);
    await course.save();
    res.redirect(`/courses/${course.id}`);
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});
*/

app.use((req, res) => res.status(404).render("404", { message: "404 - Page Not Found!" }));

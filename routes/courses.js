const express = require("express");
const Course = require("../models/course");
const router = express.Router();

router.get("/create", (req, res) => res.render("create", { course: new Course() }));

router.get("/edit/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("edit", { course });
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) res.render("course", { course });
    else res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

router.post("/", async (req, res) => {
  const { title, image, description } = req.body;
  let course = new Course({ title, image, description });
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
  const { title, description, markdown } = req.body;
    course.title = title;
    course.description = description;
    course.markdown = markdown;
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

/*
function saveCourseAndRedirect(path) {
  return async (req, res) => {
    let course = req.course;
    const { title, description, markdown } = req.body;
    course.title = title;
    course.description = description;
    course.markdown = markdown;
    try {
      course = await course.save();
      res.redirect(`/courses/${course.id}`);
    } catch (error) {
      console.log(error);
      res.render(`courses/${path}`, { course });
    }
  };
}
*/

module.exports = router;

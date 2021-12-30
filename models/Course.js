const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;

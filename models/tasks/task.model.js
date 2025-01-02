const mongoose = require("mongoose")

const checklistItemSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
})

const taskSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["backlog", "todo", "inProgress", "done"],
      default: "todo",
    },
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["HIGH", "LOW", "MODERATE"],
      default: "MODERATE",
    },

    checkList: {
      type: [checklistItemSchema],
      default: [],
    },
    dueDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Task = mongoose.model("Task", taskSchema)

module.exports = Task

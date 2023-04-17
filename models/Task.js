import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Object,
    required: true,
  },
});

export default mongoose.model("Task", TaskSchema);

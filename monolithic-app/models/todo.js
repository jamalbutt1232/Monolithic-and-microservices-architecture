const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("ToDo", ToDoSchema);

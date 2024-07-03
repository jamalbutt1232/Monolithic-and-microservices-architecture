const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./database");
const ToDo = require("./models/todo");

dotenv.config();

const app = express();
app.use(bodyParser.json());

connectDB();

app.post("/todos", async (req, res) => {
  try {
    const todo = new ToDo({
      task: req.body.task,
      userId: new mongoose.Types.ObjectId(req.body.userId),
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await ToDo.find({
      userId: new mongoose.Types.ObjectId(req.query.userId),
    });
    res.status(200).json(todos);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await ToDo.findById(req.params.id);
    if (todo) {
      todo.task = req.body.task || todo.task;
      await todo.save();
      res.status(200).json(todo);
    } else {
      res.status(404).json({ message: "To-Do not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await ToDo.findById(req.params.id);
    if (todo) {
      await todo.remove();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "To-Do not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.TODO_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`To-Do service running on port ${PORT}`);
});

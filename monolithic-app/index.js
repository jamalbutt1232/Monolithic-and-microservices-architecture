const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const User = require("./models/user");
const ToDo = require("./models/todo");

dotenv.config();

const app = express();

app.use(bodyParser.json());

connectDB();

// User Registration
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create To-Do
app.post("/todos", async (req, res) => {
  try {
    const todo = new ToDo({
      task: req.body.task,
      userId: req.body.userId,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get To-Dos
app.get("/todos", async (req, res) => {
  try {
    const todos = await ToDo.find({ userId: req.query.userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update To-Do
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

// Delete To-Do
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

// Get User Profile
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Monolithic app running on port ${PORT}`);
});

const express = require("express");
const router = new express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const User = require("../models/User");

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });

    const savedTask = await task.save();

    res.status(201).send(savedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const user = await User.findById(req.user._id).populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send("Error! Invalid Updates");
  }

  try {
    const updatedTask = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!updatedTask) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      updatedTask[update] = req.body[update];
    });
    await updatedTask.save();

    res.send(updatedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.findByOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedTask) {
      return res.status(404).send();
    }
    res.send("Task deleted Successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

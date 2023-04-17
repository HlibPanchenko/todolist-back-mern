import express from "express";
import mongoose from "mongoose";
import TaskModel from "./models/Task.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

//password mongoDB: EMGhzUjJ2F3k1CxR, username: glebpanchenk7
mongoose
  .connect(
    "mongodb+srv://glebpanchenk7:EMGhzUjJ2F3k1CxR@cluster1.vlwje5d.mongodb.net/todolist"
  )
  .then(() => console.log("Connected to DB!"))
  .catch(() => console.log("Failed to connect to DB!"));

app.get("/", (req, res) => {
  res.json("hello");
});

app.post("/add-task", async (req, res) => {
  try {
    console.log(req.body);

    const doc = new TaskModel({
      text: req.body.text,
      title: req.body.title,
      // author: req.body.author,
      // email: req.body.email,
    });

    const task = await doc.save();

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать задачу",
    });
  }
});

app.delete("/delete-task/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    console.log(taskId);

    const deletedTask = await TaskModel.findByIdAndDelete({ _id: taskId });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Задача не найдена",
      });
    }

    res.json({
      success: true,
      deletedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось удалить задачу",
    });
  }
});

app.patch("/edit-task/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    console.log(req.body);
    console.log(req.params.body);

    const updatedTask = await TaskModel.findByIdAndUpdate(
      { _id: taskId },
      // второй параметр - то, что хотим обновить
      {
        title: req.body.title,
        text: req.body.text,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Задача не найдена",
      });
    }

    res.json({
      success: true,
      updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось изенить задачу",
    });
  }
});

app.get("/get-one-task/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    console.log(taskId);

    const oneTask = await TaskModel.findOne({ _id: taskId });

    if (!oneTask) {
      return res.status(404).json({
        message: "Задача не найдена",
      });
    }

    res.json({
      success: true,
      oneTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить одну задачу",
    });
  }
});

app.get("/get-all-tasks", async (req, res) => {
  try {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 5,
    };

    console.log(pageOptions);
    // можем найти не все задачи, а по конкретному полю
    //  const tasks = await TaskModel.findOne({ author: req.body.author });
    //   const tasks = await TaskModel.findOne({ author: "Gleb" });
    const tasks = await TaskModel.find()
      .skip((pageOptions.page - 1) * 5)
      .limit(pageOptions.limit);
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить все задачи",
    });
  }
});

app.listen(7777, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server ok");
});

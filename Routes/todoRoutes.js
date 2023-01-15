const express = require("express");
const app = express();
const { TodoModel } = require("../Model/todo.model");
const { Auth } = require("../middelware/middelware");
app.use(express.json());

const TodoRoutes = express.Router();
TodoRoutes.use(Auth);
TodoRoutes.get("/", async (req, res) => {
  console.log(req.body);

  try {
    const todos = await TodoModel.find({ userId: req.body.userId });
    res.send(todos);
  } catch (err) {
    res.send({ massage: err.message, alert: "Something went wrong" });
  }
});

TodoRoutes.post("/create", async (req, res) => {
  let todo = req.body;
  try {
    const newtodo = await new TodoModel(todo);
    newtodo.save();
    res.send({ massage: "created todo", alert: "todo added successfully" });
  } catch (err) {
    console.log(err);
    res.send({ massage: err.message, alert: "Something went wrong" });
  }
});

TodoRoutes.patch("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const oldtodo = await TodoModel.findOne({ _id: id });
    const useId_of_product = oldtodo.userId;
    const userId_of_user = req.body.userId;
    if (useId_of_product !== userId_of_user) {
      res.send({ massage: "not Auhorised", alert: "You are not athorised" });
    } else {
      const status = !oldtodo.iscompleted;

      const newtodo = await TodoModel.findOneAndUpdate(
        { _id: id },
        { iscompleted: status }
      );

      res.send({ massage: "updated", alert: "Status updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.send({ massage: err.message, alert: "Something went wrong" });
  }
});

TodoRoutes.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const oldtodo = await TodoModel.findOne({ _id: id });
    const useId_of_product = oldtodo.userId;
    const userId_of_user = req.body.userId;
    if (useId_of_product !== userId_of_user) {
      res.send({ massage: "not Auhorised", alert: "You are not athorised" });
    } else {
      await TodoModel.findOneAndDelete({ _id: id });
      res.send({ massage: "deleted", alert: "todo deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res.send({ massage: err.message, alert: "Something went wrong" });
  }
});
module.exports = { TodoRoutes };

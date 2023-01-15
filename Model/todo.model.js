const mongoose = require("mongoose");

const todosSchema = mongoose.Schema({
  todo: String,
  iscompleted: Boolean,
  userId: String,
});

const TodoModel = mongoose.model("Todo", todosSchema);

module.exports = { TodoModel };

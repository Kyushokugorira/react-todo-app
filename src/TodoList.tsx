import React from "react";
import { Todo } from "./types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  updateIsDone: (id: string, isDone: boolean) => void;
  remove: (id: string) => void;
  edit: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  updateIsDone,
  remove,
  edit,
}) => {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          updateIsDone={updateIsDone}
          remove={remove}
          edit={edit}
        />
      ))}
    </div>
  );
};

export default TodoList;

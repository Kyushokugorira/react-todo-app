import React from "react";
import { Todo } from "./types";

interface TodoItemProps {
  todo: Todo;
  updateIsDone: (id: string, isDone: boolean) => void;
  remove: (id: string) => void;
  edit: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  updateIsDone,
  remove,
  edit,
}) => {
  return (
    <div className="flex items-center justify-between border-b p-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => updateIsDone(todo.id, e.target.checked)}
          className="mr-2"
        />
        <span className={todo.isDone ? "line-through" : ""}>{todo.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => edit(todo.id)}
          className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-yellow-500"
        >
          編集
        </button>
        <button
          onClick={() => remove(todo.id)}
          className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default TodoItem;

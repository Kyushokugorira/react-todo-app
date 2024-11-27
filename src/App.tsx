import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [name, setName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false); // フォームの表示・非表示を管理
  const [isEditingTodo, setIsEditingTodo] = useState<string | null>(null); // 編集モードの管理
  const localStorageKey = "TodoApp";

  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    }
    return "";
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    console.log(`UI操作で日時が "${dt}" (${typeof dt}型) に変更されました。`);
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const addName = () => {
    setName(inputValue);
    setInputValue("");
  };

  const addNewTodo = () => {
    if (newTodoName.length < 2 || newTodoName.length > 32) {
      return;
    }
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setIsAddingTodo(false); // フォームを非表示にする
  };

  const editTodo = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setNewTodoName(todo.name);
      setNewTodoPriority(todo.priority);
      setNewTodoDeadline(todo.deadline);
      setIsEditingTodo(id);
      setIsAddingTodo(true);
    }
  };

  const updateTodo = () => {
    if (newTodoName.length < 2 || newTodoName.length > 32) {
      return;
    }
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const updatedTodos = todos.map((todo) => {
      if (todo.id === isEditingTodo) {
        return {
          ...todo,
          name: newTodoName,
          priority: newTodoPriority,
          deadline: newTodoDeadline,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setIsAddingTodo(false);
    setIsEditingTodo(null);
  };

  const sortTodosByDeadline = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    });
    setTodos(sortedTodos);
  };

  const sortTodosByPriority = () => {
    const sortedTodos = [...todos].sort((a, b) => b.priority - a.priority);
    setTodos(sortedTodos);
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-center text-3xl font-bold">TodoApp</h1>
      <div className="mb-4 text-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="名前を入力"
          className="rounded-md border p-2"
        />
        <button
          type="button"
          onClick={addName}
          className={twMerge(
            "ml-2 rounded-md bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600"
          )}
        >
          名前入力
        </button>
      </div>
      <WelcomeMessage name={name} uncompletedCount={uncompletedCount} />

      <div className="mt-5 space-y-4 rounded-md border p-4">
        <h2 className="text-xl font-bold">新しいタスクの追加</h2>

        {isAddingTodo && (
          <>
            <div
              className="overlay"
              onClick={() => setIsAddingTodo(false)}
            ></div>
            <div className="modal">
              <div>
                <input
                  type="text"
                  value={newTodoName}
                  onChange={updateNewTodoName}
                  placeholder="タスク名 (2文字以上、32文字以内)"
                  className={twMerge(
                    "grow rounded-md border p-2 w-full",
                    newTodoNameError && "border-red-500 outline-red-500"
                  )}
                />
                {newTodoNameError && (
                  <div className="mt-2 flex items-center space-x-1 text-sm font-bold text-red-500">
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className="mr-0.5"
                    />
                    <div>{newTodoNameError}</div>
                  </div>
                )}
              </div>

              <div className="flex gap-5">
                <div className="font-bold">優先度</div>
                {[1, 2, 3].map((value) => (
                  <label key={value} className="flex items-center space-x-1">
                    <input
                      name="priorityGroup"
                      type="radio"
                      value={value}
                      checked={newTodoPriority === value}
                      onChange={updateNewTodoPriority}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-x-2">
                <label htmlFor="deadline" className="font-bold">
                  期限
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  value={
                    newTodoDeadline
                      ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                      : ""
                  }
                  onChange={updateDeadline}
                  className="rounded-md border border-gray-400 px-2 py-0.5"
                />
              </div>

              <button
                type="button"
                onClick={isEditingTodo ? updateTodo : addNewTodo}
                className={twMerge(
                  "w-full rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
                  newTodoNameError && "cursor-not-allowed opacity-50"
                )}
              >
                {isEditingTodo ? "タスクを更新" : "新しいタスクを追加"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAddingTodo(false);
                  setIsEditingTodo(null);
                }}
                className="mt-2 w-full rounded-md bg-gray-500 px-3 py-1 font-bold text-white hover:bg-gray-600"
              >
                キャンセル
              </button>
            </div>
          </>
        )}

        {!isAddingTodo && (
          <button
            type="button"
            onClick={() => setIsAddingTodo(true)}
            className="w-full rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600"
          >
            新しいタスクを追加
          </button>
        )}

        <button
          type="button"
          onClick={removeCompletedTodos}
          className="mt-2 w-full rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
        >
          完了済みのタスクを削除
        </button>

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={sortTodosByDeadline}
            className="rounded-md bg-green-500 px-3 py-1 font-bold text-white hover:bg-green-600"
          >
            期日でソート
          </button>
          <button
            type="button"
            onClick={sortTodosByPriority}
            className="rounded-md bg-yellow-500 px-3 py-1 font-bold text-white hover:bg-yellow-600"
          >
            優先度でソート
          </button>
        </div>
      </div>

      <div className="mt-5">
        <TodoList
          todos={todos}
          updateIsDone={updateIsDone}
          remove={remove}
          edit={editTodo}
        />
      </div>
    </div>
  );
};

export default App;

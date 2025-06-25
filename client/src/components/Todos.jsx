import React from "react";
import toast from "react-hot-toast";
import DeleteIcon from "@/icons/DeleteIcon";
import EditIcon from "@/icons/EditIcon";
import TickIcon from "@/icons/TickIcon";
import { CircleUserRound, Plus } from "lucide-react";
import useSWR from "swr";
import { Input } from "./ui/input";
import EditTodo from "./EditTodo";
import Profile from "./Profile";

const fetcher = (url, options = {}) =>
  fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());

const Todos = () => {
  const { data, error, mutate, isLoading } = useSWR(
    "http://localhost:3000/api/todos",
    fetcher
  );

  if (error)
    return <h1 className="text-2xl py-2 text-center">Something went wrong</h1>;

  if (isLoading)
    return <h1 className="text-2xl py-2 text-center">Loading...</h1>;

  console.log("Data", data);

  function handleError(error) {
    toast.error(error);
    throw new Error(error);
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    if (!title.trim().length) {
      toast.error("Please add a todo");
      return;
    }

    const newTodo = {
      title: `${title} adding...`,
      _id: new Date().getTime().toString(),
      isCompleted: false,
    };

    async function addTodo() {
      const res = await fetcher("http://localhost:3000/api/todos", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        // credentials: "include",
        // mode: "cors",
        body: { title },
      });
      //const data = await res.json();
      if (res.error) {
        handleError(res.error);
      }
      return [...data, res];
    }
    await mutate(addTodo, {
      optimisticData: [...data, newTodo],
      revalidate: true,
      rollbackOnError: true,
    });
    e.target.reset();
  }

  async function handleComplete(id, isCompleted) {
    await mutate(
      async () => {
        const res = await fetcher(`http://localhost:3000/api/todos/${id}`, {
          method: "PUT",
          body: { isCompleted: !isCompleted },
        });
        if (res.error) {
          handleError(res.error);
        }
        return data.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: !isCompleted } : todo
        );
      },
      {
        optimisticData: data.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: !isCompleted } : todo
        ),
        revalidate: true,
        rollbackOnError: false,
      }
    );
  }

  async function deleteTodo(id) {
    toast.success("Todo deleted");
    await mutate(
      async () => {
        const res = await fetcher(`http://localhost:3000/api/todos/${id}`, {
          method: "DELETE",
        });
        if (res.error) {
          handleError(res.error);
        }
        return data.filter((todo) => todo._id !== id);
      },
      {
        optimisticData: data.filter((todo) => todo._id !== id),
        revalidate: true,
        rollbackOnError: false,
      }
    );
  }

  async function handleUpdate(formData) {
    console.log("first", formData);
    const { id, title } = formData;
    console.log(formData);
    await mutate(
      async () => {
        const res = await fetcher(`http://localhost:3000/api/todos/${id}`, {
          method: "PUT",
          body: { title },
        });
        if (res.error) {
          handleError(res.error);
        }
        return data.map((todo) =>
          todo._id === id ? { ...todo, title: res.title } : todo
        );
      },
      {
        optimisticData: data.map((todo) =>
          todo._id === id ? { ...todo, title } : todo
        ),
        revalidate: true,
        rollbackOnError: true,
      }
    );
  }
  return (
    <div className="mx-auto mt-20 max-w-lg px-4 w-full flex flex-col gap-6">
      <div className="flex justify-end">
        <Profile />
      </div>
      <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent font-bold text-4xl text-center mb-4 bg-clip-text">
        Todo App
      </h1>
      <form onSubmit={handleAddTodo} className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Add Todo"
          name="title"
          id="title"
          required
          className="shadow-md"
        />
        <button className="h-9 rounded-md border border-input bg-transparent px-4 text-base shadow-md flex items-center hover:bg-primary transition ease">
          <Plus
            size={20}
            className="transition ease-linear group-hover:stroke-white"
          />
        </button>
      </form>
      {data?.length ? (
        <div className="shadow-md border-2 border-input bg-transparent flex flex-col gap-2 rounded">
          {data.map((todo, index) => (
            <div
              key={todo._id}
              className={`flex items-center h-10 w-full ${
                index === data.length - 1 ? "border-b-0" : "border-b-2"
              }`}
            >
              <span
                className={`flex-1 px-3 ${
                  todo.isCompleted && "line-through text-[#63657b]"
                }`}
              >
                {todo.title}
              </span>
              <div className="px-3 flex gap-2">
                <TickIcon
                  onClick={() => handleComplete(todo._id, todo.isCompleted)}
                  size={20}
                  className={`transition ease-in-out hover:cursor-pointer ${
                    todo.isCompleted ? "text-primary" : "text-slate-300"
                  }`}
                />
                <DeleteIcon
                  size={20}
                  className="transition ease-in-out hover:cursor-pointer"
                  onClick={() => deleteTodo(todo._id)}
                />
                <EditTodo
                  handleUpdate={handleUpdate}
                  id={todo._id}
                  title={todo.title}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span>"You don't have any Todos"</span>
      )}
    </div>
  );
};

export default Todos;

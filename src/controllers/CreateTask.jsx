import { Authorise } from "../Authenticate";
import "dotenv/config";
import { fetchTodoList } from "./FetchTasks";
import { useState, useContext } from "react";
export function CreateTask(event) {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { token } = useContext(Authorise);
  const [newTask, setNewTask] = useState("");
  let err = "";
  event.preventDefault();
  try {
    const response = fetch(`${SERVER_URL}create_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ task: newTask, token: token }),
    });
    if (response.ok) {
      fetchTodoList(token);
      setNewTask("");
    } else {
      console.error("Failed to create task:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating task:", error);
    err = error.responseText;
  }
  return { newTask: newTask, token: token, error: err };
}

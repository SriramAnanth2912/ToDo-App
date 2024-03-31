import { useState, useEffect, useContext } from "react";
import Complete from "./CompleteList";
import { Authorise } from "../Authenticate";
import { useNavigate } from "react-router-dom";
import styles from "../tasks.styles.module.css";

export default function TodoList() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { token } = useContext(Authorise);
  const NavigateTo = useNavigate();
  const [signedOut, setsignedOut] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [updatedTask, setUpdatedTask] = useState({
    task: "",
    id: 0,
  });
  const [display, setDisplay] = useState("block");
  const [displayComplete, setDisplayComplete] = useState(false);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);

  const fetchTodoList = async (token) => {
    try {
      const response = await fetch(`${SERVER_URL}get_task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      if (response.ok) {
        const data = await response.json();
        setTodoList(data || []);
        console.log(todoList);
      } else {
        console.error("Failed to fetch todo list:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching todo list:", error);
    }
  };

  useEffect(() => {
    fetchTodoList(token);
  }, [token]);

  useEffect(() => {
    const handleSignout = async () => {
      if (signedOut) {
        try {
          const response = await fetch(`${SERVER_URL}signout`, {
            method: "POST",
            headers: { accept: "application/json" },
            body: "",
          });
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            NavigateTo("/");
          } else {
            console.error("Failed to signout:", response.statusText);
          }
        } catch (error) {
          console.error("Error signing out:", error);
        }
      }
    };
    handleSignout();
  }, [NavigateTo, SERVER_URL, signedOut]);

  const handleTodoClick = (index) => {
    setSelectedTodoIndex(index);
    setUpdatedTask({
      ...updatedTask,
      id: todoList[index].id,
      task: todoList[index].task,
    });
    setDisplay("block");
  };

  const createTask = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${SERVER_URL}create_task`, {
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
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`${SERVER_URL}update_task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ id: taskId, task: updatedTask, token: token }),
      });
      if (response.ok) {
        fetchTodoList(token);
      } else {
        console.error("Failed to update task:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${SERVER_URL}delete_task`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ id: taskId, token: token }),
      });
      if (response.ok) {
        fetchTodoList(token);
      } else {
        console.error("Failed to delete task:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const DoneTask = async (taskId) => {
    try {
      const response = await fetch(`${SERVER_URL}done_task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ id: taskId, token: token }),
      });
      if (response.ok) {
        fetchTodoList(token);
      } else {
        console.error("Failed to mark task as done:", response.statusText);
      }
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  return (
    <>
      <div className={styles.tasks}>
        <button
          className={styles["back-btn"]}
          onClick={() => {
            NavigateTo("/");
          }}
        >
          Back
        </button>
        <h2 className={styles.title}>Tasks</h2>
        <div className={styles.taskList}>
          {todoList.length > 0 ? (
            <div>
              <ul className={styles.todoList}>
                {todoList.map((todo, index) => (
                  <li key={index} className={styles.todoItem}>
                    {display !== "none" && index != selectedTodoIndex ? (
                      <div className={styles.label}>
                        <span className={styles.index}>Task-{index + 1}: </span>
                        <span className={styles.updatetask} onClick={() => handleTodoClick(index)}>
                          {" "}
                          {todo.task}
                        </span>
                      </div>
                    ) : (
                      <form name={`update_task-${todo.id}`} className={styles.updateForm}>
                        <label htmlFor={`task-${todo.id}`} className={styles.label}>
                          Task-{index + 1}:
                        </label>
                        <div className={styles.inputContainer}>
                          <input
                            id={`task-${todo.id}`}
                            type="text"
                            value={updatedTask.id === todo.id ? updatedTask.task : todo.task}
                            onChange={(e) => {
                              e.preventDefault();
                              setUpdatedTask({
                                ...updatedTask,
                                task: e.target.value,
                              });
                            }}
                            className={styles.inputField}
                          />
                          <button
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              updateTask(todo.id, updatedTask.task);
                              setDisplay("block");
                              setSelectedTodoIndex(-1);
                            }}
                            className={styles.button}
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    )}
                    <div className={styles.actionIcons}>
                      {!todo.is_complete ? (
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            DoneTask(todo.id);
                          }}
                          className={styles.actionIcon}
                        >
                          &#10003;
                        </span>
                      ) : null}
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          deleteTask(todo.id);
                        }}
                        className={styles.actionIcon}
                      >
                        &times;
                      </span>{" "}
                    </div>
                  </li>
                ))}
                <button onClick={() => setDisplayComplete(!displayComplete)}>
                  Completed tasks
                </button>
                <div style={{ display: displayComplete ? "block" : "none" }}>
                  <Complete list={todoList} deletetask={deleteTask} />
                </div>
              </ul>
            </div>
          ) : (
            <>
              <p>No todos found.</p>
              <form name="createTask" className={styles["form-page"]}>
                <input
                  type="text"
                  name="task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter new task here..."
                  minLength={4}
                  className={styles.inputField}
                  required
                />
                <button
                  type="submit"
                  onClick={(e) => {
                    createTask(e);
                  }}
                  className={styles.createTaskButton}
                >
                  Create
                </button>
              </form>
              <span
                className={styles.signout}
                onClick={() => {
                  setsignedOut(true);
                }}
              >
                Signout
              </span>
            </>
          )}
          {todoList.length > 0 ? (
            <>
              <form name="createTask" className={styles["form-page"]}>
                <input
                  type="text"
                  name="task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter new task here..."
                  minLength={4}
                  className={styles.inputField}
                  required
                />
                <button
                  type="submit"
                  onClick={(e) => {
                    createTask(e);
                  }}
                  className={styles.createTaskButton}
                >
                  Create
                </button>
              </form>
              <span
                className={styles.signout}
                onClick={() => {
                  setsignedOut(true);
                }}
              >
                Signout
              </span>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

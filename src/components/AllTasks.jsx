export default function AllTasksList(todoList) {
  const [display, setDisplay] = useState("block");
  const [displayComplete, setDisplayComplete] = useState(false);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
  const handleTodoClick = (index) => {
    setSelectedTodoIndex(index);
    setUpdatedTask({
      ...updatedTask,
      id: todoList[index].id,
      task: todoList[index].task,
    });
    setDisplay("block");
  };
  return (
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
        <button onClick={() => setDisplayComplete(!displayComplete)}>Completed tasks</button>
        <div style={{ display: displayComplete ? "block" : "none" }}>
          <Complete list={todoList} deletetask={deleteTask} />
        </div>
      </ul>
    </div>
  );
}

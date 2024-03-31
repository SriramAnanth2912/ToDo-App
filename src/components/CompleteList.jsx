import styles from "../tasks.styles.module.css";
import PropTypes from "prop-types";

function Complete({ list, deletetask }) {
  if (!list || list.length === 0) {
    return <div>No completed todos found</div>;
  }

  return (
    <div className={styles.completedTasks}>
      <ul className={styles.list}>
        {list.map((todo, index) =>
          todo.is_complete ? (
            <li key={index} className={styles.todoItem}>
              <span className={styles.index}>Task-{index + 1}: </span>
              <span className={styles.updatetask}> {todo.task}</span>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  deletetask(todo.id);
                }}
                className={styles.actionIcon}
              >
                &times;
              </span>{" "}
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}

Complete.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      task: PropTypes.string.isRequired,
    })
  ).isRequired,
  deletetask: PropTypes.func.isRequired,
};

export default Complete;

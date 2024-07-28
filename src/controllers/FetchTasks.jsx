export const fetchTodoList = async (token) => {
  const [todoList, setTodoList] = useState([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
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

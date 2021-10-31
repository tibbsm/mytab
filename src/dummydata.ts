const dummyTodos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
  let date = new Date().getTime() - 1000 * 60 * 60 * 24 * id;
  let completed = Math.random() > 0.5;
  let complete_at = completed ? date : null;
  return {
    id: date,
    text: `Todo ${id}`,
    created_at: date,
    completed,
    complete_at,
    status: completed ? "done" : "todo",
  };
});

export default dummyTodos;

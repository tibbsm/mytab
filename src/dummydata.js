const dummyTodos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
  let completed = Math.random() > 0.5;
  let complete_at = completed ? new Date().getTime() : null;
  return {
    id: new Date().getTime() + Number(id),
    text: `Todo ${id}`,
    created_at: new Date().getTime(),
    completed,
    complete_at,
  };
});

export default dummyTodos;

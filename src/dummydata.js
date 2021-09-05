const dummyTodos = [
  {
    id: new Date().getTime(),
    text: "test 1",
    completed: false,
    created_at: new Date().getTime(),
    complete_at: null,
  },
  {
    id: new Date().getTime(),
    text: "test 2",
    completed: true,
    created_at: new Date().getTime() - 60 * 60 * 24 * 3,
    complete_at: new Date().getTime() - 60 * 60 * 24 * 3,
  },
  {
    id: new Date().getTime(),
    text: "test 3",
    completed: false,
    created_at: new Date().getTime() - 60 * 60 * 24 * 3,
    complete_at: new Date().getTime() - 60 * 60 * 24 * 3,
  },
  {
    id: new Date().getTime(),
    text: "test 4",
    completed: true,
    created_at: new Date().getTime(),
    complete_at: null,
  },
  {
    id: new Date().getTime(),
    text: "test 5",
    completed: false,
    created_at: new Date().getTime(),
    complete_at: null,
  },
  {
    id: new Date().getTime(),
    text: "test 6`",
    completed: false,
    created_at: new Date().getTime(),
    complete_at: null,
  },
];

export default dummyTodos;

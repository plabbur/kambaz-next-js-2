
import { ListGroup } from "react-bootstrap";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import { useSelector } from "react-redux";

export default function TodoList() {
  const { todos } = useSelector((state: any) => state.todosReducer);

  return (
    <div>
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem todo={todo} key={todo.id} />
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}

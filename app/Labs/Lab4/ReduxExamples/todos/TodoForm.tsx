import { Button, FormControl, ListGroupItem } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
    const dispatch = useDispatch();
  const { todo } = useSelector((state: any) => state.todosReducer);

  return (
    <ListGroupItem className="d-flex bg-light justify-content-between align-items-center gap-2">
      <FormControl
        className="flex-grow-1"
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
      />
      <div className="d-flex gap-2">
        <Button
          variant="warning"
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
        >
          Update
        </Button>
        <Button
          variant="success"
          id="wd-add-todo-click"
          onClick={() => dispatch(addTodo(todo))}
        >
          Add
        </Button>
      </div>
    </ListGroupItem>
  );
}

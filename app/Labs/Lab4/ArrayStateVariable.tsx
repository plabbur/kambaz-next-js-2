import { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function ArrayStateVariable() {
  const { todos } = useSelector((state: any) => state.todosReducer);

  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <Button variant="success" className="mb-2" onClick={addElement}>
        Add Element
      </Button>
      <ul>
        {array.map((item, index) => (
          <li key={index}>
            {item}
            <Button
              variant="danger"
              className="mx-4"
              onClick={() => deleteElement(index)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <ListGroup>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
      </ListGroup>
      <hr />
      <hr />
    </div>
  );
}

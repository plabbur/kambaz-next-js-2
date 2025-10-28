import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { FaPencil, FaTrash } from "react-icons/fa6";

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}) {
  return (
    <div className="float-end">
      <button
        onClick={() => editModule(moduleId)}
        className="btn btn-link border-0 text-primary p-1 text-decoration-none"
      >
        <FaPencil />
      </button>

      <button
        onClick={() => deleteModule(moduleId)}
        className="btn btn-link border-0 text-danger p-1 text-decoration-none"
      >
        <FaTrash />
      </button>

      <GreenCheckmark />
      <BsPlus className="fs-1" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

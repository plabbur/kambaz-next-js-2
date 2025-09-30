import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";

export default function AssignmentTitleControlButtons() {
    return (
        <div className="float-end">
            <span className="me-3" style={{ fontSize: "16px" }}>40% of Total</span>
            <BsPlus className="fs-4 me-1" />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}

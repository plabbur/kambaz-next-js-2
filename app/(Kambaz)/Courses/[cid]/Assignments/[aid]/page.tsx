// "use client"
// import { useParams } from "next/navigation";
import AssignmentEditor from "./Editor";
// import * as db from "../../../../Database";
// import { use } from "react";
// import { usePathname } from "next/navigation";

export default function AssignmentPage() {
  // const pathname = usePathname()

  return (
    <div className="d-flex flex-fill">
      <AssignmentEditor />
    </div>
  );
}

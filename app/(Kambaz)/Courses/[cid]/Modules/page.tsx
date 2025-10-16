"use client";
import { useParams } from "next/navigation";
import * as db from "../../../Database";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";

const ModuleGroup = ({ module }: { module: ModuleType }) => {
  return (
    <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
      <div className="wd-title p-3 ps-2 bg-secondary">
        <BsGripVertical className="me-2 fs-3" />
        {module.name}
        <ModuleControlButtons />
      </div>
      {module.lessons && (
        <ListGroup className="wd-lessons rounded-0">
          {module.lessons.map((lesson: LessonType) => (
            <ModuleLessonItem key={lesson._id} lesson={lesson} />
          ))}
        </ListGroup>
      )}
    </ListGroupItem>
  );
};

const ModuleLessonItem = ({ lesson }: { lesson: LessonType }) => {
  return (
    <ListGroupItem className="wd-lesson p-3 ps-1">
      <BsGripVertical className="me-2 fs-3" />
      {lesson.name}
      <LessonControlButtons />
    </ListGroupItem>
  );
};

export default function Modules() {
  const { cid } = useParams();
  const modules = db.modules as ModuleType[];
  return (
    <div>
      <ModulesControls />
      <br />
      <br />
      <br />
      <br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          .filter((module: ModuleType) => module.course === cid)
          .map((module: ModuleType) => (
            <ModuleGroup key={module._id} module={module} />
          ))}
      </ListGroup>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import * as client from "../../client";

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
  const [moduleName, setModuleName] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  
  const fetchModules = async () => {
    try {
      const fetchedModules = await client.findModulesForCourse(cid as string);
      setModules(fetchedModules);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  };
  
  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const courseId = Array.isArray(cid) ? cid[0] : cid;
    const newModule = { name: moduleName, course: courseId };
    try {
      const createdModule = await client.createModuleForCourse(
        courseId as string,
        newModule
      );
      setModules([...modules, createdModule]);
      setModuleName(""); // Clear input after creating
    } catch (error) {
      console.error("Failed to create module:", error);
    }
  };
  
  const onRemoveModule = async (moduleId: string) => {
    try {
      await client.deleteModule(cid as string, moduleId);
      setModules(modules.filter((m: any) => m._id !== moduleId));
    } catch (error) {
      console.error("Failed to delete module:", error);
    }
  };
  
  const onUpdateModule = async (module: any) => {
    try {
      await client.updateModule(cid as string, module);
      const newModules = modules.map((m: any) =>
        m._id === module._id ? module : m
      );
      setModules(newModules);
    } catch (error) {
      console.error("Failed to update module:", error);
    }
  };
  
  const handleEditModule = (moduleId: string) => {
    const newModules = modules.map((m: any) =>
      m._id === moduleId ? { ...m, editing: true } : m
    );
    setModules(newModules);
  };
  
  const handleModuleNameChange = (moduleId: string, newName: string) => {
    const newModules = modules.map((m: any) =>
      m._id === moduleId ? { ...m, name: newName } : m
    );
    setModules(newModules);
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  return (
    <div>
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={onCreateModuleForCourse}
      />

      <br />
      <br />
      <br />

      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          // .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <ListGroupItem
              key={module._id}
              className="wd-module p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {!module.editing && module.name}
                {module.editing && (
                  <FormControl
                    className="w-50 d-inline-block"
                    onChange={(e) =>
                      handleModuleNameChange(module._id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onUpdateModule({ ...module, editing: false });
                      }
                    }}
                    defaultValue={module.name}
                  />
                )}
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => onRemoveModule(moduleId)}
                  editModule={(moduleId) => handleEditModule(moduleId)}
                />
              </div>
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: LessonType) => (
                    <ModuleLessonItem key={lesson._id} lesson={lesson} />
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}

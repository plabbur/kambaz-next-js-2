"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import * as quizClient from "./Quizzes/client";
import * as assignmentClient from "./Assignments/client";

export default function Breadcrumb({
  course,
}: {
  course: { name: string } | undefined;
}) {
  const pathname = usePathname();
  const params = useParams();
  const [itemName, setItemName] = useState<string | null>(null);

  useEffect(() => {
    const pathSegments = pathname.split("/");

    // Check if we're on a quiz detail page
    const quizzesIndex = pathSegments.indexOf("Quizzes");
    if (quizzesIndex !== -1 && pathSegments[quizzesIndex + 1]) {
      const quizId = pathSegments[quizzesIndex + 1];
      const fetchQuizName = async () => {
        try {
          const quizzes = await quizClient.findQuizzesForCourse(
            params.cid as string
          );
          const quiz = quizzes.find((q: any) => q._id === quizId);
          if (quiz) {
            setItemName(quiz.title);
          }
        } catch (error) {
          console.error("Error fetching quiz name:", error);
        }
      };
      fetchQuizName();
      return;
    }

    // Check if we're on an assignment detail page
    const assignmentsIndex = pathSegments.indexOf("Assignments");
    if (assignmentsIndex !== -1 && pathSegments[assignmentsIndex + 1]) {
      const assignmentId = pathSegments[assignmentsIndex + 1];
      // Skip if it's the "new" page
      if (assignmentId === "new") {
        setItemName("New Assignment");
        return;
      }
      const fetchAssignmentName = async () => {
        try {
          const assignments = await assignmentClient.findAssignmentsForCourse(
            params.cid as string
          );
          const assignment = assignments.find(
            (a: any) => a._id === assignmentId
          );
          if (assignment) {
            setItemName(assignment.title);
          }
        } catch (error) {
          console.error("Error fetching assignment name:", error);
        }
      };
      fetchAssignmentName();
      return;
    }

    // Not on a detail page
    setItemName(null);
  }, [pathname, params.cid]);

  const getDisplayName = () => {
    const lastSegment = pathname.split("/").pop();

    // If we have an item name from the fetch, use it
    if (itemName) {
      return itemName;
    }

    // Otherwise use the last segment
    return lastSegment;
  };

  return (
    <span>
      {course?.name} &gt; {getDisplayName()}
    </span>
  );
}

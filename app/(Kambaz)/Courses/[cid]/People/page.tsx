"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import PeopleTable from "./Table/page";

const BASE = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

export default function People() {
  const { cid } = useParams();
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    if (!cid) return;
    const courseId = Array.isArray(cid) ? cid[0] : cid;
    const res = await axios.get(`${BASE}/api/courses/${courseId}/users`);
    console.log("Fetched users for course", courseId, res.data);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [cid]);

  return (
    <>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </>
  );
}

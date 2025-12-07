import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      // If 401, user is not logged in - that's okay
      if (err.response?.status !== 401) {
        console.error("Unexpected error fetching profile:", err);
      }
    }
    setPending(false);
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  // Always return children, even while pending
  // This prevents a flash of empty content
  return children;
}

// import * as client from "./client";
// import { useEffect, useState } from "react";
// import { setCurrentUser } from "./reducer";
// import { useDispatch } from "react-redux";
// export default function Session({ children }: { children: any }) {
//   console.log("Session component mounted/rendered");
//   const [pending, setPending] = useState(true);
//   const dispatch = useDispatch();
//   const fetchProfile = async () => {
//     console.log("Session: Attempting to fetch profile...");
//     try {
//       const currentUser = await client.profile();
//       console.log("Session: Profile fetched successfully:", currentUser);
//       dispatch(setCurrentUser(currentUser));
//     } catch (err: any) {
//       console.error("Session: Failed to fetch profile:", err);
//       console.error("Session: Error status:", err.response?.status);
//       console.error("Session: Error data:", err.response?.data);
//       // If 401, user is not logged in - that's okay
//       if (err.response?.status === 401) {
//         console.log(
//           "Session: User not authenticated (401) - this is normal if not logged in"
//         );
//       } else {
//         console.error("Session: Unexpected error fetching profile");
//       }
//     }
//     setPending(false);
//   };
//   useEffect(() => {
//     console.log("Session useEffect running");
//     fetchProfile();
//   }, []);

//   // Always return children, even while pending
//   // This prevents a flash of empty content
//   return children;
// }

import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: any }) {
  console.log("Session component mounted/rendered");
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    console.log("Session: Attempting to fetch profile...");
    console.log("Session: API endpoint:", client.USERS_API + "/profile");

    try {
      const currentUser = await client.profile();
      console.log("Session: Profile fetched successfully:", currentUser);
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      console.error("Session: Failed to fetch profile:", err);
      console.error("Session: Error message:", err.message);
      console.error("Session: Error response:", err.response);

      if (err.response?.status === 401) {
        console.log("Session: User not authenticated (401) - this is normal");
      } else {
        console.error("Session: Unexpected error:", err);
      }
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    console.log("Session useEffect running");
    fetchProfile();
  }, []); // This is fine - we only want to fetch once on mount

  return children;
}

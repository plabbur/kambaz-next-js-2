"use client";

import { redirect } from "next/dist/client/components/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { Button, FormControl } from "react-bootstrap";
import * as client from "../client";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const updateProfile = async () => {
    try {
      console.log("sending update", profile);
      const updatedProfile = await client.updateUser(profile);
      console.log("server returned", updatedProfile);
      dispatch(setCurrentUser(updatedProfile));
      // optional: show confirmation
    } catch (e) {
      console.error("update failed", e);
    }
  };

  const fetchProfile = () => {
    if (!currentUser) return redirect("/Account/Signin");
    setProfile(currentUser);
  };
  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    redirect("/Account/Signin");
  };

  useEffect(() => {
    fetchProfile();
    console.log("fetched profile", profile);
  }, []);

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <label htmlFor="wd-username" className="form-label">
            Username
          </label>
          <FormControl
            id="wd-username"
            className="mb-2"
            defaultValue={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <label htmlFor="wd-password" className="form-label">
            Password
          </label>
          <FormControl
            id="wd-password"
            className="mb-2"
            defaultValue={profile.password}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <label htmlFor="wd-firstname" className="form-label">
            First Name
          </label>
          <FormControl
            id="wd-firstname"
            className="mb-2"
            defaultValue={profile.firstName}
            onChange={(e) => {
              setProfile({ ...profile, firstName: e.target.value });
              console.log("first name changed to", e.target.value);
            }}
          />
          <label htmlFor="wd-lastname" className="form-label">
            Last Name
          </label>
          <FormControl
            id="wd-lastname"
            className="mb-2"
            defaultValue={profile.lastName}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <label htmlFor="wd-dob" className="form-label">
            Date of Birth
          </label>
          <FormControl
            id="wd-dob"
            className="mb-2"
            type="date"
            defaultValue={profile.dob}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <label htmlFor="wd-email" className="form-label">
            Email
          </label>
          <FormControl
            id="wd-email"
            className="mb-2"
            defaultValue={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <label htmlFor="wd-role" className="form-label">
            Role
          </label>
          <select
            className="form-control mb-2"
            id="wd-role"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          >
            <option value="USER">Select User Type</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>{" "}
            <option value="STUDENT">Student</option>
            <option value="TA">TA</option>
          </select>
          <Button
            variant="secondary"
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
          >
            {" "}
            Update{" "}
          </Button>

          <Button
            variant="danger"
            onClick={signout}
            className="w-100 mb-2"
            id="wd-signout-btn"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}

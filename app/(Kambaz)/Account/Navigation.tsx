"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountNavigation() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + "/");
    return `list-group-item border-0 ${isActive ? "active" : "text-danger"}`;
  };

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      <Link
        href="/Account/Signin"
        id="wd-account-signin-link"
        className={getLinkClasses("/Account/Signin")}
      >
        {" "}
        Signin{" "}
      </Link>
      <br />
      <Link
        href="/Account/Signup"
        id="wd-account-signup-link"
        className={getLinkClasses("/Account/Signup")}
      >
        {" "}
        Signup{" "}
      </Link>
      <br />
      <Link
        href="/Account/Profile"
        id="wd-account-profile-link"
        className={getLinkClasses("/Account/Profile")}
      >
        {" "}
        Profile{" "}
      </Link>
      <br />
    </div>
  );
}

import { FaHome, FaUser } from "react-icons/fa";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: FaHome,
    roles: ["Admin"],
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: FaUser,
    roles: ["Admin"],
  },
];

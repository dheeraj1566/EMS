import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="order-1 flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
        <Sidebar />
      </div>
    </div>
  );
}

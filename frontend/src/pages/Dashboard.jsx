import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.name}</h1>
      <p className="mt-2 text-sm text-gray-600">
        Use the navigation to manage clients and report clients.
      </p>
    </div>
  );
}

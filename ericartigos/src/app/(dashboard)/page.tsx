"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ericartigos</h1>
            <p className="text-sm text-gray-500">Restaurant Management System</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session.user?.name}
              </p>
              <p className="text-xs text-gray-500">
                {(session.user as any)?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Welcome, {session.user?.name}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Session Information
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-blue-700">Email:</dt>
                  <dd className="text-blue-600">{session.user?.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-blue-700">Role:</dt>
                  <dd className="text-blue-600">
                    {(session.user as any)?.role}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-blue-700">User ID:</dt>
                  <dd className="text-blue-600 truncate">
                    {(session.user as any)?.id}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Test Information */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                ✓ Foundation Complete
              </h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Docker MySQL configured</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Prisma database setup</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>NextAuth.js authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Role-based access control</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>API guard utilities</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Shared types & schemas</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">
              🚀 Next Steps
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>Teams can now build features in parallel</li>
              <li>Use API guards for protected endpoints</li>
              <li>Leverage shared types for type safety</li>
              <li>Implement menu management, orders, inventory, and reports</li>
            </ol>
          </div>
        </div>

        {/* API Test Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            API Testing
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Test the session API endpoint:
              </p>
              <code className="block bg-gray-100 p-3 rounded text-sm text-gray-800 mb-2">
                GET /api/auth/session
              </code>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/auth/session");
                    const data = await res.json();
                    alert(JSON.stringify(data, null, 2));
                  } catch (error) {
                    alert("Error: " + String(error));
                  }
                }}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Test API
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

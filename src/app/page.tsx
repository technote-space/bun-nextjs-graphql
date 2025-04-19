import { auth0 } from '^/lib/auth0';
import TodoApp from './todo-app';

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">TODO App</h1>
          <p className="mb-6 text-center text-gray-600">
            Please sign up or log in to manage your tasks.
          </p>
          <div className="flex flex-col gap-4">
            <a
              href="/auth/login?screen_hint=signup"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded text-center hover:bg-blue-600"
            >
              Sign up
            </a>
            <a
              href="/auth/login"
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded text-center hover:bg-gray-300"
            >
              Log in
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {session.user.name}!</h1>
          <a
            href="/auth/logout"
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Logout
          </a>
        </div>

        <TodoApp userId={session.user.sub} />
      </div>
    </main>
  );
}

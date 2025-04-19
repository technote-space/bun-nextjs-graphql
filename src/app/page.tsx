import { auth0 } from '^/lib/auth0';
import TodoApp from './todo-app';

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="bg-card-background p-8 rounded-lg shadow-md w-full max-w-md border border-card-border">
          <h1 className="text-2xl font-bold mb-6 text-center text-foreground">
            TODO App
          </h1>
          <p className="mb-6 text-center text-foreground/70">
            Please log in to manage your tasks.
          </p>
          <div className="flex flex-col gap-4">
            <a
              href="/auth/login"
              className="w-full py-2 px-4 bg-button-secondary text-button-secondary-text rounded text-center hover:bg-button-secondary/90"
            >
              Log in
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {session.user.name}!
          </h1>
          <a
            href="/auth/logout"
            className="py-2 px-4 bg-button-secondary text-button-secondary-text rounded hover:bg-button-secondary/90"
          >
            Logout
          </a>
        </div>

        <TodoApp userId={session.user.sub} />
      </div>
    </main>
  );
}

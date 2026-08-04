import Link from "next/link";

export default function Header() {
  return (
    <header className="app-header">
      <Link href="/" className="app-title">
        Todo
      </Link>
      <nav className="app-nav">
        <Link href="/">Active</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/create" className="new-task-link">
          + New Task
        </Link>
      </nav>
    </header>
  );
}

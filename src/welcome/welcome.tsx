import { useState } from "react";
import { Link } from "react-router";
import { getBookList } from "~/data";

export function Welcome() {
  const [books] = useState(getBookList);
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="w-full sticky top-0 backdrop-blur-sm">
          <div className="p-4">
            <h1 className="text-5xl text-center font-extrabold">WORDLESS</h1>
          </div>
        </header>
        <nav className="w-full px-4">
          <ul className="flex flex-col gap-4">
            {books.map((book) => (
              <li key={book.id}>
                <Link
                  className="group flex justify-between items-center gap-3 self-stretch px-4 py-3 leading-normal rounded-2xl bg-gray-900 hover:bg-gray-800 transition-colors"
                  to={`/book/${book.id}`}
                  rel="noreferrer"
                >
                  <span>{book.title}</span>
                  <span>{book.wordNum} 词条</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}

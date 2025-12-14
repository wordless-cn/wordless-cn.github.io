import { useState } from "react";
import { NavLink } from "react-router";
import { getBookList } from "~/data";

export function BookSelect() {
  const [books] = useState(getBookList);
  return (
    <nav className="w-full px-4">
      <ul className="flex flex-col gap-4">
        {books.map((book) => (
          <li key={book.id}>
            <NavLink
              className="group flex justify-between items-center gap-3 self-stretch px-4 py-3 leading-normal rounded-2xl bg-gray-900 hover:bg-gray-800 transition-colors"
              to={`/book/${book.id}`}
              rel="noreferrer"
            >
              {({ isPending }) => (
                <>
                  <span>{book.title}</span>
                  <span>{book.wordNum} 词条</span>
                  {isPending ? (
                    <div className="fixed w-full h-full flex items-center justify-center backdrop-blur-xs z-50 top-0 left-0">
                      <div>Loading...</div>
                    </div>
                  ) : null}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

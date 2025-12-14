import { NavLink, Outlet, useLoaderData } from "react-router";
import { WordlessHeader } from "~/components/wordless-header/wordless-header";
import type { Book as BookData } from "~/data.types";

export default function Book() {
  const book = useLoaderData<BookData>();
  return (
    <>
      <WordlessHeader />
      <Outlet />
      <div className="flex gap-2 items-center justify-between p-4 text-gray-500">
        <div>{book.title}</div>
        <NavLink
          to="/select-book"
          className="rounded px-2 py-1 bg-gray-900 hover:bg-gray-800"
        >
          切换单词表
        </NavLink>
      </div>
    </>
  );
}

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

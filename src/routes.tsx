import type { RouteObject } from "react-router";
import Book from "./routes/book/book";
import { bookLoader } from "./routes/book/loader";
import { bookRandomLoader } from "./routes/book-random/loader";
import { homeLoader } from "./routes/home/loader";
import SelectBook from "./routes/select-book/select-book";
import { wordLoader } from "./routes/word/loader";
import Word from "./routes/word/word";

const routes = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <div>Home</div>,
        loader: homeLoader,
      },
      {
        path: "book/:bookId",
        Component: Book,
        loader: bookLoader,
        children: [
          {
            index: true,
            element: <div>Random Words</div>,
            loader: bookRandomLoader,
          },
          {
            path: "word/:wordId",
            Component: Word,
            loader: wordLoader,
          },
        ],
      },
      {
        path: "select-book",
        Component: SelectBook,
      },
    ],
  },
] satisfies RouteObject[];

export default routes;

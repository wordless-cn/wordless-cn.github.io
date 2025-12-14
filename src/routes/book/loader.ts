import { type LoaderFunctionArgs, redirect } from "react-router";
import { getBook } from "~/data";

export async function bookLoader({ params }: LoaderFunctionArgs) {
  console.log("book loader", params);
  const book = getBook(params.bookId!);
  if (!book) {
    console.log(`cannot find book`, params);
    return redirect("/select-book");
  }
  return book;
}

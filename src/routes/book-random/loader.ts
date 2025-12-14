import { type LoaderFunctionArgs, redirect } from "react-router";
import { getBookWords } from "~/data";

export async function bookRandomLoader({ params }: LoaderFunctionArgs) {
  console.log("book random loader", params);
  const words = await getBookWords(params.bookId!);
  if (!words?.length) {
    console.log("book has no words.", words);
    return redirect("/select-book");
  }
  const index = Math.floor(Math.random() * words.length);
  const word = words[index];
  throw redirect(`/book/${params.bookId!}/word/${word.id}`);
}

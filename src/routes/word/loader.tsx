import { type LoaderFunctionArgs, redirect } from "react-router";
import { getBookWord, getBookWordsOnly } from "~/data";

export async function wordLoader({ params }: LoaderFunctionArgs) {
  console.log("word loader", params);
  const word = await getBookWord(params.bookId!, params.wordId!);
  if (!word) {
    console.log(`cannot find word`, params);
    return redirect(`/book/${params.bookId!}`);
  }
  const list = await getBookWordsOnly(params.bookId!);
  return { word, list };
}

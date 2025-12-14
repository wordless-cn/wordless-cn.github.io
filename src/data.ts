import bookLists from "./assets/data/bookLists.json";
import { isValidAnswer } from "./components/wordless-game/wordless-state";
import type { Book, Word } from "./data.types";

const books = bookLists.data.normalBooksInfo;

const jsonFiles = import.meta.glob("./assets/data/json-bare/*.json");

export function getBookList() {
  return books as Book[];
}

export function getBook(bookId: string) {
  return getBookList().find((b) => b.id === bookId);
}

async function loadWords(bookId: string): Promise<Word[] | null> {
  const key = `./assets/data/json-bare/${bookId}.json`;
  if (!Object.hasOwn(jsonFiles, key)) {
    return null;
  }
  const module = await jsonFiles[key]();
  const data = Reflect.get(module as object, "default") as string[];
  return data.map((word, index) => ({
    id: `${bookId}_${index + 1}`,
    word: String(word),
  }));
}

export async function getBookWords(
  bookId: string,
): Promise<Word[] | undefined> {
  const data = await loadWords(bookId);
  return data?.filter((item) => isValidAnswer(item.word));
}

export async function getBookWord(
  bookId: string,
  wordId: string,
): Promise<Word | undefined> {
  const words = await getBookWords(bookId);
  return words?.find((item) => item.id === wordId);
}

export async function getBookWordsOnly(bookId: string) {
  const words = await getBookWords(bookId);
  return words?.map((item) => item.word) ?? [];
}

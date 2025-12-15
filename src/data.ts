import bookLists from "./assets/data/bookLists.json";
import { isValidAnswer } from "./components/wordless-game/wordless-state";
import type { Book, Word, WordWithTranslation } from "./data.types";

const books = bookLists.data.normalBooksInfo;

const bareDatas = import.meta.glob("./assets/data/json-bare/*.json");
const simpleDatas = import.meta.glob("./assets/data/json-simple/*.json");

export function getBookList() {
  return books as Book[];
}

export function getBook(bookId: string) {
  return getBookList().find((b) => b.id === bookId);
}

async function loadBareWords(bookId: string): Promise<Word[] | null> {
  const key = `./assets/data/json-bare/${bookId}.json`;
  if (!Object.hasOwn(bareDatas, key)) {
    return null;
  }
  const module = await bareDatas[key]();
  const data = Reflect.get(module as object, "default") as string[];
  return data.map((word, index) => ({
    id: `${bookId}_${index + 1}`,
    word: String(word),
  }));
}

async function loadSimpleWords(
  bookId: string,
): Promise<WordWithTranslation[] | null> {
  const key = `./assets/data/json-simple/${bookId}.json`;
  if (!Object.hasOwn(simpleDatas, key)) {
    return null;
  }
  const module = await simpleDatas[key]();
  const data = Reflect.get(
    module as object,
    "default",
  ) as WordWithTranslation[];
  data.forEach((word, index) => {
    word.id = `${bookId}_${index + 1}`;
  });
  return data;
}

export async function getBookWords(
  bookId: string,
): Promise<Word[] | undefined> {
  const data = await loadBareWords(bookId);
  return data?.filter((item) => isValidAnswer(item.word));
}

export async function getBookWord(
  bookId: string,
  wordId: string,
): Promise<Word | undefined> {
  const words = await getBookWords(bookId);
  return words?.find((item) => item.id === wordId);
}

export async function getBookWordWithTranslation(
  bookId: string,
  wordId: string,
): Promise<WordWithTranslation | undefined> {
  const words = await loadSimpleWords(bookId);
  console.log("getBookWordWithTranslation", bookId, wordId, words);
  return words?.find((item) => item.id === wordId);
}

export async function getBookWordsOnly(bookId: string) {
  const words = await getBookWords(bookId);
  return words?.map((item) => item.word) ?? [];
}

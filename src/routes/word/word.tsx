import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useParams } from "react-router";
import WordlessGame from "~/components/wordless-game/wordless-game";
import { getBookWordWithTranslation } from "~/data";
import type { Word as WordData, WordWithTranslation } from "~/data.types";

export default function Word() {
  const { bookId } = useParams();
  const { word, list } = useLoaderData<{ word: WordData; list: string[] }>();
  const [detail, setDetail] = useState<WordWithTranslation | undefined>();
  const isListedWord = useMemo(() => {
    const set = new Set(list);
    return (w: string) => set.has(w);
  }, [list]);

  useEffect(() => {
    if (word?.id) {
      getBookWordWithTranslation(bookId!, word.id).then(setDetail);
    }
  }, [bookId, word?.id]);

  if (!word) {
    return <div />;
  }
  return (
    <div>
      <WordlessGame
        bookId={bookId!}
        key={word.word}
        word={word.word}
        detail={detail?.id === word.id ? detail : undefined}
        isListedWord={isListedWord}
      />
    </div>
  );
}

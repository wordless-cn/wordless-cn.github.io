import { useMemo } from "react";
import { NavLink, useLoaderData, useParams } from "react-router";
import WordlessGame from "~/components/wordless-game/wordless-game";
import type { Word as WordData } from "~/data.types";

export default function Word() {
  const { bookId } = useParams();
  const { word, list } = useLoaderData<{ word: WordData; list: string[] }>();
  const isListedWord = useMemo(() => {
    const set = new Set(list);
    return (w: string) => set.has(w);
  }, [list]);
  if (!word) {
    return <div />;
  }
  return (
    <div>
      <WordlessGame
        key={word.word}
        word={word.word}
        isListedWord={isListedWord}
      />
      <div className="flex item-center justify-center px-4 pt-8">
        <NavLink
          to={`/book/${bookId}`}
          className="px-2 h-8 text-gray-500 overflow-hidden rounded bg-gray-900 flex items-center justify-center"
        >
          <div>换一个单词</div>
        </NavLink>
      </div>
    </div>
  );
}

import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import type { WordWithTranslation } from "~/data.types";
import Keyboard from "../keyboard/keyboard";
import useWordlessGameState, {
  CHAR_EMPTY,
  CHAR_EXCLUDED,
  CHAR_INCLUDED,
  CHAR_INPUT,
  CHAR_MATCH,
  GAME_CLEAR,
  GAME_OVER,
  isValidInput,
} from "./wordless-state";

export interface WordlessGameProps {
  bookId: string;
  word: string;
  detail?: WordWithTranslation;
  isListedWord: (word: string) => boolean;
}

const tries = 6;

export default function WordlessGame({
  bookId,
  word,
  detail,
  isListedWord,
}: WordlessGameProps) {
  console.log("render wordless game =>", word);

  const game = useWordlessGameState({
    answer: word,
    tries,
    isListedWord,
  });

  const [showDefinition, setShowDefinition] = useState(false);
  useEffect(() => {
    if (showDefinition) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehaviorY = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.overscrollBehaviorY = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.overscrollBehaviorY = "";
    };
  }, [showDefinition]);

  const { backspace, submit, input } = game;
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      const key = ev.key.toLowerCase();
      console.log("key pressed: ", key);
      if (key === "backspace") {
        backspace();
      } else if (key === "enter") {
        submit();
      } else if (isValidInput(key)) {
        input(key);
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [backspace, input, submit]);

  return (
    <div>
      <div className="flex flex-col gap-2 items-center w-full p-4">
        {game.rendered.map((word) => (
          <div key={word.index} className="flex flex-row gap-1">
            {word.chars.map((char) => (
              <div
                className={clsx(
                  "flex items-center justify-center text-xl w-9 h-9 overflow-hidden uppercase rounded",
                  {
                    [CHAR_EMPTY]: "bg-gray-100 dark:bg-gray-900",
                    [CHAR_INPUT]: "bg-gray-200 dark:bg-gray-800",
                    [CHAR_MATCH]: "bg-green-400 dark:bg-green-600",
                    [CHAR_INCLUDED]: "bg-yellow-300 dark:bg-yellow-600",
                    [CHAR_EXCLUDED]:
                      "bg-gray-100 text-gray-300 dark:bg-gray-900 dark:text-gray-700",
                  }[char.result] || "bg-gray-100 dark:bg-gray-900",
                )}
                key={char.index}
              >
                <div>{char.char}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="h-8 flex flex-row gap-2 items-center justify-center uppercase text-gray-700 dark:text-gray-300">
        {game.message ? (
          <div>{game.message.content}</div>
        ) : (
          <div>{`猜一个${word.length}个字母的单词，你一共有${tries}次机会`}</div>
        )}
        {game.state === GAME_CLEAR || game.state === GAME_OVER ? (
          <button
            type="button"
            className="px-2 h-8 overflow-hidden rounded flex items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-500"
            onClick={() => detail && setShowDefinition(true)}
          >
            释义
          </button>
        ) : null}
      </div>
      <Keyboard
        keyStates={game.keys}
        onKeyPressed={(key) => {
          if (key === "backspace") {
            backspace();
          } else if (key === "enter") {
            submit();
          } else if (isValidInput(key)) {
            input(key);
          }
        }}
      />
      {showDefinition && detail ? (
        <div
          className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md flex items-center justify-center bg-gray-50/80 text-gray-800 dark:bg-gray-950/80 dark:text-gray-200"
          onClick={() => setShowDefinition(false)}
        >
          <div className="px-8 py-16 overflow-y-auto w-full max-h-full">
            <div
              onClick={(e) => e.stopPropagation()}
              className="p-2 w-fit min-w-64 max-w-full mx-auto"
            >
              <div className="text-xl">
                <strong>{detail.word}</strong>
              </div>
              <div className="mt-2">
                {detail.translations.map((trans) => (
                  // biome-ignore lint/correctness/useJsxKeyInIterable: key is not needed here
                  <div>
                    <i>{trans.type}.&nbsp;&nbsp;</i>
                    <span>{trans.translation}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                {detail.phrases.map((phrase) => (
                  // biome-ignore lint/correctness/useJsxKeyInIterable: key is not needed here
                  <div className="mt-1">
                    <div>{phrase.phrase}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {phrase.translation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                （点击此处或屏幕边缘空白处退出）
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex item-center justify-center px-4 pt-8 gap-4">
        <NavLink
          to={`/book/${bookId}`}
          className="px-2 h-8 overflow-hidden rounded flex items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-500"
        >
          <div>换一个单词</div>
        </NavLink>
        <button
          className="px-2 h-8 overflow-hidden rounded flex items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-500"
          onClick={() => game.giveup()}
        >
          <div>认输</div>
        </button>
      </div>
    </div>
  );
}

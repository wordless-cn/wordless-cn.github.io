import clsx from "clsx";
import { useEffect, useState } from "react";
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
  word: string;
  detail?: WordWithTranslation;
  isListedWord: (word: string) => boolean;
}

const tries = 6;

export default function WordlessGame({
  word,
  detail,
  isListedWord,
}: WordlessGameProps) {
  console.log("render wordless game =>", word);
  const { rendered, state, keys, message, backspace, input, submit } =
    useWordlessGameState({
      answer: word,
      tries,
      isListedWord,
    });
  const [showDefinition, setShowDefinition] = useState(false);
  console.log({ detail });
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
    window.addEventListener("keyup", listener);
    return () => {
      window.removeEventListener("keyup", listener);
    };
  }, [backspace, input, submit]);

  return (
    <div>
      <div className="flex flex-col gap-2 items-center w-full p-4">
        {rendered.map((word) => (
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
        {message ? (
          <div>{message?.content}</div>
        ) : (
          <div>{`猜一个${word.length}个字母的单词，你一共有${tries}次机会`}</div>
        )}
        {state === GAME_CLEAR || state === GAME_OVER ? (
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
        keyStates={keys}
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
          className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md flex items-center justify-center p-8 pb-[25vh] bg-gray-50/50 text-gray-800 dark:bg-gray-950/50 dark:text-gray-200"
          onClick={() => setShowDefinition(false)}
        >
          <div className="p-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-xl">
              <strong>{detail.word}</strong>
            </div>
            <div className="mt-2">
              {detail.translations.map((trans) => (
                <div>
                  <i>{trans.type}.&nbsp;&nbsp;</i>
                  <span>{trans.translation}</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              {detail.phrases.map((phrase) => (
                <div className="mt-1">
                  <div>{phrase.phrase}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {phrase.translation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

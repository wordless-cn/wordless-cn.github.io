import clsx from "clsx";
import { useEffect } from "react";
import Keyboard from "../keyboard/keyboard";
import useWordlessGameState, {
  CHAR_EMPTY,
  CHAR_EXCLUDED,
  CHAR_INCLUDED,
  CHAR_INPUT,
  CHAR_MATCH,
  isValidInput,
} from "./wordless-state";

export interface WordlessGameProps {
  word: string;
  isListedWord: (word: string) => boolean;
}

export default function WordlessGame({
  word,
  isListedWord,
}: WordlessGameProps) {
  console.log("render wordless game =>", word);
  const { rendered, keys, message, backspace, input, submit } =
    useWordlessGameState({
      answer: word,
      tries: 6,
      isListedWord,
    });

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
                    [CHAR_EMPTY]: "bg-gray-900",
                    [CHAR_INPUT]: "bg-gray-800",
                    [CHAR_MATCH]: "bg-green-600",
                    [CHAR_INCLUDED]: "bg-yellow-600",
                    [CHAR_EXCLUDED]: "bg-gray-900 text-gray-700",
                  }[char.result] || "bg-gray-900",
                )}
                key={char.index}
              >
                <div>{char.char}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="h-8 flex flex-col items-center justify-center uppercase">
        {message ? <div>{message?.content}</div> : undefined}
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
    </div>
  );
}

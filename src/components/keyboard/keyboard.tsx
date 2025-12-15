import clsx from "clsx";
import { KEY_EXCLUDED, KEY_INCLUDED } from "../wordless-game/wordless-state";

interface KeyboardProps {
  keyStates?: Record<string, string>;
  onKeyPressed?: (key: string) => void;
}

const lines = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];
const display: Record<string, string> = {
  backspace: "删除",
  enter: "提交",
};

export default function Keyboard({
  keyStates = {},
  onKeyPressed = () => {},
}: KeyboardProps) {
  return (
    <div className="flex flex-col gap-2 items-center w-full p-4">
      {lines.map((chars) => (
        <div
          key={chars[0]}
          className="flex flex-row gap-1 w-full justify-center"
        >
          {chars.map((char) => (
            <button
              type="button"
              tabIndex={-1}
              key={char}
              className={clsx(
                "flex w-9 h-11 items-center justify-center text-xl rounded overflow-hidden uppercase max-w-14",
                Object.hasOwn(display, char) ? "flex-1" : "flex-none",
                {
                  [KEY_INCLUDED]:
                    "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
                  [KEY_EXCLUDED]:
                    "bg-gray-50 text-gray-200 dark:bg-gray-950 dark:text-gray-600",
                }[keyStates[char]] ||
                  "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300",
              )}
              onClick={(event) => {
                onKeyPressed(char);
                event.currentTarget.blur();
              }}
            >
              <div>{display[char] || char}</div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

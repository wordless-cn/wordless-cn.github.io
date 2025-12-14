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
                "flex w-9 h-11 items-center justify-center text-xl bg-gray-900 rounded overflow-hidden uppercase max-w-14",
                Object.hasOwn(display, char) ? "flex-1" : "flex-none",
                {
                  [KEY_INCLUDED]: "bg-green-700",
                  [KEY_EXCLUDED]: "bg-gray-950 text-gray-600",
                }[keyStates[char]],
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

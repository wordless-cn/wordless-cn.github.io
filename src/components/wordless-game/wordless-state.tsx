import { produce } from "immer";
import { useCallback, useState } from "react";

export const GAME_PLAYING = "playing";
export const GAME_OVER = "game_over";
export const GAME_CLEAR = "game_clear";

export const CHAR_EMPTY = "empty";
export const CHAR_INPUT = "input";
export const CHAR_MATCH = "match";
export const CHAR_EXCLUDED = "excluded";
export const CHAR_INCLUDED = "included";

export const KEY_INIT = "init";
export const KEY_EXCLUDED = "excluded";
export const KEY_INCLUDED = "included";

interface CharState {
  index: number;
  char: string;
  result: string;
}

interface WordState {
  index: number;
  chars: CharState[];
}

interface GameMessage {
  id: string;
  type: string;
  content: string;
}

type KeyState = Record<string, string>;

interface GameState {
  answer: string[];
  guess: string[];
  rendered: WordState[];
  keys: KeyState;
  index: number;
  total: number;
  state: string;
  message: GameMessage | undefined;
}

type PrintFn = (..._: unknown[]) => void;
const emptyPrint: PrintFn = () => {};
const debugPrint: PrintFn = (...args) => {
  console.log(...args);
};
let print: PrintFn = debugPrint;

export function setWordlessGameDebug(enabled: boolean) {
  print = enabled ? debugPrint : emptyPrint;
}

interface useWordlessGameStateArgs {
  answer: string;
  tries: number;
  isListedWord: (word: string) => boolean;
}

export default function useWordlessGameState({
  answer,
  tries,
  isListedWord,
}: useWordlessGameStateArgs) {
  const [game, setGame] = useState(() => initGame(answer, tries));

  return {
    rendered: game.rendered,
    state: game.state,
    keys: game.keys,
    guess: game.guess.join(""),
    message: game.message,
    input: useCallback((char: string) => setGame(produce(input(char))), []),
    backspace: useCallback(() => setGame(produce(backspace())), []),
    submit: useCallback(
      () => setGame(produce(submit(isListedWord))),
      [isListedWord],
    ),
  };
}

function initRendered(tries: number, length: number) {
  const rendered: WordState[] = [];
  for (let i = 0; i < tries; i++) {
    rendered[i] = { index: i, chars: [] };
    for (let j = 0; j < length; j++) {
      rendered[i].chars[j] = { index: j, char: "", result: CHAR_EMPTY };
    }
  }
  return rendered;
}

const alphabet = "abcdefghijklmnopqrstuvwxyz";
function initKeys() {
  const keys: KeyState = {};
  for (const key of [...alphabet]) {
    keys[key] = KEY_INIT;
  }
  return keys;
}

function initGame(answer: string, tries: number): GameState {
  print(`init game with answer=${answer} tries=${tries}`);

  if (!isValidAnswer(answer)) {
    throw new Error(`invalid answer: ${JSON.stringify(answer)}`);
  }
  const answerChars = [...answer];
  return {
    answer: answerChars,
    guess: [],
    rendered: initRendered(tries, answerChars.length),
    keys: initKeys(),
    index: 0,
    total: tries,
    state: GAME_PLAYING,
    message: undefined,
  };
}

type GameStateRecipe = (game: GameState) => void;

export function isValidAnswer(answer: string) {
  const chars = [...answer];
  return chars.length <= 10 && chars.every(isValidChar);
}

function isValidChar(ch: string) {
  return ch.length === 1 && ch >= "a" && ch <= "z";
}

export function isValidInput(ch: string) {
  return ch === " " || isValidChar(ch);
}

function input(ch: string): GameStateRecipe {
  return (game) => {
    if (!isValidInput(ch)) {
      print(`input is invalid: ${JSON.stringify(ch)}`);
      return;
    }
    if (game.state !== GAME_PLAYING) {
      print(`input is forbidden: game state=${game.state}`);
      return;
    }
    if (game.guess.length >= game.answer.length) {
      print(`input is forbidden: guess is full`, JSON.stringify(game.guess));
      return;
    }
    const char = game.rendered[game.index].chars[game.guess.length];
    char.char = ch;
    char.result = CHAR_INPUT;
    game.guess[game.guess.length] = ch;
    game.message = undefined;
  };
}

function backspace(): GameStateRecipe {
  return (game) => {
    if (game.state !== GAME_PLAYING) {
      print(`backspace is forbidden: game state=${game.state}`);
      return;
    }
    if (game.guess.length === 0) {
      print(`backspace is forbidden: guess is empty`);
      return;
    }
    game.guess.length -= 1;
    const char = game.rendered[game.index].chars[game.guess.length];
    char.char = "";
    char.result = CHAR_EMPTY;
    game.message = undefined;
  };
}

function renderResult(answer: string[], word: WordState, keys: KeyState) {
  answer = [...answer];
  print("render", word, "with answer", answer);
  for (let i = 0; i < word.chars.length; i++) {
    if (word.chars[i].char === answer[i]) {
      print(`char ${answer[i]} is exact match at ${i}:${i}`);
      answer[i] = "_";
      word.chars[i].result = CHAR_MATCH;
      keys[word.chars[i].char] = KEY_INCLUDED;
    }
  }
  for (let i = 0; i < word.chars.length; i++) {
    if (word.chars[i].result === CHAR_INPUT) {
      word.chars[i].result = CHAR_EXCLUDED;
      if (keys[word.chars[i].char] === KEY_INIT) {
        keys[word.chars[i].char] = KEY_EXCLUDED;
      }
      for (let j = 0; j < answer.length; j++) {
        if (word.chars[i].char === answer[j]) {
          print(`char ${answer[j]} is found at ${i}:${j}`);
          answer[j] = "_";
          word.chars[i].result = CHAR_INCLUDED;
          keys[word.chars[i].char] = KEY_INCLUDED;
          break;
        }
      }
    }
  }
  return word.chars.every((char) => char.result === CHAR_MATCH);
}

function submit(
  isListedWord: useWordlessGameStateArgs["isListedWord"],
): GameStateRecipe {
  return (game) => {
    if (game.state !== GAME_PLAYING) {
      print(`submit is forbidden: game state=${game.state}`);
      return;
    }
    if (game.guess.length !== game.answer.length) {
      print(
        `submit is forbidden: guess is not full`,
        JSON.stringify(game.guess),
      );
      return;
    }
    if (!game.guess.every(isValidChar)) {
      print(
        `submit is forbidden: guess is not valid`,
        JSON.stringify(game.guess),
      );
      return;
    }
    const guess = game.guess.join("");
    if (!isListedWord(guess)) {
      print(
        `submit is forbidden: guess is not in list`,
        JSON.stringify(game.guess),
      );
      game.message = newMessage(`"${guess}" 不在单词表中`);
      return;
    }

    const allMatched = renderResult(
      game.answer,
      game.rendered[game.index],
      game.keys,
    );
    game.index++;
    game.guess = [];
    print(`submit: ${game.index} chances used, result is ${allMatched}`);

    if (allMatched) {
      print(`submit: game clear`);
      game.state = GAME_CLEAR;
      game.message = newMessage(
        `${game.index}次猜中答案，单词为：${game.answer.join("")}`,
      );
    } else if (game.index >= game.total) {
      print(`submit: game over`);
      game.state = GAME_OVER;
      game.message = newMessage(
        `${game.total}次猜中失败，单词为：${game.answer.join("")}`,
      );
    } else {
      const included = game.rendered[game.index - 1].chars.filter(
        (x) => x.result !== CHAR_EXCLUDED,
      ).length;
      const matched = game.rendered[game.index - 1].chars.filter(
        (x) => x.result === CHAR_MATCH,
      ).length;
      game.message = newMessage(
        `猜中${included}个字母，其中${matched}个位置正确`,
      );
    }
  };
}

function newMessage(content: string, type: string = "info"): GameMessage {
  return { id: newMessageId(), type, content };
}

function newMessageId() {
  const time = Date.now();
  if (time !== newMessageId.time) {
    newMessageId.time = time;
    newMessageId.seq = 0;
  }
  newMessageId.seq += 1;
  return `${time}_${newMessageId.seq}`;
}
newMessageId.time = 0;
newMessageId.seq = 0;

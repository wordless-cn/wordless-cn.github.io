export interface Book {
  cover: string;
  bookOrigin: {
    originUrl: string;
    desc: string;
    originName: string;
  };
  size: number;
  introduce: string;
  wordNum: number;
  reciteUserNum: number;
  id: string;
  title: string;
  offlinedata: string;
  version: string;
  tags: {
    tagName: string;
    tagUrl: string;
  }[];
}

export interface BookWithWords {
  book: Book;
  words: Word[];
}

export interface Word {
  id: string;
  word: string;
}

export interface WordWithTranslation {
  id: string;
  word: string;
  translations: Translation[];
  phrases: Phrase[];
}

export interface Translation {
  type: string;
  translation: string;
}

export interface Phrase {
  phrase: string;
  translation: string;
}

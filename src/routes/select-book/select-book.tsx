import { BookSelect } from "~/components/book-select/book-select";
import { WordlessHeader } from "~/components/wordless-header/wordless-header";

export default function SelectBook() {
  return (
    <div className="">
      <WordlessHeader />
      <BookSelect />
    </div>
  );
}

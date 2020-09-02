import { Component, OnInit } from "@angular/core";
import {
  BookModel,
  BookRequiredProps
} from "src/app/shared/models";
import {Store} from "@ngrx/store";
import {BooksPageActions} from "../../actions";
import {selectActiveBook, selectAllBooks, selectBooksEarningsTotals, State} from "../../../shared/state";

@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"]
})
export class BooksPageComponent implements OnInit {
  books$ = this.store.select(selectAllBooks);
  currentBook$ = this.store.select(selectActiveBook);
  total$ = this.store.select(selectBooksEarningsTotals);

  constructor(
      private store: Store<State>
  ) {}

  ngOnInit() {
    this.store.dispatch(BooksPageActions.enter());
    this.removeSelectedBook();
  }

  onSelect(book: BookModel) {
    this.store.dispatch(BooksPageActions.selectBook({bookId: book.id}));
  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    this.store.dispatch(BooksPageActions.clearSelectedBook());
  }

  onSave(book: BookRequiredProps | BookModel) {
    if ("id" in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    this.store.dispatch(BooksPageActions.createBook({book: bookProps}));
  }

  updateBook(book: BookModel) {
    this.store.dispatch(BooksPageActions.updateBook({bookId: book.id, changes: book}));
  }

  onDelete(book: BookModel) {
    this.store.dispatch(BooksPageActions.deleteBook({bookId: book.id}));
  }
}

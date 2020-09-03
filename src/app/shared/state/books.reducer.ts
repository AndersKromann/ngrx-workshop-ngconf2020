import {createReducer, on, Action, createSelector} from "@ngrx/store";
import {EntityState, createEntityAdapter} from "@ngrx/entity";
import {BookModel, calculateBooksGrossEarnings} from "src/app/shared/models";
import {BooksPageActions, BooksApiActions} from "src/app/books/actions";

export interface State extends EntityState<BookModel> {
    activeBookId: string | null
}

const adapter = createEntityAdapter<BookModel>();

export const initialState: State = adapter.getInitialState({
    activeBookId: null
});

export const booksReducer = createReducer(
    initialState,
    on(
        BooksPageActions.enter,
        BooksPageActions.clearSelectedBook,
        (state, action) => {
            return {
                ...state,
                activeBookId: null
            };
        }),
    on(BooksPageActions.selectBook,
        (state, action) => {
            return {
                ...state,
                activeBookId: action.bookId
            };
        }),
    on(BooksApiActions.booksLoaded,
        (state, action) => {
            return adapter.setAll(action.books, state);
        }),
    on(BooksApiActions.bookDeleted,
        (state, action) => {
            return adapter.removeOne(action.bookId, state);
        }),
    on(BooksApiActions.bookUpdated,
        (state, action) => {
            return adapter.updateOne({id: action.book.id, changes: action.book}, {
                ...state,
                activeBookId: null
            });
        }),
    on(BooksApiActions.bookCreated,
        (state, action) => {
            return adapter.addOne(action.book, {
                ...state,
                activeBookId: null
            });
        })
);

export function reducer(state: State | undefined, action: Action) {
    return booksReducer(state, action);
}

/**
 * Getters
 */
export const {
    selectAll,
    selectEntities
} = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;

/**
 * Combine selectors
 */
export const selectActiveBook = createSelector(
    selectEntities,
    selectActiveBookId,
    (books, activeBookId) => {
        return activeBookId ? books[activeBookId] : null;
    }
);

export const selectEarningsTotals = createSelector(
    selectAll,
    calculateBooksGrossEarnings
);

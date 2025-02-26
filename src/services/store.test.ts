import { rootReducer } from './store';
import store from './store';

describe('rootReducer initialization', () => {
  it('should return the initial state', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(store.getState());
  });
});

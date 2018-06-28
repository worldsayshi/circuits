
Using redux?

// import redux dependency
import { createStore } from 'redux'

// create a store with reducer
let store = createStore(reducer);

// subscribe a state change handler
store.subscribe(render)

// dispatch a action
store.dispatch(countUp());

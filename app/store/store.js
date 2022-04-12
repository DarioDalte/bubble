import { createStore } from "redux";

const counterReducer = (
  state = { bestSeller: null, randomElements: null },
  action
) => {
  if (action.type === "ADD_BESTSELLER") {
    return {
      bestSeller: action.bestSeller,
      randomElements: state.randomElements
    };
  }
  if (action.type === "ADD_RANDOMELEMENTS") {
    return {
      randomElements: action.randomElements,
      bestSeller: state.bestSeller

    };
  }
  return state;
};

const store = createStore(counterReducer);

export default store;

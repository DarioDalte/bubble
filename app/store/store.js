import { createStore } from "redux";

const counterReducer = (
  state = {
    bestSeller: null,
    randomElements: null,
    wishlistProducts: null,
  },
  action
) => {
  if (action.type === "ADD_BESTSELLER") {
    return {
      bestSeller: action.bestSeller,
      randomElements: state.randomElements,
      wishlistProducts: state.wishlistProducts,
    };
  }
  if (action.type === "ADD_RANDOMELEMENTS") {
    return {
      randomElements: action.randomElements,
      bestSeller: state.bestSeller,
      wishlistProducts: state.wishlistProducts,
    };
  }
  if (action.type === "ADD_WISHLISTPRODUCTS") {
    return {
      wishlistProducts: action.wishlistProducts,
      randomElements: state.randomElements,
      bestSeller: state.bestSeller,
    };
  }

  return state;
};

const store = createStore(counterReducer);

export default store;

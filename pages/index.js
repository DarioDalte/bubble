import { getSession } from "next-auth/client";
import { useEffect, useState } from "react";

import MyHead from "../UI/MyHead/MyHead";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header/Header";
import Main from "../components/Main/Main";
import BottomNav from "../components/BottomNav/BottomNav";

import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");
  const [bestSellersIsLoading, setBestSellersIsLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const bestSellers = useSelector((state) => state.bestSeller);
  const randomElements = useSelector((state) => state.randomElements);

  useEffect(() => {
    // const bestSellers = await getBestSeller(db);
    // const randomEelements = await getRandomEelements(db);
    if (props.session) {
      const obj = {
        email: props.session.user.email,
        name: "Wishlist",
      };
      axios.post("/api/getWishlist", obj).then((res) => {
        const wishlist = res.data;
        const wishlistIds = [];
        wishlist.products.map((product) => {
          wishlistIds.push(product.id);
        });

        if (wishlist.status) {
          dispatch({
            type: "ADD_WISHLISTPRODUCTS",
            wishlistProducts: wishlistIds,
          });
        }
      });
    }
    if (!bestSellers && !randomElements) {
      axios.get("/api/best_sellers").then((res) => {
        const bestSellers = res.data;
        dispatch({ type: "ADD_BESTSELLER", bestSeller: bestSellers });
        setBestSellersIsLoading(false);
      });

      axios.get("/api/random_elements").then((res) => {
        const randomElements = res.data;
        dispatch({
          type: "ADD_RANDOMELEMENTS",
          randomElements: randomElements,
        });
      });
    } else {
      setBestSellersIsLoading(false);
    }
  }, [router.asPath]);

  // const data = useSelector((state) => state.homeProducts);
  // console.log(data);

  return (
    <>
      <MyHead title={"Homepage"} />
      <Header session={props.session} />

      <Main
        bestSellers={bestSellers}
        randomElements={randomElements}
        bestSellersIsLoading={bestSellersIsLoading}
      />

      {isMobile && <BottomNav navValue={0} />}
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  return {
    props: {
      session: session,
    }, // will be passed to the page component as props
  };
}

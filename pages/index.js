import { getSession, useSession } from "next-auth/client";
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

  const dispatch = useDispatch();
  const router = useRouter();
  const [session, stauts] = useSession();
  const { bestSellers, randomElements } = props;

  useEffect(() => {
    if (session) {
      const obj = {
        email: session.user.email,
        name: "Wishlist",
      };
      axios.post("/api/getWishlist", obj).then((res) => {
        const wishlist = res.data;
        const wishlistIds = [];

        if (wishlist.status) {
          wishlist.products.map((product) => {
            wishlistIds.push(product.id);
          });

          dispatch({
            type: "ADD_WISHLISTPRODUCTS",
            wishlistProducts: wishlistIds,
          });
        }
      });
    }
  }, [router.asPath, session]);

  return (
    <>
      <MyHead title={"Homepage"} />
      <Header session={session} />

      <Main bestSellers={bestSellers} randomElements={randomElements} />

      {isMobile && <BottomNav navValue={0} />}
    </>
  );
}

export async function getStaticProps(context) {
  const getBestSeller = require("./api/staticProps/getBestSeller.js");
  const getRandomEelements = require("./api/staticProps/getRandomEelements.js");
  const databaseConnection = require("./api/middlewares/database.js");
  const client = await databaseConnection();
  await client.connect(); //To connect to our cluster
  const db = client.db(); //Boh

  const bestSeller = await getBestSeller(db);
  const randomElements = await getRandomEelements(db);

  client.close();

  return {
    props: {
      bestSellers: JSON.parse(JSON.stringify(bestSeller)),
      randomElements: JSON.parse(JSON.stringify(randomElements)),
    },
    revalidate: 10,
  };
}

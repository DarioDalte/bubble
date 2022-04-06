import classes from "./profile.module.scss";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "../../UI/Card/Card";

import { useState, useEffect} from "react";
import Link from "next/link";

import Button from "../../UI/Button/Button";
import ButtonOutlined from "../../UI/ButtonOutlined/ButtonOutlined";
import BottomNav from "../../components/BottomNav/BottomNav";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


export default function Profile() {

  const [publishableKey, setPublishableKey] = useState('');
  useEffect(() => {
    fetch("api/keys", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setPublishableKey(data.publishableKey);
      });
  }, []);

  if(!publishableKey){
    return 'Loading...';
  }

  const stripe = loadStripe(publishableKey);
  return (
    <>
      <Carousel
        arrows
        centerMode={false}
        containerClass={classes.container}
        draggable
        focusOnSelect={false}
        autoPlaySpeed={999999}
        keyBoardControl
        minimumTouchDrag={80}
        renderButtonGroupOutside={true}
        renderDotsOutside={false}
        itemClass={classes.item}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1600,
            },
            items: 6,
            partialVisibilityGutter: 100,
          },
          miniDesktop: {
            breakpoint: {
              max: 1600,
              min: 1024,
            },
            items: 5,
            partialVisibilityGutter: 100,
          },
          miniTablet: {
            breakpoint: {
              max: 760,
              min: 570,
            },
            items: 3,
            partialVisibilityGutter: 100,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 2,
            partialVisibilityGutter: 1,
          },
          tablet3: {
            breakpoint: {
              max: 570,
              min: 0,
            },
            items: 2,
            partialVisibilityGutter: 1,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 760,
            },
            items: 4,
            partialVisibilityGutter: 30,
          },
        }}
        slidesToSlide={1}
        swipeable
      >
        <Card
          className={classes.card}
          name={"Marzo gay"}
          price={32}
          brand={"Laura e Renato"}
          star={5}
          path={"/galaxybuds.webp"}
        />
        <Card
          className={classes.card}
          name={"Marzo gay"}
          price={32}
          brand={"Laura e Renato"}
          star={5}
          path={"/galaxybuds.webp"}
        />
        <Card
          className={classes.card}
          name={"Marzo gay"}
          price={32}
          brand={"Laura e Renato"}
          star={5}
          path={"/galaxybuds.webp"}
        />
        <Card
          className={classes.card}
          name={"Marzo gay"}
          price={32}
          brand={"Laura e Renato"}
          star={5}
          path={"/galaxybuds.webp"}
        />
        <Card
          className={classes.card}
          name={"Marzo gay"}
          price={32}
          brand={"Laura e Renato"}
          star={5}
          path={"/galaxybuds.webp"}
        />
        <Card
          className={classes.card}
          name={"Marzo gay"}
          price={32}
          brand={"Laura e Renato"}
          star={5}
          path={"/galaxybuds.webp"}
        />
        <Card
          className={classes.card}
          name={"Marzo gay"}
          price={32}
          brand={"Laura e Renato"}
          star={5}
          path={"/galaxybuds.webp"}
        />
        <Card
          className={classes.card}
          name={"Marzo gay"}
          price={32}
          brand={"Laura e Renato"}
          star={5}
          path={"/galaxybuds.webp"}
        />
      </Carousel>
      asd
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "../login",
        permanent: false,
      },
    };
  }
  return { props: {} };
}

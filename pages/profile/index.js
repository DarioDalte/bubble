import classes from "./profile.module.scss";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "../../UI/Card/Card";

export default function Profile() {
  return (
    <Carousel
      arrows={false}
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
          items: 4,
          partialVisibilityGutter: 100,
        },
        miniDesktop: {
          breakpoint: {
            max: 1600,
            min: 1024,
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
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464,
          },
          items: 2,
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

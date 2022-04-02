import classes from "./profile.module.scss";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "../../UI/Card/Card";

export default function Profile() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  return (
    <Carousel
      swipeable={true} 
      arrows
      draggable={true}
      showDots={true}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      infinite={true}
      autoPlay={"mobile" !== "mobile" ? true : false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="all .5"
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      deviceType={"mobile"}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
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

import Image from "next/image";
import classes from "./BestSeller.module.scss";

function BestSeller() {
  return (
    <div className={classes.container}>
      <span className={classes.text}>Best Seller</span>
      <div className={classes["best-seller"]}>
        <div className={classes["title-container"]}>
          <span className={classes.title}>Cuffie</span>
          <span className={classes.subtitle}>Compra ora</span>
        </div>
        <div className={classes.photo}>
          <Image
            src="/headphone.png"
            alt="Picture of the author"
            width={150}
            height={150}
          ></Image>
        </div>
      </div>

      <div className={classes["scrolling-wrapper"]}>
        <div className={classes.card}>
          <Image
            src="/headphone.png"
            alt="Picture of the author"
            width={150}
            height={150}
          ></Image>
          <span className={classes.title}>Cuffie</span>
          <span className={classes.price}>€ 50</span>
          <span className={classes.review}>Recensioni</span>
        </div>
        <div className={classes.card}>
          <Image
            src="/headphone.png"
            alt="Picture of the author"
            width={150}
            height={150}
          ></Image>
          <span className={classes.title}>Cuffie</span>
          <span className={classes.price}>€ 50</span>
          <span className={classes.review}>Recensioni</span>
        </div>
        <div className={classes.card}>
          {" "}
          <Image
            src="/headphone.png"
            alt="Picture of the author"
            width={150}
            height={150}
          ></Image>
          <span className={classes.title}>Cuffie</span>
          <span className={classes.price}>€ 50</span>
          <span className={classes.review}>Recensioni</span>
        </div>
      </div>
    </div>
  );
}

export default BestSeller;

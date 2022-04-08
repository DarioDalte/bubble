import classes from "./profile.module.scss";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/client";

import "react-multi-carousel/lib/styles.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import BackArrow from "../../UI/BackArrow/BackArrow";
import ButtonOutlined from "../../UI/ButtonOutlined/ButtonOutlined";

import useMediaQuery from "@mui/material/useMediaQuery";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

export default function Account() {
  const isMobile = useMediaQuery("(max-width:47rem)");
  const [session, loading] = useSession();
  if (session) {
    const [name, surname] = session.user.name.split(" ");
  }

  console.log(session);

  /** 
  const [publishableKey, setPublishableKey] = useState("");
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

  if (!publishableKey) {
    return "Loading...";
  }

  const stripe = loadStripe(publishableKey);*/
  return (
    <>
      {isMobile && <BottomNav navValue={3} />}
      <BackArrow />
      <div className={classes.body}>
        <h1 className={classes.title}>Account</h1>
        <h2 className={classes.subtitle}>Ciao {name}!</h2>
        <div className={classes["container"]}>
          <div className={classes["btn-container"]}>
            <ButtonOutlined value="Ordini" className={classes["button"]} />
            <ButtonOutlined value="Profilo" className={classes["button"]} />
          </div>
          <div className={classes["btn-container"]}>
            <ButtonOutlined value="Indirizzi" className={classes["button"]} />
            <ButtonOutlined value="Pagamenti" className={classes["button"]} />
          </div>
          <ButtonOutlined value="Assistenza" className={classes["button"]} />
        </div>
      </div>
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

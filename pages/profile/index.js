import classes from "./profile.module.scss";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/client";

import "react-multi-carousel/lib/styles.css";
import BottomNav from "../../components/BottomNav/BottomNav";

import useMediaQuery from "@mui/material/useMediaQuery";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

export default function Profile() {
  const isMobile = useMediaQuery("(max-width:47rem)");

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
      <Link href={'/'}>
        <a>test</a>
      </Link>
    </>
  );
}
/** 
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
}*/

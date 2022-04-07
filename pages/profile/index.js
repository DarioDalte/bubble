import classes from "./profile.module.scss";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/client";


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

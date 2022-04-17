import Head from "next/head";
import React from "react";

function MyHead(props) {
  return (
    <Head>
      <title>{props.title}</title>
      <link rel="shortcut icon" href="/logo.png" />
    </Head>
  );
}

export default MyHead;

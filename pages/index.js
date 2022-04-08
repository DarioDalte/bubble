import { getSession } from "next-auth/client";

import Header from "../components/Header/Header";
import Main from "../components/Main/Main";
import BottomNav from "../components/BottomNav/BottomNav";

import useMediaQuery from "@mui/material/useMediaQuery";

export default function Home(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");

  return (
    <>
      <Header session={props.session} />

      <Main
        bestSeller={props.bestSeller}
        randomElements={props.randomElements}
      />
      {isMobile && <BottomNav navValue={0} />}
    </>
  );
}

export async function getServerSideProps(context) {
  const databaseConnection = require("./api/middlewares/database.js");
  const getBestSeller = require("./api/staticProps/getBestSeller");
  const getRandomEelements = require("./api/staticProps/getRandomEelements");
  const session = await getSession({ req: context.req });

  const client = await databaseConnection(); //Mi connetto al db
  await client.connect(); //istanza mongo client
  const db = client.db(); //db

  const bestSellers = await getBestSeller(db);
  const randomEelements = await getRandomEelements(db);

  client.close();

  return {
    props: {
      bestSeller: bestSellers,
      randomElements: randomEelements,
      session: session,
    }, // will be passed to the page component as props
  };
}

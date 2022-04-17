import BackArrow from "../../UI/BackArrow/BackArrow";
import CustomizedSteppers from "./Stepper/Stepper";

import { getSession } from "next-auth/client";
import MyHead from "../../UI/MyHead/MyHead";


export default function Register(props) {
  return (
    <>
      <MyHead title={'Registrazione'}/>
      <BackArrow path={props.prevPath} />
      <CustomizedSteppers />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "../",
        permanent: false,
      },
    };
  }
  return {
    props: {
      prevPath: context.req.headers.referer
        ? context.req.headers.referer
        : null,
    },
  };
}

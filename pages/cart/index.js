import MyHead from "../../UI/MyHead/MyHead";
import BackArrow from "../../UI/BackArrow/BackArrow";
import { getSession, useSession } from "next-auth/client";
import { useEffect } from "react";
import axios from "axios";

function Cart(props) {

    useEffect(() =>{
        axios.post('/api/getCart', {email: props.session.user.email}).then((res) =>{
            console.log(res.data);
        })
    },[])


  return (
    <>
      <MyHead title="Carello" />
      <BackArrow />
    </>
  );
}

export default Cart;

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
  return { props: { session: session } };
}

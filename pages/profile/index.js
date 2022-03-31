import classes from './profile.module.scss'
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/client";



export default function Profile() {
  return (
    <div>profile</div>
  )
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
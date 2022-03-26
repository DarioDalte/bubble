import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

function useAuth(path) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);
  const userEmail = useSelector((state) => state.email);
  const userName = useSelector((state) => state.name);

  if (isLogged === null) {

    if (localStorage.getItem("token")) {
      const token = "Bearer " + localStorage.getItem("token");
      axios
        .get(
          "https://php-e-commerce-api.herokuapp.com/api/user/user-info.php",
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            dispatch({
              type: "LOGGED",
              email: res.data.user.email,
              name: res.data.user.name,
            });
            path && router.push({ pathname: path });
          } else {
            dispatch({ type: "NOT_LOGGED", expired: true });
            path && router.push({ pathname: path });
          }
        })
        .catch((err) => {
          dispatch({ type: "NOT_LOGGED" });
        });
    } else {
      //dispatch({ type: "NOT_LOGGED" });
      console.log("yes");
      dispatch({
        type: "LOGGED",
        email: "asd",
        name: "name",
      });
    }
  }
  
  return {
    isLoading : false,
  }
}

export default useAuth;

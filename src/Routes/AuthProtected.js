import React from "react";
import { Navigate, Route } from "react-router-dom";


const AuthProtected = (props) =>{
  const data = JSON.parse(sessionStorage.getItem("user"));
  const username = data !== null && data !== undefined ? (data.username !== null ? data.username : '') : '';


console.log(username);

  if (!username) {
    return (
      <Navigate to={{ pathname: "/", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};   

export { AuthProtected, AccessRoute };   
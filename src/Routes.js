import React from "react";
import { Route, Switch } from "react-router-dom";
import Loadable from 'react-loadable';
import asyncComponent from "./components/AsyncComponent";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

const MyLoadingComponent = ({isLoading, error}) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Handle the error state
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  }
  else {
    return null;
  }
};

const AsyncHome = Loadable({
  loader: () => import("./containers/Home"),
  loading: MyLoadingComponent
});

const AsyncLogin = Loadable({
  loader: () => import("./containers/Login"),
  loading: MyLoadingComponent
});


const AsyncNotes = asyncComponent(() => import("./containers/Notes"));
const AsyncSignup = asyncComponent(() => import("./containers/Signup"));
const AsyncNewNote = asyncComponent(() => import("./containers/NewNote"));
const AsyncNotFound = asyncComponent(() => import("./containers/NotFound"));
const AsyncBilling = asyncComponent(() => import("./containers/Billing"));
const AsyncSettings = asyncComponent(() => import("./containers/Settings"));
const AsyncResetPassword = asyncComponent(() => import("./containers/ResetPassword"));
const AsyncChangePassword = asyncComponent(() => import("./containers/ChangePassword"));
const AsyncChangeEmail = asyncComponent(() => import("./containers/ChangeEmail"));

export default ({ childProps }) =>
 <Switch>
  <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />
  <UnauthenticatedRoute path="/login" exact component={AsyncLogin} props={childProps} />
  <UnauthenticatedRoute path="/signup" exact component={AsyncSignup} props={childProps} />
  <AuthenticatedRoute path="/billing" exact component={AsyncBilling} props={childProps} />
  <AuthenticatedRoute path="/notes/new" exact component={AsyncNewNote} props={childProps} />
  <AuthenticatedRoute path="/notes/:id" exact component={AsyncNotes} props={childProps} />
  <UnauthenticatedRoute
     path="/login/reset"
     exact
     component={AsyncResetPassword}
     props={childProps}
  />
  <AuthenticatedRoute
     path="/settings"
     exact
     component={AsyncSettings}
     props={childProps}
  />
  <AuthenticatedRoute
    path="/settings/password"
    exact
    component={AsyncChangePassword}
    props={childProps}
  />
  <AuthenticatedRoute
   path="/settings/email"
   exact
   component={AsyncChangeEmail}
   props={childProps}
  />
  { /* Finally, catch all unmatched routes */ }
  <Route component={AsyncNotFound} />
</Switch>


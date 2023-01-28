import React from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import CreatePost from "../../pages/createPost/createPost"
import Notifications from "../../pages/notifications";
import insertPOS from "../../pages/insertPOS/insertPOS";
import purchase from "../../pages/purchase/purchase";
import modifyItem from "../../pages/modifyItem/modifyItem";
import modifyProduct from "../../pages/modifyProduct/modifyProduct";
// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />
              {/* <Route path="/app/createPost" component={CreatePost} /> */}
              <Route path="/app/insertpos" component={insertPOS} />
              <Route path="/app/purchase" component={purchase} />
              <Route path="/app/modifyitem" component={modifyItem} />
              <Route path="/app/modifyproduct" component={modifyProduct} />
              <Route path="/app/post/:post_id" component={Notifications}  />
              
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);

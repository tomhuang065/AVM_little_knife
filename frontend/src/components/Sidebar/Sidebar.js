import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  EditOutlined as EditOutlinedIcon,
  // Upload as UploadIcon,
  
} from "@material-ui/icons";
import UploadIcon from '@mui/icons-material/Upload';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { useChat } from "../../context/OurContext";

const structure = [
  { id: 0, label: "首頁", link: "/app/dashboard", icon: <HomeIcon /> },
  // { id: 15, label: "Create New Post", link: "/app/createPost", icon: <EditOutlinedIcon/>},
  { id: 16, label: "上傳POS機資料", link: "/app/insertpos", icon: <UploadIcon/>},
  { id: 17, label: "新增費用", link: "/app/purchase", icon: <ShoppingBagIcon/>},
  { id: 18, label: "費用模組", link: "/app/modifyitem", icon: <CategoryIcon/>},
  { id: 19, label: "產品模組", link: "/app/modifyproduct", icon: <InventoryIcon/>},
  { id: 20, label: "庫存", link: "/app/stock", icon: <InventoryIcon/>},
  { id: 21, label: "統計與報表", link: "/app/statistics", icon: <InventoryIcon/>},



  
];

function Sidebar({ location }) {
  const {setCurrentLocation, currentLocation, sendFindItemName, person} = useChat();
  if(location.pathname !== currentLocation){
    const payload = {
      user:person.mail,
  }
    sendFindItemName(payload);
    setCurrentLocation(location.pathname);
  } 
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);

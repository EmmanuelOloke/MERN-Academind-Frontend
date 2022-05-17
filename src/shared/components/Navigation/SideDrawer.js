import React from 'react';
import ReactDOM from 'react-dom';

import './SideDrawer.css';

const SideDrawer = (props) => {
  const content = <aside className="side-drawer">{props.children}</aside>;

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook')); // Using ReactDOM to create a React Portal
};

export default SideDrawer;

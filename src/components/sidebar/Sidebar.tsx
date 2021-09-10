import React from "react";
import { NavLink } from "react-router-dom";

import userImg from "../../assets/everyone.jpeg";

import "./Sidebar.scss";

const Sidebar = () => {
    return (
        <div className="sidebar-component">
            <div className="sidebar-component__user">
                <div className="sidebar-component__user__pp" style={{ backgroundImage: `url(${userImg})` }}></div>
                <h4>@iAmEveryone</h4>
            </div>

            <NavLink to="/" exact>
                Home
            </NavLink>
            <NavLink to="/history" exact>
                History
            </NavLink>
        </div>
    );
};

export default Sidebar;

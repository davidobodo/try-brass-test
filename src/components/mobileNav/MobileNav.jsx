import React from "react";
import { NavLink } from "react-router-dom";

import "./MobileNav.scss";

const MobileNav = () => {
    return (
        <nav className="mobile-nav-component">
            <NavLink to="/" exact>
                Home
            </NavLink>
            <NavLink to="/history" exact>
                History
            </NavLink>
        </nav>
    );
};

export default MobileNav;

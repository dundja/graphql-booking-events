import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

import { AuthContext } from "../../context/auth-context";

const MainNavigation = () => {
    const { authState, authDispatch } = useContext(AuthContext);
    let links;

    if (authState.token) {
        links = (
            <ul>
                <li>
                    <NavLink to="/events">Events</NavLink>
                </li>
                <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                </li>
                <li>
                    <NavLink to="/logout">Logout</NavLink>
                </li>
            </ul>
        );
    } else {
        links = (
            <ul>
                <li>
                    <NavLink to="/events">Events</NavLink>
                </li>
                <li>
                    <NavLink to="/auth">Sign up</NavLink>
                </li>
            </ul>
        );
    }

    return (
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h1>EasyEvent</h1>
            </div>
            <div className="main-navigation__items">{links}</div>
        </header>
    );
};

export default MainNavigation;

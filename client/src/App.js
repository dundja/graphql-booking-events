import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

import { AuthContext } from "./context/auth-context";
import MainNavigation from "./components/Navigation/MainNavigation";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import Logout from "./components/Logout/Logout";

function App() {
    const { authState } = useContext(AuthContext);
    let content;

    if (authState.token) {
        content = (
            <main className="main-content">
                <Redirect exact from="/" to="/events" />
                <Redirect exact from="/auth" to="/events" />
                <Route exact path="/events" component={Events} />
                <Route exact path="/bookings" component={Bookings} />
                <Route exact path="/logout" component={Logout} />
            </main>
        );
    } else {
        content = (
            <main className="main-content">
                <Redirect exact from="/" to="/events" />
                <Route exact path="/auth" component={Auth} />
                <Route exact path="/events" component={Events} />
            </main>
        );
    }

    return (
        <>
            <MainNavigation />
            <Switch>{content}</Switch>
        </>
    );
}

export default App;

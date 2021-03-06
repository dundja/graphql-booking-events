import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./context/auth-context";
import App from "./App";

ReactDOM.render(
    <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>,
    document.getElementById("root")
);

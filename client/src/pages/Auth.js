import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import "./Auth.css";

import useForm from "../hooks/useForm";

const Auth = ({ history }) => {
    const [values, handleChange] = useForm({ email: "", password: "" });
    const [isLoging, setIsLoging] = useState(true);
    const { authState, authDispatch } = useContext(AuthContext);

    const handleSubmit = async e => {
        e.preventDefault();
        const { email, password } = values;

        if (email.trim().length === 0 || password.trim().length === 0) {
            // nemamo nista
            return;
        }

        // GRAPHQL body
        let requestBody;

        // ako nije isLoging onda hocemo da pokazemo SingUp i omogicimo useru da
        // kreira nalog
        if (!isLoging) {
            requestBody = {
                query: `
                mutation CreateUser($email: String!, $password: String!) {
                    createUser(userInput: {email: $email, password: $password}) {
                      _id
                      email
                    }
                  }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        } else {
            requestBody = {
                query: `
                    query Login($email: String!, $password: String!) {
                        login(email: $email, password: $password) {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }

        try {
            const res = await fetch("/graphql", {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed!");
            }

            const { data } = await res.json();
            if (data.login && data.login.token) {
                authDispatch({
                    type: "LOGIN",
                    payload: {
                        token: data.login.token,
                        userId: data.login.userId
                    }
                });
                history.push("/events");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                />
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                />
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setIsLoging(!isLoging)}>
                    Switch to {isLoging ? "Signup" : "Login"}
                </button>
            </div>
        </form>
    );
};

export default Auth;

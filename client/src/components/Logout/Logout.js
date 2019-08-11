import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const Logout = ({ history }) => {
    const { authDispatch } = useContext(AuthContext);

    authDispatch({ type: "LOGOUT" });
    history.push("/events");

    return null;
};

export default Logout;

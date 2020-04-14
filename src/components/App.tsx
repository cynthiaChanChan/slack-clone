import React from "react";
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from "react-router-dom";
import { connect } from "react-redux";
import firebase from "../firebase";

import Home from "./Home/Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import { setUser } from "../redux/actions/user";

import "semantic-ui-css/semantic.min.css";
import "../sass/app.scss";

type AppProps = { setUser: typeof setUser } & RouteComponentProps;

class App extends React.Component<AppProps> {
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user): void => {
            if (user) {
                this.props.setUser(user);
                this.props.history.push("/");
            }
        });
    }
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
        );
    }
}

export default withRouter(connect(null, { setUser })(App));

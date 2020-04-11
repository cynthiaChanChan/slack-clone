import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

import "semantic-ui-css/semantic.min.css";
import "../sass/app.scss";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;

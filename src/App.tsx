import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import History from "./pages/history/History";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/history" component={History} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;

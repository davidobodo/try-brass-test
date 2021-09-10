import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import History from "./pages/history/History";

import Sidebar from "./components/sidebar/Sidebar";

import "./App.scss";

function App() {
    return (
        <BrowserRouter>
            <div className="app-wrapper">
                <Sidebar />
                <div className="app-wrapper__content">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/history" component={History} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;

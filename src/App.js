import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import Admin from './components/Admin';
import ChangeRequest from './components/ChangeRequest';
import ShowChRe from './components/ShowChRe';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/changeRequest" component={ChangeRequest} />
          <Route path="/showChRe" component={ShowChRe} />
          <Redirect to='/admin'/>
        </Switch>
      </HashRouter>
    );
  }
}

export default App;

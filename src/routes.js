import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Subscriber } from 'react-broadcast';
import ApiViewer from './api-viewer';
import Schedule from './schedule';
import Salmon from './salmon';
import NewSalmon from './newsalmon';
import Records from './records';
import Results from './results';
import Meta from './meta';
import Settings from './settings';
import Navigation from './navigation';
import AnnieStore from './annie-store';
import Login from './login';
import About from './about';
import ErrorPage from './error';

// trigger an updateRecords on login for user nickname
class Startup extends React.Component {
  componentDidMount() {
    this.props.splatnet.comm.updateRecords();
  }

  render() {
    return <div />;
  }
}

const StartupWithSplatnet = () => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <Startup splatnet={splatnet} />}
    </Subscriber>
  );
};

const Routes = ({
  token,
  logoutCallback,
  setLocale,
  locale,
  loggedIn,
  setLogin
}) => {
  return (
    <div>
      {loggedIn ? (
        <div>
          <StartupWithSplatnet />
          <Navigation logoutCallback={logoutCallback} />
          <Route path="/home" exact component={About} />
          <Route path="/testApi" component={ApiViewer} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/salmon" component={Salmon} />
          <Route path="/newsalmon" component={NewSalmon} />
          <Route path="/records" component={Records} />
          <Route path="/results" component={Results} />
          <Route path="/meta" component={Meta} />
          <Route path="/store" component={AnnieStore} />
          <Route
            path="/error"
            component={() => <ErrorPage logoutCallback={logoutCallback} />}
          />
          <Route
            path="/settings"
            component={() => (
              <Settings token={token} setLocale={setLocale} locale={locale} />
            )}
          />
        </div>
      ) : (
        <Login setLogin={setLogin} setLocale={setLocale} locale={locale} />
      )}
      <Route
        exact
        path="/"
        render={() =>
          loggedIn ? (
            <Redirect from="/" to="/home" />
          ) : (
            <Redirect from="/" to="/login" />
          )
        }
      />
    </div>
  );
};

export default Routes;

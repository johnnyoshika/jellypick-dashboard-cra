import React, { Component } from 'react';
import { Route, Link, NavLink } from 'react-router-dom';
import Uploader from 'components/Uploader';
import Home from './Home';
import Post from './Post';
import Subscription from './Subscription';
import User from './User';
import './Styles.css';

class View extends Component {
  componentDidMount() {
    if (this.props.session.status !== 'authenticated') this.props.authenticate();
  }

  componentDidUpdate(prevProps) {
    if (this.props.session.status === 'anonymous')
      this.props.history.replace('/login');
  }

  onTryAgainClick = () => {
    this.props.history.push('/login');
  }

  renderError() {
    return (
      <div className="login-container">
        <div className="gutter" />
        <div className="login-main">
          <div className="font-lobster text-center mb-40">Jellypic</div>
          <div className="text-center">
            <button
              className="btn btn-primary btn-lg"
              onClick={this.onTryAgainClick}
            >
              Try again!
            </button>
            <div className="error">{this.props.session.error}</div>
          </div>
        </div>
        <div className="gutter" />
      </div>
    );
  }

  renderSpinner() {
    return (
      <div className="login-container mt-80">
        <div className="gutter" />
        <div className="text-center">
          <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
        </div>
        <div className="gutter" />
      </div>
    );
  }

  renderPage() {
    return (
      <div className="page">
        <div className="header">
          <div className="gutter" />
          <div className="header-content">
            <div className="font-lobster">
              <Link to="/">Jellypic</Link>
            </div>
            <div className="header-content-icons text-right">
              <div />
              <div>
                <NavLink to="/" exact activeClassName="nav-active">
                  <i className="fa fa-home fa-2x" aria-hidden="true" />
                </NavLink>
              </div>
              <div>
                <Uploader history={this.props.history}>
                  <i className="fa fa-cloud-upload fa-2x" aria-hidden="true" />
                </Uploader>
              </div>
              <div>
                <NavLink to="/subscription" activeClassName="nav-active">
                  <i className="fa fa-bell fa-2x" aria-hidden="true" />
                </NavLink>
              </div>
              <div>
                <NavLink to={'/users/' + this.props.session.user} activeClassName="nav-active">
                  <i className="fa fa-user fa-2x" aria-hidden="true" />
                </NavLink>
              </div>
            </div>
          </div>
          <div className="gutter" />
        </div>
        {this.renderUploaderState()}
        <>
          <Route exact path="/" component={Home} />
          <Route path="/posts/:id" component={Post} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/users/:id" component={User} />
        </>
      </div>
    );
  }

  renderUploaderState() {
    if (this.props.uploader.status === 'idle') return null;

    return (
      <div className="uploader-state">
        <div className="gutter" />
        <div className="uploader-state-content">
          {this.props.uploader.status === 'error' && (
            <div className="error">Error: {this.props.uploader.error}</div>
          )}
          {this.props.uploader.status === 'saving' && (
            <div className="progress">Finishing up...</div>
          )}
        </div>
        <div className="gutter" />
      </div>
    );
  }

  render() {
    return ((() => {
        if (this.props.session.status === 'authenticated')
          return this.renderPage();
        else if (this.props.session.status === 'error')
          return this.renderError();
        else
          return this.renderSpinner();
      })()
    );
  }
}

export default View;

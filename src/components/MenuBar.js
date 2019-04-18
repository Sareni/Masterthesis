import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './MenuBar.css';


class MenuBar extends React.Component {
    render() {
      return (
        <div className="menu-bar">
          <div className="left">v0.1</div>
          <div className="center">Masterthesis: Martin Limberger</div>
          {this.renderNavigation()}
        </div>
      );
    }

    renderNavigation() {
      switch(this.props.location.pathname) {
      case '/': return <Link className="menu-bar-link" to="/info">?</Link>
      default: return <Link className="menu-bar-link" to="/">&#8593;</Link>
      }
    }
}

export default withRouter(MenuBar);

import React from 'react';
import './MenuBar.css';


class MenuBar extends React.Component {
    render() {
      return (
        <div className="menu-bar">
          <div className="left">v0.1</div>
          <div className="center">Masterthesis: Martin Limberger</div>
          <button>?</button> {/* use Info-Button here when ready */}
        </div>
      );
    }
}

export default MenuBar;

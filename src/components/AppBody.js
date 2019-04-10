import React from 'react';
import Console from './Console'
import './AppBody.css';
import { default as MenuGame1 } from './Game1/Menu';
import { default as ScreenGame1 } from './Game1/Screen';

class AppBody extends React.Component {
  
    render() {
      return (
        <div className="app-body">
          <div className="app-body-menu">
            {this.renderMenu(this.props.appState)}
          </div>
          <div className="app-body-screen">
            {this.renderScreen(this.props.appState)}
          </div>
        <Console />
        </div>

      );
    }

    renderMenu(appState) {
      let jsx;
      switch(appState) {
        case 1: jsx = (<MenuGame1 />); break;
        default: jsx = (<div></div>);
      }

      return jsx;
    }

    renderScreen(appState) {
      let jsx;
      switch(appState) {
        case 1: jsx = (<ScreenGame1 />); break;
        default: jsx = (<div></div>);
      }

      return jsx;
    }
}

export default AppBody;
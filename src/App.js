import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MenuBar from './components/MenuBar';
import AppBody from './components/AppBody';
import { AppStates } from './helper/enum';

class App extends Component {

  constructor() {
    super();
    this.state = {appState: AppStates.MainMenu };
  }

  render() {
    return (
      <div className="App">
        <MenuBar></MenuBar>
        <AppBody selection={this.state.appState}></AppBody>
      </div>
    );
  }
}

export default App;

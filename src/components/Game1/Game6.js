import React from 'react';
import Console from '../Console'
import './Game1.css';
import Menu from './Menu6';
import Screen from './Screen6';
import ExecutorGA6 from '../../algorithms/Game6/ExecutorGA';
import ExecutorES6 from '../../algorithms/Game6/ExecutorES';
import ExecutorBF6 from '../../algorithms/Game6/ExecutorBF';
import CandidateFactory6 from '../../algorithms/Game6/CandidateFactory';

class Game1 extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        log: [], // { gen: 1, type: 'status', msg: 'Bester Kandidat ...'}
        gameState: [],
        runnig: false,
        gameCounter: 0,
        executor: {},
        generationCount: 10,
        xMax: 0,
        yMax: 0,
      }

      this.gameCounter = this.state.gameCounter;
      this.newMessage = this.newMessage.bind(this);
      this.triggerStart = this.triggerStart.bind(this);
      this.newGameState = this.newGameState.bind(this);
      this.clearGame = this.clearGame.bind(this);
      this.changeStartToResetButton = this.changeStartToResetButton.bind(this);
    }

    newMessage(gen, type, msg) {
      const newLog = this.state.log;
      const running = type === 'fin' ? false : this.state.running
      newLog.push({
        gen,
        type,
        msg
      });
      this.setState({ log: newLog, running} );

    }

    newGameState(data) {
      let gameState = [];
      if (data.playerNumber !== -1) {
        gameState = this.state.gameState;
        gameState.push({ data: { x: data.x, y: data.y }, gameCounter: data.playerNumber });
      }
      this.setState({ gameState });
    }

    triggerStart(data) {
      if (this.state.gameCounter < data.playerCount) {
        const factory = new CandidateFactory6(
          parseInt(data.playerCount),
          parseInt(data.xMax),
          parseInt(data.yMax),
          data.seedValue);
        let executor;
        switch (data.gameType) {
          case 'GA': executor = new ExecutorGA6(
            parseInt(data.generationCount),
            data.seedValue,
            parseInt(data.populationSize),
            parseInt(data.timeout),
            data.mutationRate,
            factory,
            this.newGameState,
            this.newMessage);
            break;
          case 'ES': executor = new ExecutorES6(
            parseInt(data.generationCount),
            data.seedValue,
            parseInt(data.populationSize),
            parseInt(data.timeout),
            data.mutationRate,
            factory,
            this.newGameState,
            this.newMessage);
            break;
          default: executor = new ExecutorBF6(
            parseInt(data.generationCount),
            data.seedValue,
            parseInt(data.populationSize),
            parseInt(data.timeout),
            data.mutationRate,
            factory,
            this.newGameState,
            this.newMessage);
        }
        this.gameCounter += data.playerCount;
        this.setState({ executor, running: true, gameCounter: this.gameCounter, generationCount: data.generationCount, xMax: data.xMax, yMax: data.yMax });
        executor.start();
      }
    }

    clearGame() {
      if (this.state.executor && this.state.executor.stop) {
        this.state.executor.stop();
      }
      this.setState({ log: [], gameState: [], running: false, gameCounter: 0 });
      this.gameCounter = 0;
    }

    changeStartToResetButton() {
      this.setState({ running: !this.state.runnig });
    }
  
    // TODO: add readonly
    render() {
      return (
        <div className="game1-body">
          <Menu triggerStart={this.triggerStart} clearGame={this.clearGame} type={this.state.running ? 'Reset' : 'Start'}  generationCount={this.state.generationCount} changeStartResetButton={this.changeStartToResetButton}/>
          <Screen gameState={this.state.gameState} gameCounter={this.gameCounter} generationCount={this.state.generationCount} xMax={this.state.xMax} yMax={this.state.yMax} />
          <Console log={this.state.log} />
        </div>

      );
    }
}

export default Game1;
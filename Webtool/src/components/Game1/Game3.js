import React from 'react';
import Console from '../Console'
import './Game1.css';
import Menu from './Menu';
import Screen from './Screen';
import ExecutorGA3 from '../../algorithms/Game3/ExecutorGA';
import ExecutorES3 from '../../algorithms/Game3/ExecutorES';
import CandidateFactory3 from '../../algorithms/Game3/CandidateFactory';
import { getSelectionFunction, getReplacementFunction } from '../../algorithms/util';

class Game3 extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        log: [], // { gen: 1, type: 'status', msg: 'Bester Kandidat ...'}
        gameState: [],
        runnig: false,
        gameCounter: 0,
        executor: {},
        fitnessType: 'NE',
        generationCount: 10,
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
      const gameState = this.state.gameState;
      gameState.push({ data: { x: data.x, y: data.y } , gameCounter: data.playerNumber });
      this.setState({ gameState });
    }

    triggerStart(data) {
      if (this.state.gameCounter < data.playerCount) {
        const factory = new CandidateFactory3(
          parseInt(data.playerCount),
          parseInt(data.strategyCount),
          data.seedValue);
        let executor;
        switch (data.gameType) {
          case 'GA': executor = new ExecutorGA3(
            parseInt(data.generationCount),
            data.seedValue,
            parseInt(data.populationSize),
            parseInt(data.timeout),
            1, // selectionPressure
            data.mutationRate,
            factory,
            this.newGameState,
            this.newMessage,
            getSelectionFunction(data.selectionFunction),
            getReplacementFunction(data.replacementFunction),
            data.optimization,
            ); break;
          case 'ES': executor = new ExecutorES3(
            parseInt(data.generationCount),
            data.seedValue,
            parseInt(data.populationSize),
            parseInt(data.timeout),
            1, // selectionPressure
            data.mutationRate,
            factory,
            this.newGameState,
            this.newMessage,
            getSelectionFunction(data.selectionFunction),
            getReplacementFunction(data.replacementFunction),
            data.optimization,
            ); break;
          default: executor = null;
        }
        this.gameCounter += data.playerCount;
        this.setState({ executor, running: true, gameCounter: this.gameCounter, fitnessType: data.fitnessType, generationCount: data.generationCount });
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
          <Menu triggerStart={this.triggerStart} clearGame={this.clearGame} type={this.state.running ? 'Reset' : 'Start'} fitnessType={this.state.fitnessType} generationCount={this.state.generationCount} changeStartResetButton={this.changeStartToResetButton}/>
          <Screen gameState={this.state.gameState} gameCounter={this.gameCounter} fitnessType={this.state.fitnessType} generationCount={this.state.generationCount}/>
          <Console log={this.state.log} />
        </div>

      );
    }
}

export default Game3;
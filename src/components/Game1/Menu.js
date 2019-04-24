import React from 'react';
import './Menu.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerCount: 2,
            strategyCount: 5,
            generationCount: props.generationCount,
            seedValue: Math.floor(Math.random() * 100000),
            populationSize: 10,
            timeout: 1,
            mutationRate: 0.2,
            gameType: 'GA',
            fitnessType: props.fitnessType,
        }

        this.startOrReset = this.startOrReset.bind(this);
        this.onPlayerCountChange = this.onPlayerCountChange.bind(this);
        this.onStrategyCountChange = this.onStrategyCountChange.bind(this);
        this.onGenerationCountChange = this.onGenerationCountChange.bind(this);
        this.onSeedValueChange = this.onSeedValueChange.bind(this);
        this.onPopulationSizeChange = this.onPopulationSizeChange.bind(this);
        this.onTimeoutChange = this.onTimeoutChange.bind(this);
        this.onMutationRateChange = this.onMutationRateChange.bind(this);
        this.setES = this.setES.bind(this);
        this.setGA = this.setGA.bind(this);
        this.setBF = this.setBF.bind(this);
        this.setNE = this.setNE.bind(this);
        this.setMAX = this.setMAX.bind(this);
    }

    startOrReset() {
        if (this.props.type === 'Start') {
            this.props.changeStartResetButton();
            const data = {
                playerCount: this.state.playerCount,
                strategyCount: this.state.strategyCount,
                generationCount: this.state.generationCount,
                seedValue: this.state.seedValue,
                populationSize: this.state.populationSize,
                timeout: this.state.timeout,
                mutationRate: this.state.mutationRate,
                gameType: this.state.gameType,
                fitnessType: this.state.fitnessType,
            }

            this.props.triggerStart(data);
        } else {
            this.props.clearGame();
        }
    }

    onPlayerCountChange(event) {
        this.setState({
            playerCount: event.target.value,
        });
    }

    onStrategyCountChange(event) {
        this.setState({
            strategyCount: event.target.value,
        });
    }

    onGenerationCountChange(event) {
        this.setState({
            generationCount: event.target.value,
        });
    }

    onSeedValueChange(event) {
        this.setState({
            seedValue: event.target.value,
        });
    }

    onPopulationSizeChange(event) {
        this.setState({
            populationSize: event.target.value,
        });
    }

    onTimeoutChange(event) {
        this.setState({
            timeout: event.target.value,
        });
    }

    onMutationRateChange(event) {
        this.setState({
            mutationRate: event.target.value,
        });
    }

    setGA () {
        this.setState({ gameType: 'GA' });
    }

    setES () {
        this.setState({ gameType: 'ES' });
    }
    
    setBF () {
        this.setState({ gameType: 'BF' });
    }

    setNE() {
        this.setState({ fitnessType: 'NE' });
        this.props.clearGame();
    }

    setMAX() {
        this.setState({ fitnessType: 'MAX' });
        this.props.clearGame();
    }

    onCom

    render() {
        return (
            <div className="game1-menu">
                <div className="inputBox">
                    <div className="inputLabel">Spieler Anzahl</div>
                    <div className="inputSwitch">
                        <button onClick={this.setGA} className={this.state.gameType === 'GA' ? 'buttonActive' : 'button'}>GA</button>
                        <button onClick={this.setES} className={this.state.gameType === 'ES' ? 'buttonActive' : 'button'}>ES</button>
                        <button onClick={this.setBF} className={this.state.gameType === 'BF' ? 'buttonActive' : 'button'}>BF</button>
                    </div>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Spieler Anzahl</div>
                    <input type="text" onChange={ this.onPlayerCountChange } value={this.state.playerCount}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Strategie Anzahl</div>
                    <input type="text" onChange={ this.onStrategyCountChange } value={this.state.strategyCount}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Generationen</div>
                    <input type="text" onChange={ this.onGenerationCountChange } value={this.state.generationCount}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Seed Value</div>
                    <input type="text" onChange={ this.onSeedValueChange } value={this.state.seedValue}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Populationsgröße</div>
                    <input type="text" onChange={ this.onPopulationSizeChange } value={this.state.populationSize}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Kriterium</div>
                    <div className="inputSwitch">
                        <button className={this.state.fitnessType === 'NE' ? 'buttonActive' : 'button'} onClick={this.setNE}>NE</button>
                        <button className={this.state.fitnessType === 'MAX' ? 'buttonActive' : 'button'} onClick={this.setMAX}>MAX</button>
                    </div>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Verzögerung</div>
                    <input type="text" onChange={ this.onTimeoutChange } value={this.state.timeout}/>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Mutationsrate</div>
                    <input type="text" onChange={ this.onMutationRateChange } value={this.state.mutationRate}/>
                </div>
                
                <button className="start-button" onClick={this.startOrReset}>{this.props.type}</button>
            </div>
        );
    }
}

export default Menu;
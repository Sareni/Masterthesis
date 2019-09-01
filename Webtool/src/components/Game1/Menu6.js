import React from 'react';
import './Menu.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerCount: 2,
            generationCount: props.generationCount,
            seedValue: Math.floor(Math.random() * 100000),
            populationSize: 10,
            timeout: 1,
            mutationRate: 0.2,
            gameType: 'GA',
            xMax: 50,
            yMax: 50,
            fitnessType: props.fitnessType,
            selectionFunction: 'proportional',
            replacementFunction: 'complete',
            optimization: true,
        }

        this.startOrReset = this.startOrReset.bind(this);
        this.onPlayerCountChange = this.onPlayerCountChange.bind(this);
        this.onGenerationCountChange = this.onGenerationCountChange.bind(this);
        this.onSeedValueChange = this.onSeedValueChange.bind(this);
        this.onPopulationSizeChange = this.onPopulationSizeChange.bind(this);
        this.onTimeoutChange = this.onTimeoutChange.bind(this);
        this.onMutationRateChange = this.onMutationRateChange.bind(this);
        this.onXMaxChange = this.onXMaxChange.bind(this);
        this.onYMaxChange = this.onYMaxChange.bind(this);
        this.setES = this.setES.bind(this);
        this.setGA = this.setGA.bind(this);
        this.setBF = this.setBF.bind(this);
        this.setSelProportional = this.setSelProportional.bind(this);
        this.setSelRandom = this.setSelRandom.bind(this);
        this.setSelTournament = this.setSelTournament.bind(this);
        this.setRepComplete = this.setRepComplete.bind(this);
        this.setRepRandom = this.setRepRandom.bind(this);
        this.setRepElitism = this.setRepElitism.bind(this);
        this.setOptTrue = this.setOptTrue.bind(this);
        this.setOptFalse = this.setOptFalse.bind(this);
    }

    startOrReset() {
        if (this.props.type === 'Start') {
            this.props.changeStartResetButton();
            const data = {
                playerCount: this.state.playerCount,
                generationCount: this.state.generationCount,
                seedValue: this.state.seedValue,
                populationSize: this.state.populationSize,
                timeout: this.state.timeout,
                mutationRate: this.state.mutationRate,
                gameType: this.state.gameType,
                xMax: this.state.xMax,
                yMax: this.state.yMax,
                selectionFunction: this.state.selectionFunction,
                replacementFunction: this.state.replacementFunction,
                optimization: this.state.optimization,
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

    onXMaxChange(event) {
        this.setState({
            xMax: event.target.value,
        });
    }

    onYMaxChange(event) {
        this.setState({
            yMax: event.target.value,
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

    setSelProportional() {
        this.setState({ selectionFunction: 'proportional' });
    }

    setSelRandom() {
        this.setState({ selectionFunction: 'random' });
    }

    setSelTournament() {
        this.setState({ selectionFunction: 'tournament' });
    }

    setRepComplete() {
        this.setState({ replacementFunction: 'complete' });
    }

    setRepRandom() {
        this.setState({ replacementFunction: 'random' });
    }

    setRepElitism() {
        this.setState({ replacementFunction: 'elitism' });
    }

    setOptTrue() {
        this.setState({ optimization: true });
    }

    setOptFalse() {
        this.setState({ optimization: false });
    }

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
                    <div className="inputSwitch">
                        <div className="inputLabel">xMax</div>
                        <div className="inputLabel">yMax</div>
                    </div>
                    <div className="inputSwitch">
                        <input type="text" onChange={ this.onXMaxChange } value={this.state.xMax}/>
                        <input type="text" onChange={ this.onYMaxChange } value={this.state.yMax}/>
                    </div>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Selektionsfunktion</div>
                    <div className="inputSwitch">
                        <button className={this.state.selectionFunction === 'proportional' ? 'buttonActive' : 'button'} onClick={this.setSelProportional}>proportional</button>
                        <button className={this.state.selectionFunction === 'random' ? 'buttonActive' : 'button'} onClick={this.setSelRandom}>random</button>
                        <button className={this.state.selectionFunction === 'tournament' ? 'buttonActive' : 'button'} onClick={this.setSelTournament}>tournament</button>
                    </div>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Ersetzungsfunktion</div>
                    <div className="inputSwitch">
                        <button className={this.state.replacementFunction === 'complete' ? 'buttonActive' : 'button'} onClick={this.setRepComplete}>complete</button>
                        <button className={this.state.replacementFunction === 'random' ? 'buttonActive' : 'button'} onClick={this.setRepRandom}>random</button>
                        <button className={this.state.replacementFunction === 'elitism' ? 'buttonActive' : 'button'} onClick={this.setRepElitism}>elitism</button>
                    </div>
                </div>
                <div className="inputBox">
                    <div className="inputLabel">Optimierung</div>
                    <div className="inputSwitch">
                        <button className={this.state.optimization ? 'buttonActive' : 'button'} onClick={this.setOptTrue}>Ja</button>
                        <button className={!this.state.optimization ? 'buttonActive' : 'button'} onClick={this.setOptFalse}>Nein</button>
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
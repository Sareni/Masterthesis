import React from 'react';
import './Screen.css';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineMarkSeries} from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';



class Screen extends React.Component {
  
    render() {
        return (
            <div className="game1-screen">
                <XYPlot width={960} height={600} xDomain={[0,99]} yDomain={[-5, 0]}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <LineMarkSeries
                        style={{
                        strokeWidth: '1px',
                        }}
                        size='3'
                        lineStyle={{stroke: 'black'}}
                        markStyle={{fill:'83d0f2', strokeWidth: '1px'}}
                        data={this.props.gameState} //[{x: 1, y: 10}, {x: 2, y: 5}, {x: 3, y: 15}]
                    />
                </XYPlot>
            </div>
        );
    }
}

export default Screen;
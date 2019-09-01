import React from 'react';
import './Console.css';

class Console extends React.Component {

    generateEntry(logEntry) {
        return (
            <p>
                [{logEntry.gen}]: {logEntry.msg}
            </p>
            );
    }
  
    render() {
        const log = this.props.log.map(logEntry => {
            return this.generateEntry(logEntry);
        });
        return (
            <div className="console">
                { log }
            </div>
        );
    }
}

export default Console;
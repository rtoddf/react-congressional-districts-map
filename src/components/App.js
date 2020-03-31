import React from 'react';
import CongressionalDistricts from './CongressionalDistricts';
import './app.css';

class App extends React.Component {
    render(){
        return (
            <svg width="960" height="600">
                <CongressionalDistricts width={960} height={600} />
            </svg>
            
        )
    }
}

export default App;
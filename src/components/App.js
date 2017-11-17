import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';

class App extends React.Component {
    constructor(){
        /**
         * We have to call super() in constructor,
         * to initialize React Component we re extending
         * bcs we cannot use keyword this otherwise
         */
        super();
        // Bound methods to the component
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.state = {
            fishes: {},
            order: {}
        };
    }

    addFish(fish){
        // update our state
        const fishes = {...this.state.fishes}; // Make a copy of your current state
        // add our new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // this.state.fishes.fish1 = fish; we can update state like this, but this is not the best practice
        // set state
        this.setState({ fishes })
    }

    loadSamples() {
        this.setState({
            fishes: sampleFishes
        })
    }

    addToOrder(key) {
        // take a copy of our current state
        const order = {...this.state.order}
        // Update or add the new number of fish ordered
        order[key] = order[key] + 1 || 1; // Check if there is that fish in order and increment it, or if it isn't add it to order
        // Update our state
        this.setState({ order });
    }

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {
                            Object.keys(this.state.fishes)
                                .map( (key) => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
                        }
                    </ul>
                </div>
                <Order/>
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
            </div>
        );
    }
};

export default App;
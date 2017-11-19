import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import {base} from "../base";
import PropTypes from 'prop-types';

class App extends React.Component {
    constructor() {
        /**
         * We have to call super() in constructor,
         * to initialize React Component we re extending
         * bcs we cannot use keyword this otherwise
         */
        super();
        // Bind methods to the component
        this.addFish = this
            .addFish
            .bind(this);
        this.loadSamples = this
            .loadSamples
            .bind(this);
        this.updateFish = this
            .updateFish
            .bind(this);
        this.removeFish = this
            .removeFish
            .bind(this);
        this.addToOrder = this
            .addToOrder
            .bind(this);
        this.removeFromOrder = this
            .removeFromOrder
            .bind(this);

        // Initial state
        this.state = {
            fishes: {},
            order: {}
        };
    }

    componentWillMount() {
        // This runs right before <App/> is rendered Hook into Firebase
        this.ref = base.syncState(`${this.props.match.params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        });
        // Check if there is any order in local storage
        const localStorageRef = localStorage.getItem(`order-${this.props.match.params.storeId}`);
        if (localStorageRef) {
            // Update our App component's order state
            this.setState({
                order: JSON.parse(localStorageRef)
            })

        }
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    /**
     * This runs on change
     * @param {any} nextProps - Updated props
     * @param {any} nextState - Updated state
     * @memberof App
     */
    componentWillUpdate(nextProps, nextState) {
        // Small trick - we can pass items to clog in { ... } and it will automatically
        // name them in log
        console.log({nextProps, nextState});

        localStorage.setItem(`order-${this.props.match.params.storeId}`, JSON.stringify(nextState.order));
    }

    addFish(fish) {
        // update our state
        const fishes = {
            ...this.state.fishes
        }; // Make a copy of your current state
        // add our new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // this.state.fishes.fish1 = fish; we can update state like this, but this is
        // not the best practice set state
        this.setState({fishes})
    }
    /**
     * Update fish data on change
     * @param {any} key - key of the fish we want to update
     * @param {any} fish - new updated fish data
     * @memberof App
     */
    updateFish(key, updatedFish) {
        // Make a copy of your current state
        const fishes = {
            ...this.state.fishes
        };
        // update changed fish
        fishes[key] = updatedFish;
        this.setState({fishes});

    }

    removeFish(key) {
        // Make a copy of your current state
        const fishes = {
            ...this.state.fishes
        };
        // We cannot use delete fishes[key] because of Firebase, so we must set it to
        // null
        fishes[key] = null;
        // Update state
        this.setState({fishes});
    }

    loadSamples() {
        this.setState({fishes: sampleFishes})
    }

    addToOrder(key) {
        // take a copy of our current state
        const order = {
            ...this.state.order
        };
        // Update or add the new number of fish ordered
        order[key] = order[key] + 1 || 1; // Check if there is that fish in order and increment it, or if it isn't add it to order
        // Update our state
        this.setState({order});
    }

    removeFromOrder(key) {
        // take a copy of our current state
        const order = {
            ...this.state.order
        };
        // Remove order
        delete order[key];
        // Update state
        this.setState({order});
    }

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {Object
                            .keys(this.state.fishes)
                            .map((key) => <Fish
                                key={key}
                                index={key}
                                details={this.state.fishes[key]}
                                addToOrder={this.addToOrder}/>)
}
                    </ul>
                </div>
                <Order
                    fishes={this.state.fishes}
                    order={this.state.order}
                    params={this.props.match.params}
                    removeFromOrder={this.removeFromOrder}/>
                <Inventory
                    addFish={this.addFish}
                    loadSamples={this.loadSamples}
                    fishes={this.state.fishes}
                    updateFish={this.updateFish}
                    storeId={this.props.match.params.storeId}
                    removeFish={this.removeFish}/>
            </div>
        );
    }
};

App.propTypes = {
    match: PropTypes.object.isRequired
}
export default App;
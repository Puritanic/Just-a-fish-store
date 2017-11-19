import React from 'react';
import {formatPrice} from "../helpers";
import CSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';

class Order extends React.Component {
    constructor() {
        super();
        this.renderOrder = this
            .renderOrder
            .bind(this);
    }
    renderOrder(key) {
        const fish = this.props.fishes[key];
        const count = this.props.order[key];
        const removeButton = <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>

        if (!fish || fish.status === 'unavailable') {
            return <li key={key}>
                Sorry, {fish
                    ? fish.name
                    : 'Fish'}
                is no longer available!{removeButton}</li>
        }

        return (
            <li key={key}>
                <span>
                    <CSSTransitionGroup
                        component="span"
                        className="count"
                        transitionName="count"
                        transitionEnterTimeout={250}
                        transitionLeaveTimeout={250}
                    >
                        <span key={count}>{count} </span>
                    </CSSTransitionGroup>
                    lbs {fish.name} {removeButton} 
                </span>
                <span className="price">{formatPrice(count * fish.price)}</span>
            </li>
        )
    }

    render() {
        const orderIds = Object.keys(this.props.order);
        const total = orderIds.reduce((prevTotal, key) => {
            /**
             * fish - fishes from props.fishes
             * count - how many of those fishes customer had bought
             * for example if there is fish-1 in the order this will tell us how many was purchased
             */
            const fish = this.props.fishes[key];
            const count = this.props.order[key];
            const isAvailable = fish && fish.status === 'available';

            if (isAvailable) {
                return prevTotal + (count * fish.price || 0); // || 0 because sometimes fish wil be in the order, but then it will be deleted
            }
            return prevTotal;
        }, 0) // We have to start reduce with the starting value of 0
        return (
            <div className="order-wrap">
                <h2>Your order</h2>
                <CSSTransitionGroup
                    className="order"
                    component="ul"
                    transitionName="order"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>

                    {orderIds.map(this.renderOrder)}
                    <li className="total">
                        <strong>Total:
                        </strong>
                        {formatPrice(total)}
                    </li>

                </CSSTransitionGroup>
            </div>
        );
    }
}

Order.propTypes = {
    fishes: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    removeFromOrder: PropTypes.func.isRequired
}

export default Order;
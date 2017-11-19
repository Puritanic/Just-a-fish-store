import React from 'react';
import { getFunName } from '../helpers';
import PropTypes from 'prop-types';
class StorePicker extends React.Component {
    goToStore(e) {
        e.preventDefault(); // Prevent form from submitting
        // Grab the text from the box
        console.log(this.storeInput.value);
        // Transition from '/' to '/store/:box-text'
        this.props.history.push(`store/${this.storeInput.value}`)
    }

    render(){
        return (
            <form className="store-selector" onSubmit={this.goToStore.bind(this)} >
                <h2>Please enter a store</h2>
                <input type="text" placeholder="Store Name" defaultValue={getFunName()} ref={(input) => {this.storeInput = input}} required/>
                <button type="submit">Visit Store</button>
            </form>
        )
    }
}
/**
 * Tell React that StorePick component expects something
 * called router.
 */
// StorePicker.contextTypes = {
//     router: PropTypes.object
// }
StorePicker.propTypes = {
    history: PropTypes.string.isRequired
}

export default StorePicker;
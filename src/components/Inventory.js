import React from 'react';
import AddFishForm from './AddFishForm';
import PropTypes from 'prop-types';
import { app } from '../base';
import firebase from 'firebase';

const facebook = new firebase.auth.FacebookAuthProvider();
const github = new firebase.auth.GithubAuthProvider();
const twitter = new firebase.auth.TwitterAuthProvider();

class Inventory extends React.Component {

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.renderInventory = this.renderInventory.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this); 

        this.state = {
            uid: null,
            owner: null
        }
    }

    componentDidMount(){
        // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
        app.auth().onAuthStateChanged((user) => {
            if(user){
                this.authHandler({ user });
            }
        });
    }

    handleChange(event, key) {
        const fish = this.props.fishes[key];
        // Take a copy of that fish and update it with a new data
        const updatedFish = {...fish, [event.target.name]: event.target.value};
        console.log(updatedFish);
        this.props.updateFish(key, updatedFish);
    }
    /**
     *  Auth method called with click on Log in with ... button
     * @param {any} provider - Provider like github, fb or twitter to authenticate with
     * @memberof Inventory
     */
    authenticate(provider){
        app.auth().signInWithPopup(provider).then((authData) => this.authHandler(authData)).catch( (err) => { throw Error(err) });
    }

    logout(){
        app.auth().signOut();
        this.setState({ uid: null });
    }
    /**
     * Handle data received with authenticate method
     * @param {any} authData - Payload full of information received from authenticate()
     * @memberof Inventory
     */
    authHandler(authData) {
        if(!authData){
            console.log('Error happened');
            return;
        }
        
        // Grab the store info
        const storeRef = app.database().ref(this.props.storeId);

        // Query the firebase once for the store data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};
            // Claim it as our own if there is no owner already
            if (!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                })
            }
            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        });
    }

    renderLogin(){
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={ () => this.authenticate(github)} >
                    Log in with Github
                </button>
                <button className="facebook" onClick={ () => this.authenticate(facebook)} >
                    Log in with Facebook
                </button>
                <button className="twitter" onClick={ () => this.authenticate(twitter)} >
                    Log in with Twitter
                </button>
            </nav>
        )
    }

    renderInventory(key){
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
                <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)} />
                <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)} />
                <select name="status" value={fish.status} onChange={(e) => this.handleChange(e, key)} >
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, key)} ></textarea>
                <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)} />
                <button onClick={ () => this.props.removeFish(key) }> Remove Fish </button>                
            </div>
        )
    }

    render() {
        const logout = <button onClick={ () => this.logout() }>Log Out!</button>
        // Check if user is not logged in
        if (!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }

        // Check if current user is the owner of the current store
        if (this.state.uid !== this.state.owner ) {
            return (
                <div>
                    <p>Sorry, you aren't owner of this store!</p>
                    {logout}
                </div>
            )
        }

        return (
            <div>
            <h2>Inventory</h2>
            {logout}
            {
                Object.keys(this.props.fishes)
                    .map(this.renderInventory)
            }
            <AddFishForm addFish={this.props.addFish}/>
            <button onClick = { this.props.loadSamples } > Load Sample Fishes! </button>
            </div>
        );
    }
}

Inventory.propTypes = {
    fishes: PropTypes.object.isRequired,
    loadSamples: PropTypes.func.isRequired,
    addFish: PropTypes.func.isRequired,
    updateFish: PropTypes.func.isRequired,
    removeFish: PropTypes.func.isRequired,
    storeId: PropTypes.string.isRequired
}

export default Inventory;
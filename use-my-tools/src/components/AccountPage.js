import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom"
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LocationSearchInput from './LocationSearchInput';

import axios from 'axios';

import "./css/AccountPage.css";

const styles = theme => ({
    container: {
      display: "flex"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit
    },
    dense: {
      marginTop: 16
    },
    menu: {
      width: 200
    }
});

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            firstName: '',
            lastName: '',
            email: '',
            homeStreetAddress: '',
            imageId: null,
            imageUrl: '',
            selectedFile: null,
            error: null,
        };
    }

    componentDidMount() {
        axios.get('/api/users/userinfo')
            .then(user => {
                this.setState({
                    user: user.data,
                    firstName: user.data.firstname,
                    lastName: user.data.lastname,
                    email: user.data.email,
                    homeStreetAddress: user.data.home_street_address,
                    imageId: user.data.image_id,
                    imageUrl: user.data.image_url,
                }, () => console.log('AccountPage state after GET user info: ', this.state)) ;
            })
            .catch(error => {
                console.log(error.message);
            })
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value
        });
    };

    updateUserDetails = event => {
        console.log('AccountPage state on updateUserDetails: ', this.state);

        const user = {
            firstname: this.state.firstName,
            lastname: this.state.lastname,
            email: this.state.email,
            home_street_address: this.state.homeStreetAddress,
        }

        axios.put('/api/users/updateuserdetails', user)
            .then(user => {
                console.log("Response from /updateuserdetails", user.data);
                this.setState({
                    firstName: user.data.firstname,
                    lastName: user.data.lastname,
                    email: user.data.email,
                    homeStreetAddress: user.data.home_street_address,
                    imageUrl: user.data.image_url,
                })
                .catch(error => {
                    console.log(error.message);
                });
            })

    }

    fileChangedHandler = (event) => {
        this.setState({
          selectedFile: event.target.files[0]
        }, () => {
          this.imageUpload(event);
        });
    };
    
    
    imageUpload = event => {
        console.log('inside imageUpload file is', this.state.selectedFile);
    
        let data = new FormData();
            data.append('image_id', this.state.imageId);
            data.append('image_file', this.state.selectedFile);
        
        // this.setState({loading:true});	  
        axios.put(`/api/users/updateimage`, data)
          .then(response => {
                      console.log('response after image update', response.data);
                      this.setState({image_url:response.data.url, loading:false});
          })
          .catch(error => {
                    console.log(error.message);
                    this.setState({ error:error });
          })
    
            //  event.preventDefault();
    };

    render() {
        const { classes } = this.props;
        const  addressReceived = this.state.homeStreetAddress;
        return (
            <div className="account-page-container">

                <div className="left-container">
                    <form onSubmit={this.updateUserDetails}>
                        <h2>Account Details</h2>
                        <TextField
                            id="outlined-first-name"
                            label="First Name"
                            className={classes.textField}
                            value={this.state.firstName}
                            onChange={this.handleChange("firstName")}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextField
                            id="outlined-last-name"
                            label="Last Name"
                            className={classes.textField}
                            value={this.state.lastName}
                            onChange={this.handleChange("lastName")}
                            margin="normal"
                            variant="outlined"
                        />

                        {/* <TextField
                            id="outlined-home-street-address"
                            label="Street Address"
                            className={classes.textField}
                            value={this.state.homeStreetAddress}
                            onChange={this.handleChange("homeStreetAddress")}
                            margin="normal"
                            variant="outlined"
                        /> */}
                        <div className="location-input">
                            {addressReceived ? (
                                <LocationSearchInput 
                                    handleSelectLocation={this.handleSelectLocation}
                                    address={this.state.homeStreetAddress} 
                                 />
                            ) : (
                                ''
                            )}
                            
                        </div>

                        <Button variant="outlined" color="primary" className="save-button" type="submit" >
                            Save
                        </Button>

                        </form>
                        
                        <Link to="/updatepassword">Update Password</Link>
                    
                </div> 
                {/* end left-container */}

                <div className="right-container">
                    <h2>Profile Image</h2>
                    <img
                        src={this.state.imageUrl}
                        alt="profile picture"
                    />
                    <br/>
                    <form className="image-upload" onSubmit={this.imageUpload}>
                        <input
                            accept="image/*"
                            id="outlined-button-file"
                            type="file"
                            onChange={this.fileChangedHandler}
                        />
                    </form>
                </div>
                {/* end right-container */}

            </div>
        );
    }
}

export default withStyles(styles)(withRouter(AccountPage));
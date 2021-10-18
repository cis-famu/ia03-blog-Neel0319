import React, {Component} from 'react';
import axios from "axios";

export const AuthContext = React.createContext( {
    currentUser:{},
    setCurrentUser: ()=> {},
    signIn: () => {},
    signOut: () => {}
});

export class AuthContext extends Component {

    state = {
        currentUser: {},
        setCurrentUser: (user) => {
            this.setState ( {currentUser: user})
        },
        signIn: async (username, password) => {
            const data = {
                username: username,
                password: password
            }
            await axios.post("http://localhost:4000/login", data).then((res )=>{
                this.state.setCurrentUser(res.data.response); //set state variable
                //add user object to browsers storage
                localStorage.setItem("user", JSON.stringify(this.state.currentUser))
            }).catch(err => console.log(err));
        },
        signOut: async () =>{
            await axios.get("http://localhost:4000/logout").then(res =>)
            {
                this.state.setCurrentUser({});
                localStorage.removeItem("user");
            })
            }
        }

    render() {
        const {children} = this.props;
        const {currentUser, setCurrentUser, signIn, signOut} = this.state
        return (
            <AuthContext.Provider value={{currentUser, setCurrentUser, signIn, signOut}}>
                {children}
            </AuthContext.Provider>
        );
    }
}

export const AuthConsumer = AuthContext.Consumer;

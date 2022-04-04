import React from "react";

const API_URL = 'https://localhost:7246/api/';

class User extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthenticated: false,
            username: '',
            users: []
        };
    }

    handleResponse(response: any) {
        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response.json();
    }

    handleError(error: any) {
        console.log(error.message);
    }

    handleLogin() {
        const requestOpions ={
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '123456' })
        };

        fetch(API_URL + 'Users/authenticate', requestOpions)
            .then(this.handleResponse)
            .then((data) => {
                localStorage.setItem("token", data.token);
                this.setState({
                    isAuthenticated: true,
                    username: data.fullName
                });
            })
            .catch(this.handleError);
    }

    handleUserList() {
        const token = localStorage.getItem('token') ?? '';
        const requestOpions ={
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        };

        fetch(API_URL + 'users', requestOpions)
            .then(this.handleResponse)
            .then((data) => {
                this.setState({ users: data });
            })
            .catch(this.handleError);
    }
    render(): React.ReactNode {
        const { users, isAuthenticated, username } = this.state;
        return (
            <div>
                <h1>Sample ReactJS app using fetch API.</h1>
                <div>
                    {!isAuthenticated && <button onClick={() => this.handleLogin()}>Login</button>}
                    {isAuthenticated && (
                        <>
                            <span>Hi, {username}</span>&nbsp;
                            <button onClick={() => this.handleUserList()}>Load users</button>
                        </>
                    )}
                </div>
                <p>List of users</p>
                <ul>
                    {users.map((user: any) => (
                        <li key={user.id}>{user.name} ({user.title})</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default User;
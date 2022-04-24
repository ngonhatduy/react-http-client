import React from "react";
import agent from "./service/agent";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const API_URL = 'https://localhost:7246/api/';
const webAPIHeader = {
    "Content-Type": "application/json;odata=verbose"
};
class User extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthenticated: false,
            username: '',
            users: [],
            loading: false
        };
    }

    handleResponse(response: any) {
        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response.json();
    }

    handleError(error: any) {
        console.log(error);
    }

    handleLogin() {
        this.setState({loading: true});
        const body = JSON.stringify({
            username: 'admin', password: '123456'
        });
        const header = {
            headers: {
              'Content-Type': 'application/json'
            }
        }

        agent.User.getToken('Users/authenticate', body, header)
            //.then(this.handleResponse)
            .then((data) => {
                console.log(data);
                localStorage.setItem("token", data.token);
                this.setState({
                    isAuthenticated: true,
                    username: data.fullName
                });
                
            })
            .catch(this.handleError)
            .finally(() => this.setState({loading: false}));
    }

    handleUserList() {
        this.setState({loading: true});
        const token = localStorage.getItem('token') ?? '';
        const header = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            }
        }
        //fetch(API_URL + 'users', requestOpions)
        agent.User.getUserList('users', header)
            //.then(this.handleResponse)
            .then((data) => {
                this.setState({ users: data });
            })
            .catch(this.handleError)
            .finally(() => this.setState({loading: false}))
    }
    
    render(): React.ReactNode {
        const { users, isAuthenticated, username } = this.state;
        //if(this.state.loading) return <LoadingComponent/>
        return (
            <div>
                <h1>Sample ReactJS app using fetch API.</h1>
                <div>
                    {!isAuthenticated &&
                    <LoadingButton
                    loading={this.state.loading}
                    onClick={() => this.handleLogin()}
                    size="small"
                    sx={{backgroundColor: "#DDDDDD"}}>Login</LoadingButton>}
                    {isAuthenticated && (
                        <>
                            <span>Hi, {username}</span>&nbsp;
                            <LoadingButton
                                loading={this.state.loading}
                                onClick={() => this.handleUserList()}
                                size="small"
                                sx={{backgroundColor: "#DDDDDD"}}>Load users</LoadingButton>
                        </>
                    )}
                </div>
                <p>List of users</p>
                <TableContainer >
                <Table sx={{ maxWidth: 250, align: "center", textAlign: "center" }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Title</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.map((user: any) => (
                        <TableRow
                        key={user.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {user.name}
                        </TableCell>
                        <TableCell align="right">{user.title}</TableCell>

                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
        );
    }
}
export default User;
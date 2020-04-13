import React from "react";
import { Link } from "react-router-dom";
import md5 from "md5";
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon,
} from "semantic-ui-react";
import * as types from "../../type";
import firebase from "../../firebase";

type Errors = {
    message: string;
}[];

type State = {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    errors: Errors;
    loading: boolean;
    usersRef: firebase.database.Reference;
};

class Register extends React.Component {
    state: State = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref("users"),
    };

    handleChange = ({
        target: { name, value },
    }: types.InputChangeEvent): void => {
        this.setState({ [name]: value });
    };

    isFormEmpty = (): boolean => {
        const { username, email, password, passwordConfirmation } = this.state;
        return (
            !username.trim().length ||
            !email.trim().length ||
            !password.trim().length ||
            !passwordConfirmation.trim().length
        );
    };

    isPasswordValid = (): boolean => {
        let { password, passwordConfirmation } = this.state;
        if (password.trim() !== passwordConfirmation.trim()) {
            return false;
        } else if (password.trim().length < 6) {
            return false;
        } else {
            return true;
        }
    };

    isFormValid = (): boolean => {
        const errors: Errors = [];
        let message = "";
        if (this.isFormEmpty()) {
            message = "Fill in all fields.";
            this.setState({ errors: errors.concat({ message }) });
            return false;
        } else if (!this.isPasswordValid()) {
            message = "Password is invalid.";
            this.setState({ errors: errors.concat({ message }) });
            return false;
        } else {
            return true;
        }
    };

    displayErrors = (errors: Errors): JSX.Element[] =>
        errors.map(
            ({ message }: { message: string }, i: number): JSX.Element => (
                <p key={i}>{message}</p>
            )
        );

    saveUser = ({ user }: firebase.auth.UserCredential) => {
        if (!user) {
            return;
        }
        const { uid, displayName, photoURL } = user;
        return this.state.usersRef.child(uid).set({
            name: displayName,
            avatar: photoURL,
        });
    };

    handleSubmit = async (event: types.FormEvent): Promise<void> => {
        const { loading, email, password, username } = this.state;
        event.preventDefault();
        if (loading || !this.isFormValid()) {
            return;
        }
        this.setState({ errors: [], loading: true });
        try {
            const createdUser = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password);
            console.log(createdUser);
            try {
                await createdUser.user?.updateProfile({
                    displayName: username,
                    photoURL: `https://www.gravatar.com/avatar/${md5(
                        email
                    )}?d=identicon`,
                });
                await this.saveUser(createdUser);
                console.log("User saved.");
                this.setState({ loading: false });
            } catch (err) {
                throw new Error(err.message);
            }
        } catch (err) {
            this.setState({
                loading: false,
                errors: [{ message: err.message }],
            });
            console.error(err);
        }
    };

    handleInputError = (errors: Errors, inputName: string): string => {
        const result = errors.some((error): boolean =>
            error.message.toLowerCase().includes(inputName)
        );
        return result ? "error" : "";
    };

    render() {
        const {
            username,
            email,
            password,
            passwordConfirmation,
            errors,
            loading,
        } = this.state;
        return (
            <Grid
                textAlign="center"
                verticalAlign="middle"
                className="register app"
            >
                <Grid.Column className="register__column">
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for Slack Clone
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="username"
                                type="text"
                                icon="user"
                                iconPosition="left"
                                placeholder="username"
                                onChange={this.handleChange}
                                value={username}
                            />
                            <Form.Input
                                fluid
                                name="email"
                                type="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                onChange={this.handleChange}
                                value={email}
                                className={this.handleInputError(
                                    errors,
                                    "email"
                                )}
                            />
                            <Form.Input
                                fluid
                                name="password"
                                type="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={this.handleChange}
                                value={password}
                                className={this.handleInputError(
                                    errors,
                                    "password"
                                )}
                            />
                            <Form.Input
                                fluid
                                name="passwordConfirmation"
                                type="password"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Password Conformation"
                                onChange={this.handleChange}
                                value={passwordConfirmation}
                                className={this.handleInputError(
                                    errors,
                                    "password"
                                )}
                            />
                            <Button
                                disabled={loading}
                                className={loading ? "loading" : ""}
                                color="orange"
                                fluid
                                size="large"
                            >
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Already a user? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;

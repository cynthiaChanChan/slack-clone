import React from "react";
import { Link } from "react-router-dom";
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
    email: string;
    password: string;
    errors: Errors;
    loading: boolean;
};

class Login extends React.Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
    };

    handleChange = ({
        target: { name, value },
    }: types.InputChangeEvent): void => {
        this.setState({ [name]: value });
    };

    isFormValid = (): boolean => {
        const { email, password } = this.state;
        return email.trim().length > 0 && password.trim().length > 0;
    };

    displayErrors = (errors: Errors): JSX.Element[] =>
        errors.map(
            ({ message }: { message: string }, i: number): JSX.Element => (
                <p key={i}>{message}</p>
            )
        );

    handleSubmit = async (event: types.FormEvent): Promise<void> => {
        const { loading, email, password } = this.state;
        event.preventDefault();
        if (loading || !this.isFormValid()) {
            return;
        }
        this.setState({ errors: [], loading: true });
        try {
            const signedInUser = await firebase
                .auth()
                .signInWithEmailAndPassword(email, password);
            console.log(signedInUser);
        } catch (err) {
            console.error(err);
            this.setState({
                loading: false,
                errors: [{ message: err.message }],
            });
        }
    };

    handleInputError = (errors: Errors, inputName: string): string => {
        const result = errors.some((error): boolean =>
            error.message.toLowerCase().includes(inputName)
        );
        return result ? "error" : "";
    };

    render() {
        const { email, password, errors, loading } = this.state;
        return (
            <Grid
                textAlign="center"
                verticalAlign="middle"
                className="register app"
            >
                <Grid.Column className="register__column">
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login to Slack Clone
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
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
                            <Button
                                disabled={loading}
                                className={loading ? "loading" : ""}
                                color="violet"
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
                        Don't have an account?{" "}
                        <Link to="/register">Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;

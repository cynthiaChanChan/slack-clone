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

class Register extends React.Component {
    state = {};

    handleChange() {}

    render() {
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
                    <Form size="large">
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="username"
                                type="text"
                                icon="user"
                                iconPosition="left"
                                placeholder="username"
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                name="email"
                                type="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                name="password"
                                type="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                name="passwordConfirmation"
                                type="password"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Password Conformation"
                                onChange={this.handleChange}
                            />
                            <Button color="orange" fluid size="large">
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Already a user? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;

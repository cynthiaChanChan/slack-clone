import React from "react";
import { Segment, Input, Button } from "semantic-ui-react";
import { InputChangeEvent } from "../../type";
import { Channel } from "../SidePanel/Channels";
import firebase from "../../firebase";

type MessageFormProps = {
    messageRef: firebase.database.Reference;
    currentUser: firebase.User | null;
    currentChannel: Channel | null;
};

export type MessageType = {
    timestamp: Object;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
};

class MessageForm extends React.Component<MessageFormProps> {
    state = {
        message: "",
        loading: false,
        errors: [],
    };

    handleChange = (event: InputChangeEvent) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    createMessage = () => {
        const { currentUser } = this.props;
        const message: MessageType = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: currentUser?.uid || "",
                name: currentUser?.displayName || "",
                avatar: currentUser?.photoURL || "",
            },
            content: this.state.message,
        };

        return message;
    };

    sendMessage = async () => {
        let { message, errors } = this.state;
        const { messageRef, currentChannel } = this.props;
        message = message.trim();
        if (!message) {
            this.setState({
                errors: [{ message: "Add a message" }],
            });
            return;
        }
        this.setState({
            loading: true,
        });
        if (!currentChannel) {
            return;
        }
        try {
            await messageRef
                .child(currentChannel.id)
                .push()
                .set(this.createMessage());
            this.setState({
                loading: false,
                errors: [],
                message: "",
            });
        } catch (err) {
            console.error(err.message);
            this.setState({
                loading: false,
                errors: errors.concat(err),
            });
        }
    };

    render() {
        const { loading, message, errors } = this.state;
        const errorClassName = errors.some((error: { message: string }) =>
            error.message.includes("message")
        )
            ? "error"
            : "";
        return (
            <Segment className="message-form">
                <Input
                    fluid
                    name="message"
                    label={<Button icon="add" />}
                    labelPosition="left"
                    placeholder="Write your message"
                    value={message}
                    onChange={this.handleChange}
                    className={`${errorClassName} input`}
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        disabled={loading}
                        onClick={this.sendMessage}
                    />
                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessageForm;

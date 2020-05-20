import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import { Channel } from "../SidePanel/Channels";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm, { MessageType } from "./MessageForm";
import Message from "./Message";

type MessagesProps = {
    currentUser: firebase.User | null;
    currentChannel: Channel | null;
};

class Messages extends React.Component<MessagesProps> {
    state = {
        messageRef: firebase.database().ref("messages"),
        loadedMessages: [],
        messagesLoading: true,
    };

    addMessageListener = (channelId: string) => {
        const { messageRef } = this.state;
        const loadedMessages: MessageType[] = [];
        messageRef.child(channelId).on("child_added", (snap) => {
            loadedMessages.push(snap.val());
            this.setState({
                loadedMessages,
                messagesLoading: false,
            });
        });
    };

    addListeners = (channelId: string) => {
        this.addMessageListener(channelId);
    };

    componentDidMount() {
        console.log("messages");
        const { currentChannel, currentUser } = this.props;
        if (currentChannel && currentUser) {
            this.addListeners(currentChannel.id);
        }
    }

    removeListeners = () => {
        const { currentChannel } = this.props;
        currentChannel && this.state.messageRef.child(currentChannel.id).off();
    };

    componentWillUnmount() {
        this.removeListeners();
    }

    displayMesssages = () => {
        const { loadedMessages } = this.state;
        const { currentUser } = this.props;
        return loadedMessages.map((message: MessageType) => (
            <Message
                key={message.timestamp.toString()}
                message={message}
                currentUser={currentUser}
            />
        ));
    };

    render() {
        const { messageRef } = this.state;
        const { currentUser, currentChannel } = this.props;
        return (
            <div className="messages">
                <MessagesHeader />

                <Segment className="messages-box">
                    <Comment.Group>{this.displayMesssages()}</Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={messageRef}
                    currentUser={currentUser}
                    currentChannel={currentChannel}
                />
            </div>
        );
    }
}

export default Messages;

import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import { Channel } from "../SidePanel/Channels";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm, { MessageType } from "./MessageForm";
import Message from "./Message";
import { InputChangeEvent } from "../../type";
import { connect } from "react-redux";
import { StoreState } from "../../redux/reducers";

type MessagesProps = {
    currentUser: firebase.User | null;
    currentChannel: Channel | null;
    isPrivateChannel: boolean | Channel;
};

class Messages extends React.Component<MessagesProps> {
    state = {
        privateMessageRef: firebase.database().ref("privateMessages"),
        messageRef: firebase.database().ref("messages"),
        loadedMessages: [],
        messagesLoading: true,
        progressBar: false,
        numUniqueUsers: "",
        searchTerm: "",
        searchLoading: false,
        searchResults: [],
    };

    getMessageRef = () => {
        const { privateMessageRef, messageRef } = this.state;
        return this.props.isPrivateChannel ? privateMessageRef : messageRef;
    };

    countUniqueUsers = (messages: MessageType[]) => {
        const uniqueUsers = messages.reduce((acc: string[], message) => {
            if (!acc.includes(message.user.id)) {
                acc.push(message.user.id);
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length !== 1;
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
        this.setState({ numUniqueUsers });
    };

    addMessageListener = (channelId: string) => {
        const ref = this.getMessageRef();
        const loadedMessages: MessageType[] = [];
        ref.child(channelId).on("child_added", (snap) => {
            loadedMessages.push(snap.val());
            this.setState({
                loadedMessages,
                messagesLoading: false,
            });
            this.countUniqueUsers(loadedMessages);
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
        const { loadedMessages, searchResults, searchTerm } = this.state;
        const { currentUser } = this.props;
        const messages = searchTerm ? searchResults : loadedMessages;
        return messages.map((message: MessageType) => (
            <Message
                key={message.timestamp.toString()}
                message={message}
                currentUser={currentUser}
            />
        ));
    };

    isProgressBarVisible = () => {
        this.setState({ progressBar: !this.state.progressBar });
    };

    displayChannelName = () => {
        const { currentChannel, isPrivateChannel } = this.props;
        return currentChannel
            ? `${isPrivateChannel ? "@" : "#"}${currentChannel.name}`
            : "";
    };

    handleSearchMessages = () => {
        const { searchTerm, loadedMessages } = this.state;
        const channelMessages: MessageType[] = [...loadedMessages];
        const regex = new RegExp(searchTerm, "gi");
        const searchResults = channelMessages.reduce(
            (acc: MessageType[], message) => {
                if (
                    (message.content && message.content.match(regex)) ||
                    message.user.name.match(regex)
                ) {
                    acc.push(message);
                }
                return acc;
            },
            []
        );
        this.setState({ searchResults });
        setTimeout(() => {
            this.setState({ searchLoading: false });
        }, 1000);
    };

    handleSearchChange = (event: InputChangeEvent) => {
        this.setState(
            {
                searchTerm: event.target.value,
                searchLoading: true,
            },
            () => this.handleSearchMessages()
        );
    };

    render() {
        const { progressBar, numUniqueUsers, searchLoading } = this.state;
        const { currentUser, currentChannel, isPrivateChannel } = this.props;
        return (
            <div className={`${progressBar && "messages-progress"} messages`}>
                <MessagesHeader
                    channelName={this.displayChannelName()}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={isPrivateChannel}
                />

                <Segment className="messages-box">
                    <Comment.Group>{this.displayMesssages()}</Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={this.getMessageRef()}
                    currentUser={currentUser}
                    currentChannel={currentChannel}
                    isProgressBarVisible={this.isProgressBarVisible}
                    isPrivateChannel={isPrivateChannel}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: StoreState) => ({
    isPrivateChannel: state.channel.isPrivateChannel,
});

export default connect(mapStateToProps)(Messages);

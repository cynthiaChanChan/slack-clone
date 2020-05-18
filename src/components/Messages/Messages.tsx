import React from "react";
import { Segment, Comment } from "semantic-ui-react";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";

class Messages extends React.Component {
    render() {
        return (
            <div className="messages">
                <MessagesHeader />

                <Segment className="messages-box">
                    <Comment.Group>{/* Messages */}</Comment.Group>
                </Segment>

                <MessageForm />
            </div>
        );
    }
}

export default Messages;

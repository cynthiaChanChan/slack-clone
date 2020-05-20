import React from "react";
import moment from "moment";

import { Comment } from "semantic-ui-react";
import { MessageType } from "./MessageForm";

type MessageProps = {
    message: MessageType;
    currentUser: firebase.User | null;
};

const timeFromNow = (timestamp: Object) => moment(timestamp).fromNow();

const Message = ({ message, currentUser }: MessageProps) => (
    <Comment>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content
            className={
                message.user.id === currentUser?.uid ? "message-self" : ""
            }
        >
            <Comment.Author as="a">{message.user.name}</Comment.Author>
            <Comment.Metadata>
                {timeFromNow(message.timestamp)}
            </Comment.Metadata>
            <Comment.Text>{message.content}</Comment.Text>
        </Comment.Content>
    </Comment>
);

export default Message;

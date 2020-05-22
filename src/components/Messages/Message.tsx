import React from "react";
import moment from "moment";

import { Comment, Image } from "semantic-ui-react";
import { MessageType } from "./MessageForm";

type MessageProps = {
    message: MessageType;
    currentUser: firebase.User | null;
};

const timeFromNow = (timestamp: Object) => moment(timestamp).fromNow();

const isImage = (message: MessageType): boolean =>
    message.hasOwnProperty("image") && !message.hasOwnProperty("content");

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
            {isImage(message) ? (
                <Image src={message.image} className="message-image" />
            ) : (
                <Comment.Text>{message.content}</Comment.Text>
            )}
        </Comment.Content>
    </Comment>
);

export default Message;

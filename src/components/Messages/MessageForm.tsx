import React from "react";
import { v4 } from "uuid";
import { Segment, Input, Button } from "semantic-ui-react";
import { InputChangeEvent } from "../../type";
import { Channel } from "../SidePanel/Channels";
import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

type MessageFormProps = {
    messageRef: firebase.database.Reference;
    currentUser: firebase.User | null;
    currentChannel: Channel | null;
    isProgressBarVisible: () => void;
};

export type MessageType = {
    timestamp: Object;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    content?: string;
    image?: string;
};

type MessageFormState = {
    storageRef: firebase.storage.Reference;
    uploadTask: firebase.storage.UploadTask | null;
    uploadState: string;
    percentUploaded: number;
    loading: boolean;
    errors: { message: string }[];
    modal: boolean;
    fields: {
        [key: string]: string;
    };
};

class MessageForm extends React.Component<MessageFormProps, MessageFormState> {
    constructor(props: MessageFormProps) {
        super(props);
        this.state = {
            storageRef: firebase.storage().ref(),
            uploadTask: null,
            uploadState: "",
            percentUploaded: 0,
            loading: false,
            errors: [],
            modal: false,
            fields: {},
        };
    }

    handleChange = (event: InputChangeEvent) => {
        const { name, value } = event.target;
        const { fields } = this.state;
        fields[name] = value;
        this.setState({ fields });
    };

    createMessage = (fileUrl = "") => {
        const { currentUser } = this.props;
        const message: MessageType = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: currentUser?.uid || "",
                name: currentUser?.displayName || "",
                avatar: currentUser?.photoURL || "",
            },
        };
        if (fileUrl !== "") {
            message.image = fileUrl;
        } else {
            message.content = this.state.fields.message;
        }
        return message;
    };

    sendMessage = async () => {
        let { fields, errors } = this.state;
        const { messageRef, currentChannel } = this.props;
        const message = fields.message.trim();
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
                fields: { ...fields, message: "" },
            });
        } catch (err) {
            console.error(err.message);
            this.setState({
                loading: false,
                errors: errors.concat(err),
            });
        }
    };

    handleModal = () => {
        const { modal } = this.state;
        this.setState({ modal: !modal });
    };

    getFileExtention = (fileName: string) => {
        const fileNameArr = fileName.split(".");
        return fileNameArr[fileNameArr.length - 1];
    };

    uploadError = (err: { message: string }) => {
        console.error(err);
        this.setState({
            errors: this.state.errors.concat(err),
            uploadState: "error",
            uploadTask: null,
        });
    };

    sendFileMessage = async (fileUrl: string) => {
        const { messageRef, currentChannel, isProgressBarVisible } = this.props;
        if (!currentChannel) {
            return;
        }
        const pathToUpload = currentChannel.id;

        try {
            await messageRef
                .child(pathToUpload)
                .push()
                .set(this.createMessage(fileUrl));
            this.setState({
                uploadState: "done",
            });
            isProgressBarVisible();
        } catch (err) {
            this.uploadError(err);
        }
    };

    upLoadFile = (file: File, metadata: { contentType: string }) => {
        const extention = this.getFileExtention(file.name);
        const filePath = `chat/public/${v4()}.${extention}`;

        this.setState(
            {
                uploadState: "uploading",
                uploadTask: this.state.storageRef
                    .child(filePath)
                    .put(file, metadata),
            },
            () => {
                this.props.isProgressBarVisible();
                this.state.uploadTask?.on(
                    "state_changed",
                    (snap) => {
                        const { bytesTransferred, totalBytes } = snap;
                        const percentUploaded = Math.round(
                            (bytesTransferred / totalBytes) * 100
                        );
                        this.setState({ percentUploaded });
                    },
                    this.uploadError,
                    async () => {
                        try {
                            const downloadUrl = await this.state.uploadTask?.snapshot.ref.getDownloadURL();
                            this.sendFileMessage(downloadUrl);
                        } catch (err) {
                            this.uploadError(err);
                        }
                    }
                );
            }
        );
    };

    render() {
        const {
            loading,
            fields,
            errors,
            modal,
            uploadState,
            percentUploaded,
        } = this.state;
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
                    value={fields.message}
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
                        disabled={uploadState === "uploading"}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                        onClick={this.handleModal}
                    />
                </Button.Group>
                <ProgressBar
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}
                />
                <FileModal
                    modal={modal}
                    handleModal={this.handleModal}
                    upLoadFile={this.upLoadFile}
                />
            </Segment>
        );
    }
}

export default MessageForm;

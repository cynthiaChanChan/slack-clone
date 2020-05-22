import React from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import { InputChangeEvent } from "../../type";

type FileModalProps = {
    modal: boolean;
    handleModal: () => void;
    upLoadFile: (file: File, metadata: { contentType: string }) => void;
};

type FileModalState = {
    file: null | File;
};

class FileModal extends React.Component<FileModalProps, FileModalState> {
    constructor(props: FileModalProps) {
        super(props);
        this.state = {
            file: null,
        };
    }
    addFile = (event: InputChangeEvent) => {
        const files = event.target.files;
        if (files) {
            this.setState({ file: files[0] });
        }
    };

    clearFile = () => {
        this.setState({ file: null });
    };

    sendFile = () => {
        const { file } = this.state;
        const { upLoadFile, handleModal } = this.props;
        if (!file) {
            return;
        }
        const metadata = { contentType: file.type };
        upLoadFile(file, metadata);
        handleModal();
        this.clearFile();
    };

    render() {
        const { modal, handleModal } = this.props;

        return (
            <Modal basic open={modal} onClose={handleModal}>
                <Modal.Header>Select an Image File</Modal.Header>
                <Modal.Content>
                    <Input
                        fluid
                        label="file types: jpg, png"
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={this.addFile}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.sendFile}>
                        <Icon name="checkmark" /> Send
                    </Button>
                    <Button color="red" inverted onClick={handleModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default FileModal;

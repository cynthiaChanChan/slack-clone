import React from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { InputChangeEvent } from "../../type";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { StoreState } from "../../redux/reducers";
import { setCurrentChannel } from "../../redux/actions/channel";

type ChannelsProps = {
    currentUser: firebase.User | null;
    setCurrentChannel: typeof setCurrentChannel;
};

export type Channel = {
    id: string;
    name: string;
    details?: string;
    createdBy?: string;
};

class Channels extends React.Component<ChannelsProps> {
    state = {
        activeChannel: "",
        channels: [],
        channelName: "",
        channelDetails: "",
        modal: false,
        channelsRef: firebase.database().ref("channels"),
        firstLoad: true,
    };

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if (this.state.firstLoad && firstChannel) {
            this.changeChannel(firstChannel);
            this.setState({
                firstLoad: false,
            });
        }
    };

    addListeners = () => {
        const loadedChannels: firebase.database.DataSnapshot[] = [];
        this.state.channelsRef.on("child_added", (snap) => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, this.setFirstChannel);
        });
    };

    removeListeners = () => {
        this.state.channelsRef.off();
    };

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    setActiveChannel = (channel: Channel) => {
        this.setState({
            activeChannel: channel.id,
        });
    };

    changeChannel = (channel: Channel) => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    };

    displayChannels = () => {
        const { channels, activeChannel } = this.state;
        return (
            channels.length > 0 &&
            channels.map((channel: Channel) => (
                <Menu.Item
                    key={channel.id}
                    onClick={() => this.changeChannel(channel)}
                    name={channel.name}
                    className="channel"
                    active={channel.id === activeChannel}
                >
                    # {channel.name}
                </Menu.Item>
            ))
        );
    };

    handleModal = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleChange = (event: InputChangeEvent) => {
        const { target } = event;
        this.setState({ [target.name]: target.value });
    };

    isFormValid = () => {
        const { channelName, channelDetails } = this.state;
        return channelName.trim() && channelDetails.trim();
    };

    addChannel = async () => {
        const { channelsRef, channelName, channelDetails } = this.state;
        const { currentUser } = this.props;
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: currentUser?.uid,
        };
        if (key) {
            try {
                await channelsRef.child(key).update(newChannel);
                this.setState({ channelName: "", channelDetails: "" });
                this.handleModal();
            } catch (err) {
                console.error(err.message);
            }
        }
    };

    handleSubmit = () => {
        if (this.isFormValid()) {
            this.addChannel();
        }
    };

    render() {
        const { channels, modal, channelName, channelDetails } = this.state;
        return (
            <>
                <Menu.Menu className="channels">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>
                        ({channels.length}){" "}
                        <Icon name="add" onClick={this.handleModal} />
                    </Menu.Item>
                    {/* Channels */}
                    {this.displayChannels()}
                </Menu.Menu>

                {/* Add Channel Modal */}
                <Modal basic open={modal} onClose={this.handleModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    value={channelName}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    value={channelDetails}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="green"
                            inverted
                            onClick={this.handleSubmit}
                        >
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.handleModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </>
        );
    }
}

const mapPropsToState = (state: StoreState) => ({
    currentUser: state.user.currentUser,
});

export default connect(mapPropsToState, { setCurrentChannel })(Channels);

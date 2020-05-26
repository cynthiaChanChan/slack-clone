import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { StoreState } from "../../redux/reducers";
import { connect } from "react-redux";
import firebase from "../../firebase";
import {
    setCurrentChannel,
    setPrivateChannel,
} from "../../redux/actions/channel";

type DirectMessagesProps = {
    currentUser: firebase.User | null;
    setCurrentChannel: typeof setCurrentChannel;
    setPrivateChannel: typeof setPrivateChannel;
};

type User = {
    name: string;
    uid: string;
    status: string;
};

class DirectMessages extends React.Component<DirectMessagesProps> {
    state = {
        users: [],
        currentUser: this.props.currentUser,
        usersRef: firebase.database().ref("users"),
        connectedRef: firebase.database().ref(".info/connected"),
        presenceRef: firebase.database().ref("presence"),
    };

    addStatusToUser = (userId: string, connected = true) => {
        const updatedUsers = this.state.users.map((user: User) => {
            user.status = connect ? "online" : "offline";
            return user;
        });
        this.setState({ user: updatedUsers });
    };

    addListeners = (currentUserUid: string) => {
        const { usersRef, connectedRef, presenceRef } = this.state;
        const loadedUsers: User[] = [];

        usersRef.on("child_added", (snap) => {
            if (currentUserUid !== snap.key) {
                const user = snap.val();
                user.uid = snap.key;
                user.status = "offline";
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }
        });

        connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                const ref = presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove((err) => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
            }
        });

        presenceRef.on("child_added", (snap) => {
            if (currentUserUid !== snap.key) {
                // add status to user
                snap.key && this.addStatusToUser(snap.key);
            }
        });

        presenceRef.on("child_removed", (snap) => {
            if (currentUserUid !== snap.key) {
                // add status to user
                snap.key && this.addStatusToUser(snap.key, false);
            }
        });
    };

    componentDidMount() {
        const { currentUser } = this.state;
        if (currentUser) {
            this.addListeners(currentUser.uid);
        }
    }

    isUserOnline = (user: User) => user.status === "online";

    getChannelId = (userId: string) => {
        const currentUserUid = this.state.currentUser?.uid;
        return currentUserUid && userId < currentUserUid
            ? `${userId}/${currentUserUid}`
            : `${currentUserUid}/${userId}`;
    };

    changeChannel = (user: User) => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name,
        };
        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
    };

    render() {
        const { users } = this.state;

        return (
            <Menu.Menu className="channels direct-messages">
                <Menu.Item>
                    <span>
                        <Icon name="mail" /> DIRECT MESSAGES
                    </span>{" "}
                    ({users.length})
                </Menu.Item>
                {users.map((user: User) => (
                    <Menu.Item
                        key={user.uid}
                        className="message-user"
                        onClick={() => {
                            this.changeChannel(user);
                        }}
                    >
                        <Icon
                            name="circle"
                            color={this.isUserOnline(user) ? "green" : "red"}
                        />
                        @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        );
    }
}

const mapPropsToState = (state: StoreState) => ({
    currentUser: state.user.currentUser,
});

export default connect(mapPropsToState, {
    setCurrentChannel,
    setPrivateChannel,
})(DirectMessages);

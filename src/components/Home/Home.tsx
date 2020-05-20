import React from "react";
import { Grid } from "semantic-ui-react";

import ColorPanel from "../ColorPanel/ColorPanel";
import SidePanel from "../SidePanel/SidePanel";
import Messages from "../Messages/Messages";
import MetaPanel from "../MetaPanel/MetaPanel";
import { connect } from "react-redux";
import { Channel } from "../SidePanel/Channels";
import { StoreState } from "../../redux/reducers";

type HomeProps = {
    currentUser: firebase.User | null;
    currentChannel: Channel | null;
};

class Home extends React.Component<HomeProps> {
    render() {
        const { currentUser, currentChannel } = this.props;
        return (
            <Grid columns="equal" className="app home">
                <ColorPanel />
                <SidePanel />
                <Grid.Column className="home__messages">
                    <Messages
                        key={currentChannel?.id}
                        currentUser={currentUser}
                        currentChannel={currentChannel}
                    />
                </Grid.Column>
                <Grid.Column width={4}>
                    <MetaPanel />
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = ({ user, channel }: StoreState) => ({
    currentUser: user.currentUser,
    currentChannel: channel.currentChannel,
});

export default connect(mapStateToProps)(Home);

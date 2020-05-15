import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";

import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import { StoreState } from "../../redux/reducers";
import { userInfo } from "os";

type UserPanelProps = {
    currentUser: firebase.User | null;
};

class UserPanel extends React.Component<UserPanelProps> {
    handleSignout = async () => {
        await firebase.auth().signOut();
        console.log("signed out !");
    };
    dropdownOptions = () => [
        {
            key: "user",
            text: (
                <span>
                    Signed in as{" "}
                    <strong>{this.props.currentUser?.displayName}</strong>
                </span>
            ),
            disabled: true,
        },
        { key: "avatar", text: <span>Change Avatar</span> },
        {
            key: "signout",
            text: <span onClick={this.handleSignout}>Sign out</span>,
        },
    ];
    render() {
        const { currentUser } = this.props;
        return (
            <Grid className="user-panel">
                <Grid.Column>
                    <Grid.Row className="user-panel-row">
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>

                        {/* User Dropdown */}
                        <Header className="dropdown-title" as="h4" inverted>
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image
                                            src={currentUser?.photoURL}
                                            avatar
                                            spaced="right"
                                        />
                                        {currentUser?.displayName}
                                    </span>
                                }
                                options={this.dropdownOptions()}
                            />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = (state: StoreState) => ({
    currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(UserPanel);

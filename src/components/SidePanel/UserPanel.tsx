import React from "react";
import firebase from "../../firebase";

import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

class UserPanel extends React.Component {
    handleSignout = async () => {
        await firebase.auth().signOut();
        console.log("signed out !");
    };
    dropdownOptions = () => [
        {
            key: "user",
            text: (
                <span>
                    Signed in as <strong>User</strong>
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
        return (
            <Grid className="user-panel">
                <Grid.Column>
                    <Grid.Row className="user-panel-row">
                        {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                    </Grid.Row>

                    {/* User Dropdown */}
                    <Header className="dropdown-title" as="h4" inverted>
                        <Dropdown
                            trigger={<span>User</span>}
                            options={this.dropdownOptions()}
                        />
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;

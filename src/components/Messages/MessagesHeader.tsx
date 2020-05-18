import React from "react";
import { Segment, Header, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends React.Component {
    render() {
        return (
            <Segment clearing className="message-header">
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" className="">
                    <span>
                        Channel
                        <Icon name="star outline" color="black" />
                    </span>
                    <Header.Subheader>2 Users</Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated="right">
                    <Input
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Message"
                    />
                </Header>
            </Segment>
        );
    }
}

export default MessagesHeader;

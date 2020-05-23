import React from "react";
import { Segment, Header, Input, Icon } from "semantic-ui-react";

type MessagesHeaderProps = {
    channelName: string;
    numUniqueUsers: string;
};

class MessagesHeader extends React.Component<MessagesHeaderProps> {
    render() {
        const { channelName, numUniqueUsers } = this.props;
        return (
            <Segment clearing className="message-header">
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" className="">
                    <span>
                        {channelName}
                        <Icon name="star outline" color="black" />
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
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

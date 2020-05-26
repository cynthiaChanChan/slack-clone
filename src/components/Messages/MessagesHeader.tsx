import React from "react";
import { Segment, Header, Input, Icon } from "semantic-ui-react";
import { InputChangeEvent } from "../../type";
import { Channel } from "../SidePanel/Channels";

type MessagesHeaderProps = {
    channelName: string;
    numUniqueUsers: string;
    handleSearchChange: (event: InputChangeEvent) => void;
    searchLoading: boolean;
    isPrivateChannel: boolean | Channel;
};

class MessagesHeader extends React.Component<MessagesHeaderProps> {
    render() {
        const {
            channelName,
            numUniqueUsers,
            handleSearchChange,
            searchLoading,
            isPrivateChannel,
        } = this.props;
        return (
            <Segment clearing className="message-header">
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" className="">
                    <span>
                        {channelName}
                        {!isPrivateChannel && (
                            <Icon name="star outline" color="black" />
                        )}
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated="right">
                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
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

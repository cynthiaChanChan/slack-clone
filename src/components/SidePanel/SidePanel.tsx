import React from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";

class SidePanel extends React.Component {
    render() {
        return (
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                className="side-panel"
            >
                <UserPanel />
                <Channels />
                <DirectMessages />
            </Menu>
        );
    }
}

export default SidePanel;

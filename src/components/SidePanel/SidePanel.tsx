import React from "react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import { Menu } from "semantic-ui-react";

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
            </Menu>
        );
    }
}

export default SidePanel;

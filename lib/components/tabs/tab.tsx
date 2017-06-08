import * as React from "react";

export interface TabProps {
    name: string;
    selected?: boolean;
}

/**
 * A Tab organizes information into tabs inside a TabContainer.
 */
export default class Tab extends React.PureComponent<TabProps, undefined> {
    render() {
        if (this.props.selected) {
            return <div>{this.props.children}</div>
        } else {
            return null;
        }
    }
}
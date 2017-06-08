import * as React from "react";

export interface CollapsedProps {
    expanded?: boolean;
}

export default class Collapsed extends React.PureComponent<CollapsedProps, undefined> {
    render() {
        if (!this.props.expanded) {
            return <div className="collapsed">{this.props.children}</div>
        } else {
            return null;
        }
    }
}

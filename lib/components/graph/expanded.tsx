import * as React from "react";

export interface ExpandedProps {
    expanded?: boolean;
}

export default class Expanded extends React.PureComponent<ExpandedProps, undefined> {
    render() {
        if (this.props.expanded) {
            return <div className="expanded">{this.props.children}</div>
        } else {
            return null;
        }
    }
}

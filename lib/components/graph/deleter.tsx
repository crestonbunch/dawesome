import * as React from "react";

export interface DeleterProps {
    onDelete?: () => void;
}

export default class Deleter extends React.PureComponent<DeleterProps, undefined> {
    render() {
        return <div className="toggler" onClick={() => this.props.onDelete()}>
            {this.props.children}
        </div>
    }
}


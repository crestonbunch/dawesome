import * as React from "react";

export interface TogglerProps {
    onToggle?: () => void;
}

export default class Toggler extends React.PureComponent<TogglerProps, undefined> {
    render() {
        return <div className="toggler" onClick={() => this.props.onToggle()}>
            {this.props.children}
        </div>
    }
}

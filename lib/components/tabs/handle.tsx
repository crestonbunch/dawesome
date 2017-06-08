import * as React from "react";

export interface TabHandleProps {
    for: string;
    onClick?: () => void;
    selected?: boolean;
}

export default class Handle extends React.PureComponent<TabHandleProps, undefined> {
    render() {
        let classes = this.props.selected ? "selected" : null;

        return (
            <span onClick={(e) => this.props.onClick()} className={classes}>
                {this.props.children}
            </span>
        )
    }
}
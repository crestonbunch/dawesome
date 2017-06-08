import * as React from "react";
import "components/grid/grid.scss";

export interface ColProps {
    width: number|string;
    className?: string;
    style?: any;
}

export default class Column extends React.Component<ColProps, undefined> {
    render() {
        const classes = "column width-" + this.props.width + " " + (this.props.className || "");
        return <div className={classes} style={this.props.style}>{this.props.children}</div>;
    }
}

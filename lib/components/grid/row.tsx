import * as React from "react";
import "components/grid/grid.scss";

export interface RowProps {
    className?: string;
    style?: any;
}

export default class Row extends React.Component<RowProps, undefined> {

    render() {
        const classes = "row " + (this.props.className || "");
        return <div className={classes} style={this.props.style}>{this.props.children}</div>;
    }

}

import * as React from "react";
import * as ReactDOM from "react-dom";
import "components/presentational/grid.scss";

export interface RowProps {
    className?: string;
    style?: any;
}

export class Row extends React.Component<RowProps, undefined> {

    render() {
        const classes = "row " + (this.props.className || "");
        return <div className={classes} style={this.props.style}>{this.props.children}</div>;
    }

}

export interface ColProps {
    width: number|string;
    className?: string;
    style?: any;
}

export class Column extends React.Component<ColProps, undefined> {
    render() {
        const classes = "column width-" + this.props.width + " " + (this.props.className || "");
        return <div className={classes} style={this.props.style}>{this.props.children}</div>;
    }
}
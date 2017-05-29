import * as React from "react"

/**
 * The top-level class for tracking the current window state and propogating
 * changes to all child components. This should be the top-level component
 * in your application.
 */
export class Window extends React.Component<undefined, undefined> {

    render() {
        return <div>{this.props.children}</div>;
    }

}
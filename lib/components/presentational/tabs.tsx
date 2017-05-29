import * as React from "react";
import * as ReactDOM from "react-dom";
import "components/presentational/tabs.scss";

export class SideHandle extends React.PureComponent<undefined, undefined> {
    
    render() {
        return <div className="handle left">
            {this.props.children}
        </div>
    }

}

export class SideTab extends React.PureComponent<undefined, undefined> {
    
    render() {
        return <div className="tab left">
            {this.props.children}
        </div>
    }

}


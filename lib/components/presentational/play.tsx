import * as React from "react";
import * as ReactDOM from "react-dom";
import "components/presentational/play.scss";

export interface PlayProps {
    playing: boolean;
    size: number;
    onPlay?: () => void;
    onPause?: () => void;
}

export class Play extends React.PureComponent<PlayProps, undefined> {
    render() {
        return !this.props.playing ?
        <div className="play" onClick={(e) => this.props.onPlay()} style={{
            borderTopWidth: this.props.size / 2 + "rem",
            borderBottomWidth: this.props.size / 2 + "rem",
            borderLeftWidth: this.props.size / 2 + "rem",
        }}></div>
        :
        <div className="pause" onClick={(e) => this.props.onPause()} style={{
            width: this.props.size + "rem",
            height: this.props.size + "rem",
        }}></div>
    }
}

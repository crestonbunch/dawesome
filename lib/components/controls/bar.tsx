import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/state";
import { Play } from "components/controls/play";
import { PlayAction, PauseAction, PLAY, PAUSE } from "components/controls/actions";
import * as Grid from "components/grid";

export interface ControlsProps {
    context: AudioContext;
    playing?: boolean;
    onPlay?: (location: number) => void;
    onPause?: (location: number) => void;
}

const pause = (location: number): PauseAction => ({
    type: PAUSE,
    location: location,
});

const play = (location: number): PlayAction => ({
    type: PLAY,
    location: location,
});

const mapStore = (store: State, props: ControlsProps): ControlsProps => ({
    ...props,
    playing: store.controls.playing,
});

const mapDispatch = (dispatch: redux.Dispatch<State>, props: ControlsProps): ControlsProps => ({
    ...props,
    onPlay: (location: number) => {
        dispatch(play(location));
    },
    onPause: (location: number) => {
        dispatch(pause(location));
    },
});

@(connect(mapStore, mapDispatch) as any)
export default class Bar extends React.PureComponent<ControlsProps, undefined> {

    play() {
        this.props.onPlay(this.props.context.currentTime);
    }

    pause() {
        this.props.onPause(this.props.context.currentTime);
    }

    render() {
        return (<Grid.Row className="center middle" style={{height:"6rem"}}>
            <Grid.Column width="fit" className="pad-large">
                <Play 
                    size={3}
                    playing={this.props.playing ? this.props.playing : false} 
                    onPlay={() => this.play()}
                    onPause={() => this.pause()}
                />
            </Grid.Column>
        </Grid.Row>)
    }
}

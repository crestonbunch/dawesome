import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/store";
import { Action } from "components/interfaces";
import { Row, Column } from "components/presentational/grid";
import { Play } from "components/presentational/play";

export const PlayStore = false;

// Action type constants
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';

export interface ControlsProps {
    context: AudioContext;
    playing?: boolean;
}

export interface ControlsDispatch {
    onPlay?: (location: number) => void;
    onPause?: (location: number) => void;
}

export class ControlsBar extends React.PureComponent<ControlsProps & ControlsDispatch, undefined> {

    play() {
        this.props.onPlay(this.props.context.currentTime);
    }

    pause() {
        this.props.onPause(this.props.context.currentTime);
    }

    render() {
        return (<Row className="center" style={{height:"6rem"}}>
            <Column width="fit" className="pad-large">
                <Play 
                    size={3}
                    playing={this.props.playing ? this.props.playing : false} 
                    onPlay={() => this.play()}
                    onPause={() => this.pause()}
                />
            </Column>
        </Row>)
    }
}

export interface PlayAction extends Action {
    location: number;
}

const play = (location: number): PlayAction => ({
    type: PLAY,
    location: location,
});

export interface PauseAction extends Action {
    location: number;
}

const pause = (location: number): PauseAction => ({
    type: PAUSE,
    location: location,
});

/**
 * A reducer for handling play and pause actions.
 * 
 * @param state is an instance of PlayStore
 * @param action is an action to perform
 */
export function playReducer(state = PlayStore, action: Action): boolean {
    switch (action.type) {
        case PLAY:
            return true;
        case PAUSE:
            return false;
        default:
            return state;
    }
};

/**
 * A reducer for handling the location of the current playback.
 * 
 * @param state is a number.
 * @param action is an action to perform
 */
export function locationReducer(state = 0.0, action: Action): number {
    switch (action.type) {
        case PLAY:
            return (action as PlayAction).location;
        case PAUSE:
            return (action as PauseAction).location;
        default:
            return state;
    }
};


const mapStore = (store: State, props: ControlsProps): ControlsProps => ({
    ...props,
    playing: store.playing,
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

export const Controls: React.ComponentClass<ControlsProps> = connect(mapStore, mapDispatch)(ControlsBar);

import { combineReducers} from "redux";

import { Action } from "components/interfaces";
import { PlayAction, PauseAction, PLAY, PAUSE } from "components/controls/actions";

export interface ControlState {
    playing: boolean;
    location: number;
}

/**
 * A reducer for handling play and pause actions.
 * 
 * @param state is an instance of PlayStore
 * @param action is an action to perform
 */
function playingStore(state = false, action: Action): boolean {
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
function locationStore(state = 0.0, action: Action): number {
    switch (action.type) {
        case PLAY:
            return (action as PlayAction).location;
        case PAUSE:
            return (action as PauseAction).location;
        default:
            return state;
    }
};

const State = combineReducers<ControlState>({
    playing: playingStore,
    location: locationStore,
});

export default State;
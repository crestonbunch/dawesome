import { Action } from "components/interfaces";
import { Note } from "lib/audio/interfaces";

export const CREATE_TRACK_ACTION = "CREATE_TRACK";

export interface TrackAction extends Action {
    track: Note[];
}

export interface CreateTrackAction extends TrackAction {
    instrument: string;
}

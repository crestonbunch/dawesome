import { Note } from "lib/audio/interfaces";
import { TrackAction, CreateTrackAction, CREATE_TRACK_ACTION } from "components/track/actions";

export default function State(
    state = new Map<string, Note[]>(), action: TrackAction): Map<string, Note[]>
{
    const newState = new Map<string, Note[]>(state);
    switch (action.type) {
        case CREATE_TRACK_ACTION:
            newState.set((action as CreateTrackAction).instrument, action.track);
            return newState;
        default:
            return newState;
    }
}

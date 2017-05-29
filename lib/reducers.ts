import { combineReducers} from "redux";

import { State } from "lib/store";
import { playReducer, locationReducer } from "components/containers/controls";
import { tabsReducer } from "components/containers/tabs";
import { instrumentsReducer } from "components/containers/instrument";
import { oscillatorsReducer } from "components/containers/oscillator";
import { trackReducer } from "components/containers/track";

export const reducer = combineReducers<State>({
    playing: playReducer,
    location: locationReducer,
    tabs: tabsReducer,
    tracks: trackReducer,
    instruments: instrumentsReducer,
    oscillators: oscillatorsReducer
});
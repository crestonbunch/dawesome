import { combineReducers} from "redux";

import { State } from "lib/state";
import * as Instrument from "components/instrument";
import * as Graph from "components/graph";
import * as Tabs from "components/tabs";
import * as Controls from "components/controls";
import * as Track from "components/track";

const store = combineReducers<State>({
    controls: Controls.State,
    tabs: Tabs.State,
    graphs: Graph.State,
    instruments: Instrument.State,
    tracks: Track.State,
});

export default store;
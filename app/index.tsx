import { Provider } from "react-redux";
import { createStore } from "redux";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { reducer } from "lib/reducers";
import { State, initStore } from "lib/store";
import { AudioManager } from "lib/audio/manager";
import { Window } from "components/window";
import { Instruments } from "components/presentational/instruments";
import { Controls } from "components/containers/controls";
import "components/window.scss";

const store = createStore<State>(reducer);

// Dummy tracks until we can generate them properly
const tracks = [
    [{freq: 261.6, start: 0, end: 10.0}],
    [{freq: 440, start: 10.0, end: 20.0}],
    [{freq: 440, start: 20.0, end: 30.0}],
    [{freq: 440, start: 30.0, end: 40.0}],
    [{freq: 440, start: 40.0, end: 50.0}],
]

initStore(store, tracks);

const mgr = new AudioManager();
mgr.subscribe(store);

ReactDOM.render(
    (
        <Provider store={store}>
            <Window>
                <Controls context={mgr.context} />
                <Instruments instruments={store.getState().instruments} />
            </Window>
        </Provider>
    ), 
    document.getElementById("main")
);
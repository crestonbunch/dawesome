import { Provider } from "react-redux";
import { createStore } from "redux";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { default as Store } from "lib/store";
import { State, initStore } from "lib/state";
//import { AudioManager } from "lib/audio/manager";
import { Window } from "components/window";
import * as Instrument from "components/instrument";
import * as Controls from "components/controls";
import "components/window.scss";

const store = createStore<State>(Store);

// Dummy tracks until we can generate them properly
const tracks = [
    [{freq: 261.6, start: 0, end: 10.0}],
    [{freq: 440, start: 10.0, end: 20.0}],
    [{freq: 440, start: 20.0, end: 30.0}],
    [{freq: 440, start: 30.0, end: 40.0}],
    [{freq: 440, start: 40.0, end: 50.0}],
]

initStore(store, tracks);

//const mgr = new AudioManager();
//mgr.subscribe(store);
const ctx = new AudioContext();

ReactDOM.render(
    (
        <Provider store={store}>
            <Window>
                <Controls.Bar context={ctx} />
                <Instrument.Container />
            </Window>
        </Provider>
    ), 
    document.getElementById("main")
);
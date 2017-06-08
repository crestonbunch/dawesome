import * as redux from "redux";

import * as actions from "components/instrument/actions";

export interface InstrumentState {
    name: string;
    input: string;
    output: string;
    oscillators?: Map<string, Map<number, number>>;
    gains?: Map<string, number>;
}

function inputReducer(state = "", action: actions.CreateInstrumentAction): string {
    return action.input || state;
}

function outputReducer(state = "", action: actions.CreateInstrumentAction): string {
    return action.output || state;
}

function oscillatorsReducer(
    state = new Map<string, Map<number, number>>(), action: actions.ChangeOscillatorAction
): Map<string, Map<number, number>> {
    const newState = new Map<string, Map<number, number>>(state);
    switch (action.type) {
        case actions.CHANGE_OSCILLATOR_ACTION:
            const partials = new Map<number, number>(state.get(action.id));
            partials.set(action.freq, action.amp);
            newState.set(action.id, partials);
            return newState;
        default:
            return newState;
    }
}

function gainsReducer(
    state = new Map<string, number>(), action: actions.ChangeGainAction
): Map<string, number> {
    const newState = new Map<string, number>(state);
    switch (action.type) {
        case actions.CHANGE_GAIN_ACTION:
            newState.set(action.id, action.val);
            return newState;
        default:
            return newState;
    }
}

function numbersReducer(
    state = new Map<string, number>(), action: actions.ChangeNumberAction
): Map<string, number> {
    const newState = new Map<string, number>(state);
    switch (action.type) {
        case actions.CHANGE_NUMBER_ACTION:
            newState.set(action.id, action.val);
            return newState;
        default:
            return newState;
    }
}

export const instrumentReducer = redux.combineReducers<InstrumentState>({
    input: inputReducer,
    output: outputReducer,
    oscillators: oscillatorsReducer,
    gains: gainsReducer,
    numbers: numbersReducer,
});


export default function instrumentStore(
    state = new Map<string, InstrumentState>(), action: actions.InstrumentAction): Map<string, InstrumentState>
{
    const newState = new Map<string, InstrumentState>(state);
    switch (action.type) {
        case actions.CREATE_INST_ACTION:
            newState.set(action.instrument, instrumentReducer(undefined, action));
            return newState;
        default:
            state.forEach((store, inst) => {
                if (action.instrument == inst) {
                    newState.set(inst, instrumentReducer(store, action));
                }
            });
            return newState;
    }
}

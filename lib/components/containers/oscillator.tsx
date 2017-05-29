import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/store";
import { Synth } from "lib/audio/synth";
import { Action } from "components/interfaces";
import { Tabs, Tab, TabHandle } from "components/containers/tabs";
import { Row, Column } from "components/presentational/grid";
import { Shaper } from "components/presentational/shaper";
import { SideHandle, SideTab } from "components/presentational/tabs";

export const CREATE_OSC_ACTION = "CREATE_OSC";
export const UPDATE_PARTIAL_ACTION = "UPDATE_PARTIAL";

export interface OscillatorStore {
    partials: Map<number, number>;
}

export interface OscillatorProps {
    name: string;
    partials?: Map<number, number>;
    amFreq?: number;
    fmFreq?: number;
    am?: Map<number, number>;
    fm?: Map<number, number>;
}

export interface OscillatorDispatch {
    onPartialChange?: (partial: number, val: number) => void;
    onAmChange?: (partial: number, val: number, freq: number) => void;
    onFmChange?: (partial: number, val: number, freq: number) => void;
}

export class Oscillator extends React.Component<OscillatorProps & OscillatorDispatch, undefined> {

    constructor(props: OscillatorProps & OscillatorDispatch) {
        super(props);
    }

    render() {
        
        return <Tabs name={this.props.name} default="osc">
            <Row>
            <Column width="fit">
                <SideHandle><TabHandle for="osc">Osc</TabHandle></SideHandle>
                <SideHandle><TabHandle for="am">AM</TabHandle></SideHandle>
                <SideHandle><TabHandle for="fm">FM</TabHandle></SideHandle>
            </Column>
            <Column width="fit">
                <SideTab>
                <Tab name="osc">
                    <Shaper 
                        partials={this.props.partials}
                        onChange={(freq, amp) => this.props.onPartialChange(freq, amp)}
                    />
                </Tab>
                <Tab name="am">
                        <Shaper 
                            partials={this.props.am}
                            onChange={(freq, amp) => null}
                        />
                </Tab>
                <Tab name="fm">
                    <Shaper 
                        partials={this.props.fm}
                        onChange={(freq, amp) => null}
                    />
                </Tab>
                </SideTab>
            </Column>
            </Row>
        </Tabs>
    }
}

export interface OscillatorAction extends Action {
    osc: string;
}

export interface CreateOscillatorAction extends OscillatorAction {
}

export interface UpdatePartialAction extends OscillatorAction {
    freq: number;
    amp: number;
}

const updatePartial = (osc: string, freq: number, amp: number): UpdatePartialAction => ({
    type: UPDATE_PARTIAL_ACTION,
    osc: osc,
    freq: freq,
    amp: amp,
});

function partialsReducer(state = new Map<number, number>(), action: UpdatePartialAction): Map<number, number> {
    switch (action.type) {
        case UPDATE_PARTIAL_ACTION:
            const newState = new Map<number, number>(state);
            newState.set(action.freq, action.amp);
            return newState;
        default:
            return state;
    }
}

const oscillatorReducer = redux.combineReducers<OscillatorStore>({
    partials: partialsReducer,
});

export function oscillatorsReducer(
    state = new Map<string, OscillatorStore>(), action: OscillatorAction
): Map<string, OscillatorStore> {
    const newState = new Map<string, OscillatorStore>(state);
    switch (action.type) {
        case CREATE_OSC_ACTION:
            newState.set(action.osc, oscillatorReducer(undefined, action));
            return newState;
        default: 
            state.forEach((store, osc) => {
                if (action.osc === osc) {
                    newState.set(osc, oscillatorReducer(store, action));
                }
            });
            return newState;
    }
}

const mapStore = (store: State, props: OscillatorProps): OscillatorProps => ({
    ...props,
    ...(store.oscillators.get(props.name) || {})
});

const mapDispatch = (dispatch: redux.Dispatch<State>, props: OscillatorProps): OscillatorProps => ({
    ...props,
    onPartialChange: (freq: number, amp: number) => {
        dispatch(updatePartial(props.name, freq, amp));
    }
});

export const InstrumentOscillator: React.ComponentClass<OscillatorProps> = connect(mapStore, mapDispatch)(Oscillator);

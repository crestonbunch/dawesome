import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/store";
import { Action } from "components/interfaces";
import { Row, Column } from "components/presentational/grid";
import { Oscillators } from "components/presentational/oscillators";
import { Knob, Knobs } from "components/presentational/knob";
import { Slider } from "components/presentational/slider";

export const CREATE_INST_ACTION = "CREATE_INST";
export const UPDATE_MIX_ACTION = "UPDATE_MIX";
export const UPDATE_GAIN_ACTION = "UPDATE_GAIN";
export const UPDATE_ASDR_ACTION = "UPDATE_ASDR";

export interface InstrumentStore {
    oscillators: string[];
    effects: string[];
    mixes: Map<string, number[]>;
    gains: Map<string, number>;
    attack: number;
    sustain: number;
    decay: number;
    release: number;
}

/**
 * Properties of the instrument to be presented. Changes are synced with the
 * application state via Redux.
 */
export interface InstrumentProps {
    // A unique name for this instrument.
    name: string;
    
    oscillators?: string[];
    effects?: string[];
    mixes?: Map<string, number[]>;
    gains?: Map<string, number>;
    attack?: number;
    sustain?: number;
    decay?: number;
    release?: number;
}

export interface InstrumentDispatch {
    onMixChange?: (osc: string, value: number[]) => void;
    onGainChange?: (osc: string, value: number) => void;
    onAttackChange?: (value: number) => void;
    onSustainChange?: (value: number) => void;
    onDecayChange?: (value: number) => void;
    onReleaseChange?: (value: number) => void;
}

export class InstrumentControls extends React.PureComponent<InstrumentProps & InstrumentDispatch, undefined> {

    constructor(props: InstrumentProps & InstrumentDispatch) {
        super(props);
    }

    setMix(osc: string, vals: number[]) {
        this.props.onMixChange(osc, vals);
    }

    setGain(osc: string, val: number) {
        this.props.onGainChange(osc, val);
    }

    setAttack(val: number) {
        this.props.onAttackChange(val);
    }
    setSustain(val: number) {
        this.props.onSustainChange(val);
    }
    setDecay(val: number) {
        this.props.onDecayChange(val);
    }
    setRelease(val: number) {
        this.props.onReleaseChange(val);
    }

    render() {
        const mixKnobs: any = [];
        const gainKnobs: any = [];
        const asdrSliders: any = [];
    
        const oscillators = this.props.oscillators || [];

        for (let i = 0; i < oscillators.length; i++) {
            const knob = <Knobs 
                key={i}
                val={this.props.mixes.get(oscillators[i])}
                num={oscillators.length} 
                onChange={(val) => this.setMix(oscillators[i], val)} 
                knobClass="blue"
            />
            mixKnobs.push(knob);
        }
        for (let i = 0; i < oscillators.length; i++) {
            const knob = <Knob 
                key={i} 
                val={this.props.gains.get(oscillators[i])}
                onChange={(val) => this.setGain(oscillators[i], val)} 
                className="orange"
            />
            gainKnobs.push(<div key={i}>{knob}</div>);
        }
        asdrSliders.push(
            <div key="A">
                <span className="label">A</span>
                <Slider onChange={(val) => this.setAttack(val)} val={this.props.attack} size={200} />
            </div>
        );
        asdrSliders.push(
            <div key="S">
                <span className="label">S</span>
                <Slider onChange={(val) => this.setSustain(val)} val={this.props.sustain} size={200} />
            </div>
        );
        asdrSliders.push(
            <div key="D">
                <span className="label">D</span>
                <Slider onChange={(val) => this.setDecay(val)} val={this.props.decay} size={200} />
            </div>
        );
        asdrSliders.push(
            <div key="R">
                <span className="label">R</span>
                <Slider onChange={(val) => this.setRelease(val)} val={this.props.release} size={200} />
            </div>
        );
 
        return <div>
            <Row className="middle">
                <Column width="fit">
                    {mixKnobs.length ? mixKnobs : null}
                </Column>
                <Column width="fit">
                    {gainKnobs.length ? gainKnobs : null}
                </Column>
                <Column width={3} className="pad-large">
                    {asdrSliders.length ? asdrSliders : null}
                </Column>
            </Row>
            <Oscillators 
                name={this.props.name + "_osc"} 
                oscillators={this.props.oscillators}
            />
        </div>
    }
}

export interface InstrumentAction extends Action {
    instrument: string;
}

export interface CreateInstrumentAction extends InstrumentAction {
    oscillators: string[];
}

export interface MixAction extends InstrumentAction {
    osc: string;
    val: number[];
}

export interface GainAction extends InstrumentAction {
    osc: string;
    val: number;
}

export interface GainAction extends InstrumentAction {
    osc: string;
    val: number;
}

export interface AsdrAction extends InstrumentAction {
    asdr: "A"|"S"|"D"|"R";
    val: number;
}

const updateMix = (instrument: string, osc: string, val: number[]): MixAction => ({
    type: UPDATE_MIX_ACTION,
    instrument: instrument,
    osc: osc,
    val: val,
});

const updateGain = (instrument: string, osc: string, val: number): GainAction => ({
    type: UPDATE_GAIN_ACTION,
    instrument: instrument,
    osc: osc,
    val: val,
});

const updateAsdr = (instrument: string, asdr: "A"|"S"|"D"|"R", val: number): AsdrAction => ({
    type: UPDATE_ASDR_ACTION,
    instrument: instrument,
    asdr: asdr,
    val: val
});

function oscReducer(state: string[] = [] , action: CreateInstrumentAction): string[] {
    switch (action.type) {
        case CREATE_INST_ACTION:
            return action.oscillators;
        default:
            return state;
    }
}

function mixesReducer(state = new Map<string, number[]>(), action: MixAction): Map<string, number[]> {
    switch (action.type) {
        case UPDATE_MIX_ACTION:
            const newState = new Map<string, number[]>(state);
            newState.set(action.osc, action.val);
            return newState;
        default:
            return state;
    }
}

function gainsReducer(state = new Map<string, number>(), action: GainAction): Map<string, number> {
    switch (action.type) {
        case UPDATE_GAIN_ACTION:
            const newState = new Map<string, number>(state);
            newState.set(action.osc, action.val);
            return newState;
        default:
            return state;
    }
}

function attackReducer(state = 0.0, action: AsdrAction): number {
    switch (action.type) {
        case UPDATE_ASDR_ACTION:
            if (action.asdr == "A") {
                return action.val;
            }
        default:
            return state;
    }
}

function sustainReducer(state = 0.0, action: AsdrAction): number {
    switch (action.type) {
        case UPDATE_ASDR_ACTION:
            if (action.asdr == "S") {
                return action.val;
            }
        default:
            return state;
    }
}

function decayReducer(state = 0.0, action: AsdrAction): number {
    switch (action.type) {
        case UPDATE_ASDR_ACTION:
            if (action.asdr == "D") {
                return action.val;
            }
        default:
            return state;
    }
}

function releaseReducer(state = 0.0, action: AsdrAction): number {
    switch (action.type) {
        case UPDATE_ASDR_ACTION:
            if (action.asdr == "R") {
                return action.val;
            }
        default:
            return state;
    }
}

export const instrumentReducer = redux.combineReducers<InstrumentStore>({
    oscillators: oscReducer,
    mixes: mixesReducer,
    gains: gainsReducer,
    attack: attackReducer,
    sustain: sustainReducer,
    decay: decayReducer,
    release: releaseReducer,
});

export function instrumentsReducer(
    state = new Map<string, InstrumentStore>(), action: InstrumentAction): Map<string, InstrumentStore>
{
    const newState = new Map<string, InstrumentStore>(state);
    switch (action.type) {
        case CREATE_INST_ACTION:
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

const mapStore = (store: State, props: InstrumentProps): InstrumentProps => {
    return {
        ...props,
        ...(store.instruments.get(props.name) || {})
    }
}

const mapDispatch = (dispatch: redux.Dispatch<State>, props: InstrumentProps): InstrumentProps => ({
    ...props,
    onMixChange: (osc: string, value: number[]) => {
        dispatch(updateMix(props.name, osc, value));
    },
    onGainChange: (osc: string, value: number) => {
        dispatch(updateGain(props.name, osc, value));
    },
    onAttackChange: (value: number) => {
        dispatch(updateAsdr(props.name, "A", value));
    },
    onSustainChange: (value: number) => {
        dispatch(updateAsdr(props.name, "S", value));
    },
    onDecayChange: (value: number) => {
        dispatch(updateAsdr(props.name, "D", value));
    },
    onReleaseChange: (value: number) => {
        dispatch(updateAsdr(props.name, "R", value));
    }
});

export const Instrument: React.ComponentClass<InstrumentProps> = connect(mapStore, mapDispatch)(InstrumentControls);

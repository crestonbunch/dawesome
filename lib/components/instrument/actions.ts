import { Action } from "components/interfaces";
import { InstrumentState } from "components/instrument/state";

export const CREATE_INST_ACTION = "CREATE_INST";
export const CHANGE_OSCILLATOR_ACTION = "CHANGE_OSCILLATOR";
export const CHANGE_GAIN_ACTION = "CHANGE_GAIN";
export const CHANGE_NUMBER_ACTION = "CHANGE_NUMBER";

export interface InstrumentAction extends Action {
    instrument: string;
}

export interface CreateInstrumentAction extends InstrumentAction {
    input: string;
    output: string;
}

export interface ChangeOscillatorAction extends InstrumentAction {
    id: string;
    freq: number;
    amp: number;
}

export interface ChangeGainAction extends InstrumentAction {
    id: string;
    val: number;
}

export interface ChangeNumberAction extends InstrumentAction {
    id: string;
    val: number;
}

export const changeOscillator = (inst: string, id: string, freq: number, amp: number): ChangeOscillatorAction => ({
    type: CHANGE_OSCILLATOR_ACTION,
    instrument: inst,
    id: id,
    freq: freq,
    amp: amp,
});

export const changeGain = (inst: string, id: string, val: number): ChangeGainAction => ({
    type: CHANGE_GAIN_ACTION,
    instrument: inst,
    id: id,
    val: val,
});

export const changeNumber = (inst: string, id: string, val: number): ChangeNumberAction => ({
    type: CHANGE_NUMBER_ACTION,
    instrument: inst,
    id: id,
    val: val,
});


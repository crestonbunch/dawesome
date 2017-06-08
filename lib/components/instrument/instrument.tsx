import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { connect } from "react-redux";
import "components/instrument/instrument.scss";

import { State } from "lib/state";
import { Shaper, Knob, Waveform } from "components/inputs";
import { changeOscillator, changeGain, changeNumber } from "components/instrument/actions";
import * as Graph from "components/graph";

export interface InstrumentProps {
    name: string;
    input?: string;
    output?: string;
    oscillators?: Map<string, Map<number, number>>;
    gains?: Map<string, number>;
    numbers?: Map<string, number>;
    changeOscillator?: (id: string, freq: number, amp: number) => void;
    changeGain?: (id: string, val: number) => void;
    changeNumber?: (id: string, val: number) => void;
}

const mapStore = (store: State, props: InstrumentProps): InstrumentProps => {
    return {
        ...props,
        ...store.instruments.get(props.name),
    }
}

const mapDispatch = (dispatch: redux.Dispatch<State>, props: InstrumentProps): InstrumentProps => ({
    ...props,
    changeOscillator: (id, freq, amp) => dispatch(changeOscillator(props.name, id, freq, amp)),
    changeGain: (id, val) => dispatch(changeGain(props.name, id, val)),
    changeNumber: (id, val) => dispatch(changeNumber(props.name, id, val)),
});

@(connect(mapStore, mapDispatch) as any)
export default class Instrument extends React.PureComponent<InstrumentProps, undefined> {

    constructor(props: InstrumentProps) {
        super(props);
    }

    private createOscillator(id: string) {
        this.props.changeOscillator(id, 0, 0);
    }

    private createGain(id: string) {
        this.props.changeGain(id, 1.0);
    }

    private createNumber(id: string) {
        this.props.changeNumber(id, 0.0);
    }

    private buildNode(id: string): React.ReactElement<any> {
        if (this.props.oscillators.has(id)) {
            return this.buildOscillator(id);
        } else if (this.props.gains.has(id)) {
            return this.buildGain(id);
        } else if (this.props.numbers.has(id)) {
            return this.buildNumber(id);
        } else if (this.props.input == id) {
            return this.buildInput(id);
        } else if (this.props.output == id) {
            return this.buildOutput(id);
        }
    }

    private buildOscillator(id: string): React.ReactElement<HTMLDivElement> {
        const partials = this.props.oscillators.get(id);
        const onChange = (freq: number, amp: number) => {
            this.props.changeOscillator(id, freq, amp);
        }
        return <div>
            <Graph.Anchor direction="in" for={id} position="middle" id={id+"_in"} param="in" color="blue" />
            <Graph.Anchor direction="out" for={id} position="middle" id={id+"_out"} param="out" color="blue" />
            <Graph.Collapsed>
                <div className="ribbon">
                    <Graph.Dragger><i className="icon-sound-mix" /></Graph.Dragger>
                    <div className="right">
                        <Graph.Toggler><i className="icon-chevron-left" /></Graph.Toggler>
                        <Graph.Deleter><i className="icon-cross" /></Graph.Deleter>
                    </div>
                </div>
                <div className="content">
                    <Waveform freq={50} 
                            partials={partials} 
                            height={50}
                            color="red"
                            size={3}
                    />
                </div>
            </Graph.Collapsed>
            <Graph.Expanded>
                <div className="ribbon">
                    <Graph.Dragger><i className="icon-sound-mix" /></Graph.Dragger>
                    <div className="right">
                        <Graph.Toggler><i className="icon-chevron-down" /></Graph.Toggler>
                        <Graph.Deleter><i className="icon-cross" /></Graph.Deleter>
                    </div>
                </div>
                <div className="content">
                    <Shaper partials={partials} onChange={onChange} />
                </div>
            </Graph.Expanded>
        </div>
    }

    private buildGain(id: string): React.ReactElement<HTMLDivElement> {
        const val = this.props.gains.get(id);
        const onChange = (val: number) => {
            this.props.changeGain(id, val);
        }
        return <div>
            <Graph.Anchor direction="in" for={id} position="top" id={id+"_in"} param="in" color="blue" />
            <Graph.Anchor direction="in" for={id} position="bottom" id={id+"_gain"} param="gain" color="red" />
            <Graph.Anchor direction="out" for={id} position="middle" id={id+"_out"} param="out" color="blue" />
            <div className="ribbon">
                <Graph.Dragger><i className="icon-gauge" /></Graph.Dragger>
                <Graph.Deleter><i className="icon-cross" /></Graph.Deleter>
            </div>
        </div>
    }

    private buildNumber(id: string): React.ReactElement<HTMLDivElement> {
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.props.changeNumber(id, parseFloat(e.target.value) || 0.0);
        }
        return <div>
            <Graph.Anchor direction="out" for={id} position="middle" id={id+"_out"} param="out" color="red" />
            <div className="ribbon">
                <Graph.Dragger><i className="icon-dial-pad" /></Graph.Dragger>
            </div>
            <input className="number" type="number" value={this.props.numbers.get(id)} onChange={onChange} />
        </div>
    }

    private buildInput(id: string): React.ReactElement<HTMLDivElement> {
        return <div>
            <Graph.Anchor direction="out" for={id} position="middle" id={id+"_out"} param="out" color="blue" />
            <div className="ribbon">
                <Graph.Dragger><i className="icon-beamed-note" /></Graph.Dragger>
            </div>
        </div>
    }

    private buildOutput(id: string): React.ReactElement<HTMLDivElement> {
        return <div>
            <Graph.Anchor direction="in" for={id} position="middle" id={id+"_in"} param="in" color="blue" />
            <div className="ribbon">
                <Graph.Dragger><i className="icon-controller-play" /></Graph.Dragger>
            </div>
        </div>
    }

    render() {
        return <div className="instrument">
            <div className="toolbar">
                <Graph.Spawner onCreate={(id) => this.createOscillator(id)}>
                    <i className="icon-sound-mix" />
                </Graph.Spawner>
                <Graph.Spawner onCreate={(id) => this.createGain(id)}>
                    <i className="icon-gauge" />
                </Graph.Spawner>
                <Graph.Spawner onCreate={(id) => this.createNumber(id)}>
                    <i className="icon-dial-pad" />
                </Graph.Spawner>
            </div>
            <Graph.Graph name={this.props.name} buildNode={(id) => this.buildNode(id)} />
        </div>
    }
}


import * as React from "react";
import * as ReactDOM from "react-dom";
import * as d3 from "d3";
import "components/inputs/shaper.scss";

import { default as Waveform } from "components/inputs/waveform";
import { Slider } from "components/inputs";
import * as Grid from "components/grid";

export interface ShaperProps {
    partials?: Map<number, number>;
    onChange?: (freq: number, amp: number) => void;
}

/**
 * A shaper allows you to generate a waveform of arbitrary shape by manipulating
 * harmonic partials.
 */
export default class Shaper extends React.PureComponent<ShaperProps, undefined> {

    public readonly NUM_PARTIALS = 30;
    public readonly PARTIAL_STEP = 1.0;
    
    render() {
        const partials = this.props.partials || new Map<number, number>();
        const sliders: any = [];
        for (let i = 0; i < this.NUM_PARTIALS; i++) {
            const freq = i * this.PARTIAL_STEP;
            const amp = partials.get(freq) || 0.0;
            sliders.push(
                <div key={i} style={{display: 'inline-block'}}>
                    <Slider 
                    vertical 
                    size={200}
                    min={-1.0}
                    max={1.0}
                    val={amp}
                    onChange={(val) => this.props.onChange(freq, val)}
                    />
                </div>
             )
        }

        return <Grid.Row>
            <Grid.Column width="fit">
                <div style={{position: 'relative'}}>
                    <Waveform 
                        freq={50} 
                        partials={partials} 
                        height={200}
                        color="red"
                        size={5}
                        style={{position: "absolute", top: 0, left: 0, zIndex: 0}} 
                    />
                </div>
                <div>
                    {sliders}
                </div>
            </Grid.Column>
        </Grid.Row>
    }
}



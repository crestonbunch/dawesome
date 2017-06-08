import * as React from "react";
import { Knob } from "components/inputs";

export class KnobsProps {
    num: number;
    val: number[];
    knobClass?: string;
    onChange?: (vals: number[]) => void;
}

/**
 * Knobs is a container for multiple knobs.
 */
export default class Knobs extends React.PureComponent<KnobsProps, undefined> {

    private startX: number;
    private startY: number;
    private startVal: number;
    private dragging: boolean;

    constructor(props: KnobsProps) {
        super(props);
    }

    render() {
        const knobs: any = [];
        const vals = this.props.val || Array
            .apply(null, Array(this.props.num))
            .map(Number.prototype.valueOf,0);

        for (let i = 0; i < this.props.num; i++) {
            const knob = <Knob 
                key={i}
                val={vals[i]} 
                className={this.props.knobClass}
                onChange={(val) => {vals[i] = val; this.props.onChange(vals)}}
            />
            knobs.push(knob);
        }
        return <div>{knobs}</div>
    }
}
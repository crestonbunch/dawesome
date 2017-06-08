import * as React from "react";
import "components/inputs/knob.scss";

/**
 * Knobs hold a numeric value from 0.0 to 1.0, and can issue a callback when
 * the value is changed.
 */
export interface KnobProps {
    val: number;
    onChange?: (val: number) => void;
    className?: string;
}

const MIN_ANGLE = 10;
const MAX_ANGLE = 350;
const TOTAL_ANGLE = MAX_ANGLE - MIN_ANGLE;
const MAX_DRAG = 200;

export default class Knob extends React.PureComponent<KnobProps, undefined> {

    private startX: number;
    private startY: number;
    private startVal: number;
    private dragging: boolean;

    constructor(props: KnobProps) {
        super(props);
        document.addEventListener("mouseup", (e) => {
            this.dragging = false;
        });
        document.addEventListener("mousemove", (e) => {
            if (!this.dragging) { return; }
            e.preventDefault();
            const x = e.screenX;
            const y = e.screenY;

            const dx = this.startX - x;
            const dy = this.startY - y;

            const clipped = Math.min(Math.max(this.startVal + dy, 0), MAX_DRAG);

            // Compute a new value from the angle
            const val = clipped / MAX_DRAG;

            this.props.onChange(val);
        });
    }

    startDrag(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        this.startX = e.screenX;
        this.startY = e.screenY;
        this.dragging = true;
        this.startVal = this.props.val * MAX_DRAG || 0.0;
    }
    
    render() {
        const classes = "knob " + (this.props.className ? this.props.className : "");
        const rotation = this.props.val ? this.props.val * TOTAL_ANGLE + MIN_ANGLE: MIN_ANGLE;
        const transform = 'rotate(' + String(rotation) + 'deg)';
        return <div
            onMouseDown={(e) => this.startDrag(e)} 
            className={classes} 
            style={{'transform': transform}}>
        </div>
    }

}

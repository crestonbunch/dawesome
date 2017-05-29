import * as React from "react";
import * as ReactDOM from "react-dom";
import "components/presentational/slider.scss";

/**
 * Sliders hold a numeric value from 0.0 to 1.0, and can issue a callback when
 * the value is changed.
 */
export interface SliderProps {
    val: number;
    size: number;
    min?: number;
    max?: number;
    vertical?: boolean;
    onChange?: (val: number) => void;
    className?: string;
}

export class Slider extends React.PureComponent<SliderProps, undefined> {

    private dragging: boolean;
    private target: HTMLDivElement;

    constructor(props: SliderProps) {
        super(props);
        document.addEventListener("mouseup", (e) => {this.doDrag(e); this.dragging = false;});
        document.addEventListener("mousemove", (e) => {this.doDrag(e);});
    }

    doDrag(e: MouseEvent) {
        if (!this.dragging) { return; }
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        const left = this.target.offsetLeft;
        const bottom = this.target.offsetTop + this.props.size;

        const raw = this.props.vertical ? bottom - y: x - left;
        const clipped = Math.min(Math.max(raw, 0), this.props.size);

        const val = clipped / this.props.size;

        this.props.onChange(this.scale(val));
    }

    reset() {
        this.props.onChange(0.0);
    }

    /**
     * Scales val between 0.0 and 1.0
     * 
     * @param val A number in the range [this.min, this.max]
     */
    normalize(val: number) {
        const range = (this.props.max - this.props.min) || 1.0;
        const test = (val - this.props.min) / range;
        return test;
    }

    /**
     * Scales val to between this.min and this.max
     * 
     * @param val A number in the range [0, 1]
     */
    scale(val: number) {
        const range = (this.props.max - this.props.min) || 1.0;
        return (val * range) + this.props.min;
    }

    startDrag(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        if (e.button == 0) {
            this.dragging = true;
            this.target = e.currentTarget;
        } else if (e.button == 2) {
            this.reset();
        }
    }
    
    render() {
        const classes = "slider " + 
            (this.props.vertical ? "vertical " : "horizontal ") + 
            (this.props.className ? this.props.className : "");
        return <div
            onMouseDown={(e) => this.startDrag(e)} 
            onContextMenu={(e) => {e.preventDefault(); e.stopPropagation(); return false;}}
            className={classes}
            style={this.props.vertical ? {height: this.props.size + 'px'} : {width: this.props.size + 'px'}}
        >
            {this.props.vertical ?
                <div className="mark" style={{
                    top: (this.props.size - this.normalize(this.props.val) * this.props.size) + 'px'
                }}></div>
            :
                <div className="mark" style={{
                    left: (this.normalize(this.props.val) * this.props.size) + 'px'
                }}></div>}
            <div className="bar"></div>
        </div>
    }

}

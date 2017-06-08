import * as React from "react";

export interface DraggerProps {
    onDrag?: (x: number, y: number) => void;
}

export default class Dragger extends React.PureComponent<DraggerProps, undefined> {

    private dragging: boolean = false;
    private offsetX: number;
    private offsetY: number;

    componentDidMount() {
        addEventListener("mousemove", (e) => {
            if (this.dragging) {
                this.onDrag(e);
            }
        });
        addEventListener("mouseup", (e) => {
            if (this.dragging) {
                this.onDrag(e);
                this.dragging = false;
            }
        });
    }

    private onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        const box = e.currentTarget.getBoundingClientRect()
        this.offsetX = e.pageX - box.left;
        this.offsetY = e.pageY - box.top;
        this.dragging = true;
    }

    private onDrag(e: MouseEvent) {
        e.preventDefault();
        const x = e.pageX - this.offsetX;
        const y = e.pageY - this.offsetY;
        this.props.onDrag(x, y);
    }

    render() {
        return <div 
            className="dragger" 
            onMouseDown={(e) => this.onMouseDown(e)}
        >
            {this.props.children}
        </div>
    }
}

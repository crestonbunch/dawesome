import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/state";

export interface SpawnerProps {
    onCreate: (id: string) => void;
}

const mapStore = (store: State, props: SpawnerProps): SpawnerProps => {
    return {
        ...props,
    }
}

const mapDispatch = (dispatch: redux.Dispatch<State>, props: SpawnerProps): SpawnerProps => ({
    ...props,
});

@(connect(mapStore, mapDispatch) as any)
export default class Spawner extends React.PureComponent<SpawnerProps, undefined> {

    private id: string;

    private startDrag(e: React.DragEvent<HTMLDivElement>) {
        this.id = Date.now().toString();
        e.dataTransfer.setData("text/id+node", this.id);
        e.dataTransfer.dropEffect = 'copy';
    }

    private endDrag(e: React.DragEvent<HTMLDivElement>) {
        if (e.dataTransfer.dropEffect === 'none') { return; }
        this.props.onCreate(this.id);
    }

    render() {
        return <div 
            className="spawner"
            draggable={true} 
            onDragStart={(e) => this.startDrag(e)}
            onDragEnd={(e) => this.endDrag(e)}
        >{this.props.children}</div>
    }
}




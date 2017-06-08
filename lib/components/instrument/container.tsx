import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { connect } from "react-redux";
import "components/instrument/container.scss";

import { State } from "lib/state";
import { InstrumentState } from "components/instrument/state";
import { default as Instrument } from "components/instrument/instrument";
import * as Grid from "components/grid"; 
import * as Tabs from "components/tabs";

export interface ContainerProps {
    instruments?: Map<string, InstrumentState>;
}

const mapStore = (store: State, props: ContainerProps): ContainerProps => {
    return {
        ...props,
        instruments: store.instruments,
    }
}

const mapDispatch = (dispatch: redux.Dispatch<State>, props: ContainerProps): ContainerProps => ({
    ...props,
});

@(connect(mapStore, mapDispatch) as any)
export default class Container extends React.Component<ContainerProps, undefined> {

    render() {
        const handles: any = [];
        const pages: any = [];
        const instruments = this.props.instruments;
        let i = 0;
        instruments.forEach((inst, name) => {
            handles.push(
                <Grid.Column width={3} className="handle" key={name}>
                    <Tabs.Handle for={name}>Instrument {i + 1}</Tabs.Handle>
                </Grid.Column>
            )
            pages.push(
                <Tabs.Tab name={name} key={name}>
                    <Grid.Row className="instruments tab page">
                        <Grid.Column width={16} className="page">
                            <Instrument name={name} />
                        </Grid.Column>
                    </Grid.Row>
                </Tabs.Tab>
            )
            i++;
        });
        const def = "inst0";
        const name = "instruments";

        return <div>
            <Tabs.Container name={name} default={def}>
                <Grid.Row className="instruments tab handles">
                    {handles}
                </Grid.Row>
                {pages}
            </Tabs.Container>
        </div>

    }
}

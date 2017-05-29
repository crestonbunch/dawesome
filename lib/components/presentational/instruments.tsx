import * as React from "react";
import * as ReactDOM from "react-dom";
import "components/presentational/instruments.scss";

import { Store } from "lib/store"; 
import { Row, Column } from "components/presentational/grid"; 
import { Knob } from "components/presentational/knob";
import { Tabs, TabHandle, Tab } from "components/containers/tabs";
import { Instrument, InstrumentStore } from "components/containers/instrument";
import { Note } from "lib/audio/interfaces";

export interface InstrumentsProps {
    instruments: Map<string, InstrumentStore>;
}

export class Instruments extends React.Component<InstrumentsProps, undefined> {

    render() {
        const handles: any = [];
        const pages: any = [];
        const instruments = this.props.instruments;
        let i = 0;
        instruments.forEach((inst, name) => {
            handles.push(
                <Column width={3} className="handle" key={name}>
                    <TabHandle for={name}>Instrument {i + 1}</TabHandle>
                </Column>
            )
            pages.push(
                <Tab name={name} key={name}>
                    <Row className="instruments tab page">
                        <Column width={16} className="page">
                            <Instrument name={name} />
                        </Column>
                    </Row>
                </Tab>
            )
            i++;
        });
        const def = "inst0";
        const name = "instruments";

        return <div>
            <Tabs name={name} default={def}>
                <Row className="instruments tab handles">
                    {handles}
                </Row>
                {pages}
            </Tabs>
        </div>

    }
}

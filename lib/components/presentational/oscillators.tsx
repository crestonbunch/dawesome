import * as React from "react";
import * as ReactDOM from "react-dom";
import "components/presentational/oscillators.scss";

import { Synth } from "lib/audio/synth";
import { Row, Column } from "components/presentational/grid";
import { Tabs, TabHandle, Tab } from "components/containers/tabs";
import { InstrumentOscillator } from "components/containers/oscillator";

export interface OscillatorsProps {
    name: string;
    oscillators: string[];
}

export class Oscillators extends React.PureComponent<OscillatorsProps, undefined> {

    render() {
        const handles: any = [];
        const pages: any = [];
        const oscillators = this.props.oscillators || [];
        let selected: string;
        oscillators.forEach((name, i) => {
            if (i == 0) { selected = name };
            handles.push(
                <Column width={2} className="handle" key={name}>
                    <TabHandle for={name}>
                        Osc {i + 1}
                    </TabHandle>
                </Column>
            );
            pages.push(
                <Tab name={name} key={name}>
                    <Row className="oscillator tab page">
                        <Column width={16} className="page">
                            <InstrumentOscillator name={name} />
                        </Column>
                    </Row>
                </Tab>
            );
        });

        return <Tabs name={this.props.name} default={selected}>
            <Row className="oscillator tab handles">
                {handles}
            </Row>
            {pages}
        </Tabs>
    }
}


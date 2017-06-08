import * as React from "react";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/state";
import { default as Tab } from "components/tabs/tab";
import { default as Handle } from "components/tabs/handle";
import { tabSelect } from "components/tabs/actions";

export interface TabContainerProps {
    name: string;
    default?: string;
    selected?: string;
    onSelect?: (tab: string, container: string) => void;
}

const mapStore = (store: State, props: TabContainerProps): TabContainerProps => ({
    ...props,
    selected: store.tabs.has(props.name) ? store.tabs.get(props.name).selected : undefined,
});

const mapDispatch = (dispatch: redux.Dispatch<State>, props: TabContainerProps): TabContainerProps => ({
    ...props,
    onSelect: (tabName: string, containerName: string) => {
        dispatch(tabSelect(tabName, containerName));
    }
});

@(connect(mapStore, mapDispatch) as any)
export default class Container extends React.PureComponent<TabContainerProps, undefined> {

    transformChildren(children: any): any {
        let selected = this.props.selected || this.props.default;
        return React.Children.map(children, (child: any, index) => {
            if (child.type === Handle) {
                selected = selected || child.props.for;
                return React.cloneElement(child, {
                    selected: selected === child.props.for || false,
                    onClick: () => this.props.onSelect(child.props.for, this.props.name),
                });
            } else if (child.type === Tab) {
                selected = selected || child.props.for;
                return React.cloneElement(child, {
                    selected: selected === child.props.name || false, 
                });
            } else if (child.props) {
                return React.cloneElement(
                    child, 
                    {},
                    this.transformChildren(child.props.children)
                );
            } else {
                return child;
            }
        });
    }

    render() {
        const children = this.transformChildren(this.props.children);
        return (
            <div>
                {children}
            </div>
        )
    }
}

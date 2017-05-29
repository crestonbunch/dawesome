import * as React from "react";
import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/store";
import { Action } from "components/interfaces";
/**
 * TabStore keeps track of the state for every TabContainer in the
 * current application.
 */
export interface TabStore {
    selected?: string;
}

export interface TabContainerProps {
    name: string;
    default?: string;
    selected?: string;
}

export interface TabContainerDispatch {
    select: (tab: string, container: string) => void;
}

export interface TabSelectAction extends Action {
    tab: string;
    container: string;
}

export const TAB_SELECT_ACTION: string = "TAB_SELECT";

/**
 * TabContainer wraps a group of Tabs.
 */
export class TabContainer extends React.PureComponent<TabContainerProps & TabContainerDispatch, undefined> {

    constructor(props: TabContainerProps & TabContainerDispatch) {
        super(props);
    }

    transformChildren(children: any): any {
        let selected = this.props.selected || this.props.default;
        return React.Children.map(children, (child: any, index) => {
            if (!child) { return child; }

            if (child.type.name === TabHandle.name) {
                if (!selected) {
                    selected = child.props.for;
                }
                return React.cloneElement(child, {
                    selected: selected === child.props.for || false,
                    action: () => this.props.select(child.props.for, this.props.name),
                });
            } else if (child.type.name == Tab.name) {
                if (!selected) {
                    selected = child.props.name;
                }
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

/**
 * Action that changes the currently selected tab in a container.
 * 
 * @param tabName is the tab to select.
 * @param containerName is the tab container.
 */
export const tabSelect = (tabName: string, containerName: string): TabSelectAction => ({
    type: TAB_SELECT_ACTION,
    tab: tabName,
    container: containerName,
});

/**
 * A reducer for switching the current active tab in a TabContainer.
 * 
 * @param state is an instance of TabStore
 * @param action is an action to perform
 */
export function tabsReducer(state = new Map<string, TabStore>(), action: TabSelectAction): Map<string, TabStore> {
    switch (action.type) {
        case TAB_SELECT_ACTION:
            let newState = new Map<string, TabStore>(state);
            if (!newState.has(action.container)) {
                newState.set(action.container, {});
            }
            newState.set(action.container, {selected: action.tab});
            return newState;
        default:
            return state;
    }
};

const mapStore = (store: State, props: TabContainerProps): TabContainerProps => ({
    ...props,
    selected: store.tabs.has(props.name) ? store.tabs.get(props.name).selected : undefined,
});

const mapDispatch = (dispatch: redux.Dispatch<State>, props: TabContainerProps): TabContainerProps => ({
    ...props,
    select: (tabName: string, containerName: string) => {
        dispatch(tabSelect(tabName, containerName));
    }
});

/**
 * Tabs is a Redux-wrapped TabContainer that can manage currently selected tabs
 * using the application data store.
 */
export const Tabs: React.ComponentClass<TabContainerProps> = connect(mapStore, mapDispatch)(TabContainer);

export interface TabProps {
    name: string;
    selected?: boolean;
}

/**
 * A Tab organizes information into tabs inside a TabContainer.
 */
export class Tab extends React.PureComponent<TabProps, undefined> {
    render() {
        if (this.props.selected) {
            return <div>{this.props.children}</div>
        } else {
            return null;
        }
    }
}

export interface TabHandleProps {
    for: string;
    action?: () => void;
    selected?: boolean;
}

/**
 * A TabHandle is the button to click to switch between tabs in a TabContainer.
 */
export class TabHandle extends React.PureComponent<TabHandleProps, undefined> {

    render() {
        let classes = this.props.selected ? "selected" : null;

        return (
            <span onClick={(e) => this.props.action()} className={classes}>
                {this.props.children}
            </span>
        )
    }
}

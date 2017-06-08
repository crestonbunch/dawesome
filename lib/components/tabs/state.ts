import * as redux from "redux";
import { connect } from "react-redux";

import { State } from "lib/state";
import { TabSelectAction, TAB_SELECT_ACTION } from "components/tabs/actions";

export interface TabState {
    selected?: string;
}

export interface TabContainerDispatch {
    onSelect?: (tab: string, container: string) => void;
}

/**
 * Switches the currently selected tab for a given tab container.
 * 
 * @param state 
 * @param action 
 */
function handleSelect(state: Map<string, TabState>, action: TabSelectAction): Map<string, TabState> {
    let newState = new Map<string, TabState>(state);
    if (!newState.has(action.container)) {
        newState.set(action.container, {});
    }
    newState.set(action.container, {selected: action.tab});
    return newState;
}

/**
 * A reducer for switching the current active tab in a TabContainer.
 * 
 * @param state is an instance of TabStore
 * @param action is an action to perform
 */
export default function TabStore(state = new Map<string, TabState>(), action: TabSelectAction): Map<string, TabState> {
    switch (action.type) {
        case TAB_SELECT_ACTION:
            return handleSelect(state, action);
        default:
            return state;
    }
}
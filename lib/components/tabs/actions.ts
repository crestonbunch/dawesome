import { Action } from "components/interfaces";

export interface TabSelectAction extends Action {
    tab: string;
    container: string;
}

export const TAB_SELECT_ACTION: string = "TAB_SELECT";

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
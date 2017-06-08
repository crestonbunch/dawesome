import { Action } from "components/interfaces";

// Action type constants
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';

export interface PlayAction extends Action {
    location: number;
}

export interface PauseAction extends Action {
    location: number;
}

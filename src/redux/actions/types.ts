import { UserAction } from "./user";

export enum ActionTypes {
    SET_USER = "SET_USER",
    ClEAR_USER = "ClEAR_USER",
}

export type Action = UserAction;

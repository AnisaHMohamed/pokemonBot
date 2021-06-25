export enum StateTypes {
  Question,
  Statement
}

export interface State {
    type: StateTypes
    text: Function
    before?: Function
    after?: Function
    choices?: string[]
    next?: string
    answer?: string
    validate?: boolean
}

export interface States {
    [index: string]: State
}
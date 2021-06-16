export class DataService {

    store: Record<string, any>;

    constructor() {
        this.store = new Map()
    }

}

export const Data = new DataService().store;
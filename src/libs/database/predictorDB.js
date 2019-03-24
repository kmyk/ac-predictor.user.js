﻿import { DataBase } from './database';

export const StoreKeys = { aperfs: "APerfs", standings: "Standings" };
export class PredictorDB extends DataBase {
    version = 1;
    name = "PredictorDB";
    constructor() {
        super(this.name, this.version);
    }
}

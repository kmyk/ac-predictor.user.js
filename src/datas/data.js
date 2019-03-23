﻿import { getLS, setLS } from '../atcoder-lib/utils';
import * as $ from 'jquery';

/**
 * ローカルストレージを用いて他のタブと同期的にデータを保存/更新するためのクラスです。
 */
export class SyncedData {
    /**
     * データが格納されます。
     */
    data = {};

    /**
     * オブジェクト生成用のコンストラクタです
     * @param {Function} [getNewData] 更新の際に新たなデータオブジェクトを返す関数です。
     * @param {string} [lsKey] 保存に用いるローカルストレージのkeyです。
     * @param {Function} [onUpdate] 更新の際に呼ばれる関数です。
     */
    constructor(getNewData, lsKey, onUpdate) {
        this.getNewData = getNewData;
        this.lsKey = lsKey;
        this.onUpdate = onUpdate;
        this.data = getNewData();

        window.addEventListener('storage', event => {
            if (event.key !== lsKey) return;
            this.data = getLS(this.lsKey);
            this.onUpdate();
        });
    }

    /**
     * データのアップデートをする関数です。
     */
    async update() {
        this.data = await this.getNewData();
        setLS(this.lsKey, this.data);
        this.onUpdate();
    }
}

/**
 * GETでJSONデータを取得し、他のタブと同期的にデータを扱います。
 */
export class JsonData extends SyncedData {
    /**
     * オブジェクト生成用のコンストラクタです
     * @param {string} [dataURL] データ取得先のURLです。
     * @param {string} [lsKey] 保存に用いるローカルストレージのkeyです。
     * @param {Function} [onUpdate] 更新の際に呼ばれる関数です。
     */
    constructor(dataURL, lsKey, onUpdate) {
        super(async () => {
            return await $.ajax(dataURL);
        }, lsKey, onUpdate);
    }
}

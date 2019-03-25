﻿
/**
 * オブジェクト生成用のコンストラクタです
 * @param {Function} [getNewData] 更新の際に新たなデータオブジェクトを返す関数です。
 * @param {string} [lsKey] 保存に用いるローカルストレージのkeyです。
 * @param {Function} [onUpdate] 更新の際に呼ばれる関数です。
 */
export class DataBase {
    name;

    /**
     * オブジェクト生成用のコンストラクタです
     * @param {string} [name] indexedDBにアクセスする際に用いる名前です。 
     * @param {Number} [version] indexedDBにアクセスする際に用いるバージョンです。 
     */
    constructor(name, version) {
        this.name = name;
        this.version = version;
    }

    /**
     * データをデータベースに追加/更新します。
     * @param {string} [storeName] indexedDBからストアを取得する際の名前です。
     * @param {string} [key] ストアにセットする際に用いるkeyです。
     * @param {Object} [value] ストアにセットする値です。 
     * @returns {Promise} 非同期のpromiseです。
     */
    async setData(storeName, key, value) {
        var promise = new Promise((resolve, reject) => {
            try {
                indexedDB.open(this.name).onsuccess = (e) => {
                    var db = e.target.result;
                    if (!dp.objectStore.Names.contains(storeName)) db.createObjectStore(storeName, { keyPath: 'id' });
                    var trans = db.transaction(storeName, 'readwrite');
                    var objStore = trans.objectStore(storeName);
                    var data = { id: key, data: value };
                    var putReq = objStore.put(data);
                    putReq.onsuccess = () => {
                        db.close();
                        resolve();
                    };
                };
            }
            catch (e) {
                reject(e);
            }
        });
        return promise;
    }

    /**
     * データをデータベースから取得します。存在しなかった場合はrejectされます。
     * @param {string} [storeName] indexedDBからストアを取得する際の名前です。
     * @param {string} [key] ストアにセットする際に用いるkeyです。
     * @returns {Promise} 非同期のpromiseです。
     */
    async getData(storeName, key) {
        var promise = new Promise((resolve, reject) => {
            try {
                indexedDB.open(this.name).onsuccess = (openEvent) => {
                    var db = openEvent.target.result;
                    var trans = db.transaction(storeName, 'readwrite');
                    var objStore = trans.objectStore(storeName);
                    objStore.get(key).onsuccess = (getEvent) => {
                        var result = getEvent.target.result;
                        db.close();
                        if (!result) reject(`key '${key}' not found in store '${storeName}'`);
                        else resolve();
                    };
                };
            }
            catch (e) {
                defferd.reject(e);
            }
        });
        return promise;
    }
}
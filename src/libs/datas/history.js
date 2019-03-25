﻿import { JsonData } from './data';

/**
 * ユーザのパフォーマンス履歴を取得し、他のタブと同期的にデータを扱います。
 */
export class HistoryData extends JsonData {
    constructor(userScreenName, onUpdate) {
        super(
            `https://beta.atcoder.jp/users/${userScreenName}/history/json`,
            `predictor-history-${contestScreenName}`,
            onUpdate
        );
    }
}
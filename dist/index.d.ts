declare type ItemList = {
    [prop: string]: any;
}[];
declare type QueryObj = {
    [prop: string]: null | undefined | number | boolean | string | symbol | bigint | Function | RegExp;
};
export declare function find(origin: ItemList): Operator;
export declare class Operator {
    private data;
    private ordering;
    constructor(origin: ItemList);
    where(query: QueryObj): Operator;
    orderBy(field: string, ordering?: string): ItemList;
    get(): ItemList;
}
export {};

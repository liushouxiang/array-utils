type ItemList = {[prop: string]: any}[];

type QueryObj = {
    [prop: string]: null | undefined | number | boolean | string | symbol | bigint | Function | RegExp,
};

export function find(origin: ItemList): Operator {
    return new Operator(origin);
}

const toString = Object.prototype.toString;

function isPrimitive(obj: any): boolean {
    const type: string = typeof obj;
    return obj == null || (type !== 'object' && type !== 'function');
}

function isArray(obj: any): boolean {
    return toString.call(obj) === '[object Array]';
}

function isFunction(obj: any): boolean {
    return toString.call(obj) === '[object Function]';
}

function isRegExp(obj: any) {
    return toString.call(obj) === '[object RegExp]';
}

export class Operator {

    private data: ItemList = null;
    private ordering: readonly [string, string] = ['asc', 'desc'];

    constructor(origin: ItemList) {
        if (!isArray(origin)) {
            throw new Error('origin must be an array.');
        }
        this.data = [...origin];
    }

    /**
     * @param query - object which key should be fields in origin, and value as the filter rule
     * @return Operator
     */
    where(query: QueryObj): Operator {
        if (!query || typeof query !== 'object') {
            throw new Error('query must be an object.');
        }
        const entries = Object.entries(query);
        this.data = this.data.filter((item) => {
            let matched = true;
            for (const [field, rule] of entries) {
                if (!item.hasOwnProperty(field)) {
                    continue;
                }
                /**
                 * if `rule` is primitive type, compare directly
                 */
                if (isPrimitive(rule)) {
                    matched = item[field] === rule;
                /**
                 * if `rule` is function, call it with field value and item as arguments 
                 * the function is expected to return an boolean value
                 */
                } else if (isFunction(rule)) {
                    matched = (<Function>rule).call(null, item[field], item);
                /**
                 * if `rule` is RegExp, test the field value with `rule`
                 */
                } else if (isRegExp(rule)) {
                    matched = (<RegExp>rule).test(item[field]);
                /**
                 * for any other types of `rule`, throw an error
                 */
                } else {
                    throw new Error('query rule must be function, regexp or any primitive type.');
                }
                /**
                 * return if any rule mismatched
                 */
                if (!matched) {
                    break;
                }
            }
            return matched;
        });
        return this;
    }

    /**
     * 
     * @param field string, the field used to sorting
     * @param ordering string, sorting order which value should be `asc` or `desc`
     * @return ItemList, sorting result
     */
    orderBy(field: string, ordering = 'asc'): ItemList {
        if (!this.ordering.includes(ordering)) {
            throw new Error('ordering must be one of "asc", "desc".');
        }
        if (!this.data.length) {
            return [];
        }
        const item = this.data[0];
        if (!item.hasOwnProperty(field)) {
            throw new Error(`unknown field "${field}" in origin data.`);
        }
        if (typeof item[field] !== 'number') {
            throw new Error('type of the sorting field must be a number.');
        }
        this.data.sort((a, b) => {
            return ordering === 'asc' ? a[field] - b[field] : b[field] - a[field];
        });
        return [...this.data];
    }

    /**
     * @return ItemList, the internal cached data in Operator instance
     */
    get(): ItemList {
        return [...this.data];
    }
}

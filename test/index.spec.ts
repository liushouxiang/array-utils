import {find, Operator} from '../index'

describe('array-utils', function() {

    describe('#find', () => {
        
        test('call `find` should return Operator instance', () => {
            expect(find([])).toBeInstanceOf(Operator)
        })

        test(`should throw error if origin data is not an array`, () => {
            let origin: [] = <[]>{}
            expect(() => find(origin)).toThrow(Error)
        })

    })

    describe('#Operator', () => {

        let origin: {[prop: string]: any}[]
        let operator: Operator

        beforeEach(() => {
            origin = [
                {id: '1', userId: 8, title: 'title1'},
                {id: '2', userId: 11, title: 'other'},
                {id: '3', userId: 15, title: null},
                {id: '4', userId: 15, title: 'test'},
                {id: '6', userId: 19, title: 'title2'},
                {id: '5', userId: 15, title: 'test1'},
            ]
            operator = new Operator(origin)
        })

        it('get data from Operator', () => {
            expect(operator.get()).toEqual(origin)
        })

        it('filter origin by non-exists field', () => {
            operator.where({ nonExists: 123 })
            expect(operator.get()).toEqual(origin)
        })

        it('filter origin by primitive-type comparation', () => {
            operator.where({ userId: 8 })
            expect(operator.get()).toEqual(
                [{id: '1', userId: 8, title: 'title1'}]
            )
            operator.where({ title: null })
            expect(operator.get()).toEqual([])
        })

        it('filter origin by function', () => {
            let result = origin.filter(item => item.title && item.title.startsWith('t'))
            operator.where({
                title: (title: string) => title && title.startsWith('t')
            })
            expect(operator.get()).toEqual(result)

            result = [
                {id: '4', userId: 15, title: 'test'},
                {id: '5', userId: 15, title: 'test1'}
            ]
            operator.where({
                title: (title: string, item: {[prop: string]: any}) => {
                    return item.userId === 15
                }
            })
            expect(operator.get()).toEqual(result)
        })

        it('filter origin by regexp', () => {
            let result = [
                {id: '1', userId: 8, title: 'title1'},
                {id: '6', userId: 19, title: 'title2'},
                {id: '5', userId: 15, title: 'test1'},
            ]
            operator.where({
                title: /\d$/
            })
            expect(operator.get()).toEqual(result)
        })

        it('filter origin by multiple fields', () => {
            let result = [
                {id: '4', userId: 15, title: 'test'},
                {id: '5', userId: 15, title: 'test1'},
            ]
            operator.where({
                userId: 15,
                title: (title: string) => title != null,
            })
            expect(operator.get()).toEqual(result)
        })

        it('sort origin by userId as ascending order', () => {
            let result = [
                { id: '1', userId: 8, title: 'title1' },
                { id: '2', userId: 11, title: 'other' },
                { id: '3', userId: 15, title: null },
                { id: '4', userId: 15, title: 'test' },
                { id: '5', userId: 15, title: 'test1' },
                { id: '6', userId: 19, title: 'title2' }
            ]
            let actual = operator.orderBy('userId', 'asc')
            expect(actual).toEqual(result)
        })

        it('sort origin by userId as descending order', () => {
            let result = [
                { id: '6', userId: 19, title: 'title2' },
                { id: '3', userId: 15, title: null },
                { id: '4', userId: 15, title: 'test' },
                { id: '5', userId: 15, title: 'test1' },
                { id: '2', userId: 11, title: 'other' },
                { id: '1', userId: 8, title: 'title1' }
            ]
            let actual = operator.orderBy('userId', 'desc')
            expect(actual).toEqual(result)
        })
    })

})

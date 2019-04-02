import { async } from '@angular/core/testing';
import { calcISK } from './calcISK';
describe('CalcISK', () => {
    it('has currencyValue', async(() => {
        const travel = {};
        const buyItem = { _id: null,
            travelId: '1',
            date: new Date(),
            caption: 'test',
            currency: 'USD',
            price: 10,
            currencyValue: 1,
            needToBeSync: false
        };
        expect(calcISK(buyItem, null)).toEqual(10);
        buyItem.currencyValue = 2;
        expect(calcISK(buyItem, null)).toEqual(20);
    }));
    it('currencyValue null travle null', async(() => {
        const travel = { _id: null,
            from: new Date(),
            to: new Date(),
            name: '',
            key: '',
            categoryMaxId: 0,
            categories: [],
            currencies: [{id: 'ISK', trade: 1}],
            personMaxId: 0,
            persons: [],
            needToBeSync: true
        };
        const buyItem = { _id: null,
            travelId: '1',
            date: new Date(),
            caption: 'test',
            currency: 'USD',
            price: 10,
            currencyValue: null,
            needToBeSync: false
        };
        expect(calcISK(buyItem, null)).toEqual(null);
        expect(calcISK(buyItem, travel)).toEqual(null);
        travel.currencies.push({id: 'USD', trade: 2});
        expect(calcISK(buyItem, travel)).toEqual(20);
    }));
});

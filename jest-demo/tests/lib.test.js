const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => {
    it('should return a positive number if input is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });
    it('should return a positive number if input is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });
    it('should return a zero if input is zero', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return the greeting message', () => {
        const result = lib.greet('Efren');
        expect(result).toMatch(/Efren/);
    })
});

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const result = lib.getCurrencies();
        expect(result).toEqual(expect.arrayContaining(['USD', 'AUD', 'EUR']));
    })
})

describe('getProduct', () => {
    it('should return the product with a given id', () => {
        const result = lib.getProduct(1);
        expect(result).toMatchObject({ id: 1, price: 10 });
    })
})

describe('registerUser', () => {
    it('should throw exception if username is falsy', () => {
        const args = [null, undefined, NaN, '', 0, false];
        args.forEach(a => {
            expect(() => {
                lib.registerUser(a);
            }).toThrow();
        })
    })
    it('should return a user object if valid username is passed', () => {
        const result = lib.registerUser('efren');
        expect(result).toMatchObject({ username: 'efren' });
        expect(result.id).toBeGreaterThan(0);
    })
})

describe('applyDiscount', () => {
    it('should apply 10% discount if customer has more than 10 points', () => {
        db.getCustomerSync = function (customerId) {
            console.log('Invoking mocked method...');
            return { id: customerId, points: 20 };
        }

        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    })
})

describe('notifyCustomer', () => {
    it('should send an email to the customer', () => {
        
        //arrange
        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
        mail.send = jest.fn();

        //act
        lib.notifyCustomer({ customerId: 1 })

        //assert
        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);
    })
})
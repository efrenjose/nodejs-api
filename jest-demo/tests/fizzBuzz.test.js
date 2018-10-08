const lib = require('../fizzBuzz');

describe('fizzBuzz', () => {
    it('should throw error if input is not a number', () => {
        expect(() => { lib.registerUser('a') }).toThrow();
        expect(() => { lib.registerUser(null) }).toThrow();
        expect(() => { lib.registerUser(undefined) }).toThrow();
        expect(() => { lib.registerUser({}) }).toThrow();
    })
    it('should return fizz buzz if input is divisible by 3 and 5', () => {
        const result = lib.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    })
    it('should return fizz if input is divisible by 3', () => {
        const result = lib.fizzBuzz(9);
        expect(result).toBe('Fizz');
    })
    it('should return buzz if input is divisible by 5', () => {
        const result = lib.fizzBuzz(25);
        expect(result).toBe('Buzz');
    })
    it('should return input if input is not divisible by 3 or 5', () => {
        const result = lib.fizzBuzz(1);
        expect(result).toBe(1);
    })
})
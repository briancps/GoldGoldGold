import {test, expect} from 'vitest'
import {calculateAngle} from './angleFunction'

test('straight line returns angle close to 180 degrees', () => {
    const a = {x : 1, y : 0};
    const b = {x : 2, y: 0};
    const c = {x : 3, y : 0};

    expect(calculateAngle(a, b, c)).toBeCloseTo(180);
})

test('right angle returns angle close to 90 degrees', () => {
    const a = {x : 1, y : 0};
    const b = {x : 0, y: 0};
    const c = {x : 0, y : 1};

    expect(calculateAngle(a, b, c)).toBeCloseTo(90);
})

test('returns angle <= 180 degrees', () => {
    const a = {x : 1, y : 2};
    const b = {x : 3, y : 1};
    const c = {x : 5, y : 2};

    expect(calculateAngle(a, b, c)).toBeLessThan(180);
})

test('throws error for zero-length vectors', () => {
    const a = {x : 0, y : 0};
    const b = {x : 0, y : 0};
    const c = {x : 0, y : 0};

    // When testing if an error is thrown, have to wrap the function call in a lambda function
    // This is to avoid the function from being called and run immediately which leads to error being thrown right away. (crashes before expect runs)
    expect(() => calculateAngle(a, b, c)).toThrow();
})
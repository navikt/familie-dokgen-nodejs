import { expect } from "chai";

describe('Index test', () => {
    describe('Addition', () => {
        it('should return 2 when testing 1 + 1', () => {
            const number = 1 + 1;
            expect(number).to.equal(2);
        });
        it('should not return 2 when testing 1 + 2', () => {
            const number = 1 + 2;
            expect(number).to.not.equal(2);
        });
    });
});

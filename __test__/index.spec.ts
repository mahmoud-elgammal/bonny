declare const bonny: {
    tl: any;
}


describe('bonny test', () => {
    it('should have timeline', () => {
        expect(bonny.tl).toBeDefined();
    });
});
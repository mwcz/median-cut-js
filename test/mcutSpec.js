define(['mcut'], function(MCut) {

    console.log(MCut);

    describe('mcut', function() {

        beforeEach(function() {
        });

        it('equals itself', function() {
            if (typeof MCut !== 'undefined') {
                console.log(MCut);
            }
            expect(1).toEqual(1);
        });

    });

});

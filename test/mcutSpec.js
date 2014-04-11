/* globals describe, beforeEach, expect, it, MCut */

beforeEach(function() {
    this.addMatchers({

        toBeEmpty: function() {
            return this.actual === [];
        },

        toBeLength: function(ln) {
            return this.actual.length === ln;
        },

    });
});

describe('MCut', function() {

    it('is defined', function() {
        expect(MCut).toBeDefined();
    });

    it('has init function', function() {
        var mc = new MCut();
        expect(mc.init).toBeDefined();
    });

});

describe('MCut.get_fixed_size_palette', function() {

    it('handles empty data', function() {
        var mc = new MCut();
        mc.init([]);
        expect(mc.get_fixed_size_palette(4)).toBeLength(0);
    });

    it('handles a single data point', function() {
        var data = [ [0,0,0] ];
        var mc = new MCut();
        mc.init(data);
        expect(mc.get_fixed_size_palette(1)).toEqual([[0,0,0],]);
        expect(mc.get_fixed_size_palette(2)).toEqual([[0,0,0],[0,0,0],]);
        expect(mc.get_fixed_size_palette(3)).toEqual([[0,0,0],[0,0,0],[0,0,0],]);
        expect(mc.get_fixed_size_palette(4)).toEqual([[0,0,0],[0,0,0],[0,0,0],[0,0,0],]);
        expect(mc.get_fixed_size_palette(5)).toEqual([[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],]);
    });

});
describe('MCut.get_dynamic_size_palette', function() {

    it('handles empty data', function() {
        var mc = new MCut();
        mc.init([]);
        expect(mc.get_dynamic_size_palette()).toBeLength(0);
    });

    it('handles a single data point', function() {
        var data = [ [0, 0, 0] ];
        var mc = new MCut();
        mc.init(data);
        // low threshold
        expect(mc.get_dynamic_size_palette(0)).toEqual([[0,0,0]]);
        // high threshold
        expect(mc.get_dynamic_size_palette(1)).toEqual([[0,0,0]]);
    });

});

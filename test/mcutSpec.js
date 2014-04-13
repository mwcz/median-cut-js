/* globals describe, beforeEach, expect, it, MCut */

/*********************************************************************
 *                          CUSTOM MATCHERS                          *
 *********************************************************************/

beforeEach(function() {
    this.addMatchers({

        toBeA: function (type) {
            return this.actual instanceof type;
        },

        toBeEmpty: function() {
            return this.actual.length === 0;
        },

        toBeLength: function(ln) {
            return this.actual.length === ln;
        },

        toBeGreaterThanOrEqualTo: function(ln) {
            return this.actual >= ln;
        },

        toBeLessThanOrEqualTo: function(ln) {
            return this.actual <= ln;
        },

    });
});


/*********************************************************************
 *                        MCut API Definition                        *
 *********************************************************************/

describe('MCut', function() {

    it('is defined', function() {
        expect(MCut).toBeDefined();
    });

    it('has init function', function() {
        var mc = new MCut();
        expect(mc.init).toBeA(Function);
    });

    it('has get_fixed_size_palette function', function() {
        var mc = new MCut();
        expect(mc.get_fixed_size_palette).toBeA(Function);
    });

    it('has get_dynamic_size_palette function', function() {
        var mc = new MCut();
        expect(mc.get_dynamic_size_palette).toBeA(Function);
    });

});


/*********************************************************************
 *                   Individual MCut API functions                   *
 *********************************************************************/

describe('MCut.get_fixed_size_palette', function() {

    it('handles empty data', function() {
        var mc = new MCut();
        mc.init([]);
        expect(mc.get_fixed_size_palette(0)).toBeLength(0);
        expect(mc.get_fixed_size_palette(1)).toBeLength(0);
        expect(mc.get_fixed_size_palette(2)).toBeLength(0);
        expect(mc.get_fixed_size_palette(3)).toBeLength(0);
        expect(mc.get_fixed_size_palette(4)).toBeLength(0);
    });

    it('handles a single data point', function() {
        var data = [ [0,0,0] ];
        var mc = new MCut();
        mc.init(data);
        expect(mc.get_fixed_size_palette(1)).toEqual([[0,0,0],]);
    });

    it('returns the requested size of palette', function() {
        var data = [[128, 142, 235], [105, 213, 55], [79, 50, 158], [224, 102, 218], [90, 206, 103], [61, 160, 121], [103, 233, 4], [132, 192, 50], [200, 204, 127], [215, 121, 176], [1, 225, 169], [8, 206, 217], [25, 195, 135], [193, 167, 83], [189, 62, 236], [71, 164, 43], [89, 68, 213], [17, 156, 150], [211, 3, 18], [23, 164, 153]];
        var mc = new MCut();
        mc.init(data);
        expect(mc.get_fixed_size_palette(0)).toBeLength(0);
        expect(mc.get_fixed_size_palette(1)).toBeLength(1);
        expect(mc.get_fixed_size_palette(2)).toBeLength(2);
        expect(mc.get_fixed_size_palette(3)).toBeLength(3);
        expect(mc.get_fixed_size_palette(4)).toBeLength(4);
        expect(mc.get_fixed_size_palette(5)).toBeLength(5);
        expect(mc.get_fixed_size_palette(6)).toBeLength(6);
        expect(mc.get_fixed_size_palette(7)).toBeLength(7);
        expect(mc.get_fixed_size_palette(8)).toBeLength(8);
        expect(mc.get_fixed_size_palette(9)).toBeLength(9);
        expect(mc.get_fixed_size_palette(10)).toBeLength(10);
        expect(mc.get_fixed_size_palette(100)).toBeLength(100);
    });

    it('returns the same result when called several times', function() {
        var data = [[181, 156, 126], [215, 239, 132], [187, 153, 243], [209, 139, 195], [120, 112, 236], [6, 84, 188], [69, 72, 100], [41, 83, 117], [230, 228, 239], [199, 67, 44], [59, 240, 19], [27, 149, 165], [194, 106, 149], [171, 81, 210], [2, 50, 224], [27, 124, 141], [221, 107, 212], [128, 108, 118], [62, 159, 18], [111, 177, 17]];
        var mc = new MCut();
        mc.init(data);
        expect(mc.get_fixed_size_palette(4)).toBeLength(4);
        expect(mc.get_fixed_size_palette(4)).toBeLength(4);
        expect(mc.get_fixed_size_palette(4)).toBeLength(4);
        expect(mc.get_fixed_size_palette(4)).toBeLength(4);
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

    it('returns the same result when called several times', function() {
        var data = [[181, 156, 126], [215, 239, 132], [187, 153, 243], [209, 139, 195], [120, 112, 236], [6, 84, 188], [69, 72, 100], [41, 83, 117], [230, 228, 239], [199, 67, 44], [59, 240, 19], [27, 149, 165], [194, 106, 149], [171, 81, 210], [2, 50, 224], [27, 124, 141], [221, 107, 212], [128, 108, 118], [62, 159, 18], [111, 177, 17]];
        var mc = new MCut();
        mc.init(data);

        var result1 = mc.get_dynamic_size_palette(0.4);
        var result2 = mc.get_dynamic_size_palette(0.4);
        var result3 = mc.get_dynamic_size_palette(0.4);
        var result4 = mc.get_dynamic_size_palette(0.4);

        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
        expect(result3).toEqual(result4);
    });

    it('returns more colors for higher threshold values', function() {
        var data = [[181, 156, 126], [215, 239, 132], [187, 153, 243], [209, 139, 195], [120, 112, 236], [6, 84, 188], [69, 72, 100], [41, 83, 117], [230, 228, 239], [199, 67, 44], [59, 240, 19], [27, 149, 165], [194, 106, 149], [171, 81, 210], [2, 50, 224], [27, 124, 141], [221, 107, 212], [128, 108, 118], [62, 159, 18], [111, 177, 17]];
        var mc = new MCut();
        mc.init(data);

        var result1 = mc.get_dynamic_size_palette(0.0);
        var result2 = mc.get_dynamic_size_palette(0.3);
        var result3 = mc.get_dynamic_size_palette(0.6);
        var result4 = mc.get_dynamic_size_palette(0.9);
        var result5 = mc.get_dynamic_size_palette(1.0);

        expect(result5.length).toBeGreaterThanOrEqualTo(result4.length);
        expect(result4.length).toBeGreaterThanOrEqualTo(result3.length);
        expect(result3.length).toBeGreaterThanOrEqualTo(result2.length);
        expect(result2.length).toBeGreaterThanOrEqualTo(result1.length);
    });

});

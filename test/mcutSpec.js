/* globals describe, beforeEach, expect, it, MCut, Uint32Array, Uint16Array, Uint8Array, Uint8ClampedArray */

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

    it('accepts typed arrays', function() {
        var data_uint32 = [new Uint32Array(181, 156, 126), new Uint32Array(215, 239, 132), new Uint32Array(187, 153, 243), new Uint32Array(209, 139, 195), new Uint32Array(120, 112, 236), new Uint32Array(6, 84, 188), new Uint32Array(69, 72, 100), new Uint32Array(41, 83, 117), new Uint32Array(230, 228, 239), new Uint32Array(199, 67, 44), new Uint32Array(59, 240, 19), new Uint32Array(27, 149, 165), new Uint32Array(194, 106, 149), new Uint32Array(171, 81, 210), new Uint32Array(2, 50, 224), new Uint32Array(27, 124, 141), new Uint32Array(221, 107, 212), new Uint32Array(128, 108, 118), new Uint32Array(62, 159, 18), new Uint32Array(111, 177, 17)];
        var data_uint16 = [new Uint16Array(181, 156, 126), new Uint16Array(215, 239, 132), new Uint16Array(187, 153, 243), new Uint16Array(209, 139, 195), new Uint16Array(120, 112, 236), new Uint16Array(6, 84, 188), new Uint16Array(69, 72, 100), new Uint16Array(41, 83, 117), new Uint16Array(230, 228, 239), new Uint16Array(199, 67, 44), new Uint16Array(59, 240, 19), new Uint16Array(27, 149, 165), new Uint16Array(194, 106, 149), new Uint16Array(171, 81, 210), new Uint16Array(2, 50, 224), new Uint16Array(27, 124, 141), new Uint16Array(221, 107, 212), new Uint16Array(128, 108, 118), new Uint16Array(62, 159, 18), new Uint16Array(111, 177, 17)];
        var data_uint8  = [new Uint8Array(181, 156, 126), new Uint8Array(215, 239, 132), new Uint8Array(187, 153, 243), new Uint8Array(209, 139, 195), new Uint8Array(120, 112, 236), new Uint8Array(6, 84, 188), new Uint8Array(69, 72, 100), new Uint8Array(41, 83, 117), new Uint8Array(230, 228, 239), new Uint8Array(199, 67, 44), new Uint8Array(59, 240, 19), new Uint8Array(27, 149, 165), new Uint8Array(194, 106, 149), new Uint8Array(171, 81, 210), new Uint8Array(2, 50, 224), new Uint8Array(27, 124, 141), new Uint8Array(221, 107, 212), new Uint8Array(128, 108, 118), new Uint8Array(62, 159, 18), new Uint8Array(111, 177, 17)];
        var data_uint8c = [new Uint8ClampedArray(181, 156, 126), new Uint8ClampedArray(215, 239, 132), new Uint8ClampedArray(187, 153, 243), new Uint8ClampedArray(209, 139, 195), new Uint8ClampedArray(120, 112, 236), new Uint8ClampedArray(6, 84, 188), new Uint8ClampedArray(69, 72, 100), new Uint8ClampedArray(41, 83, 117), new Uint8ClampedArray(230, 228, 239), new Uint8ClampedArray(199, 67, 44), new Uint8ClampedArray(59, 240, 19), new Uint8ClampedArray(27, 149, 165), new Uint8ClampedArray(194, 106, 149), new Uint8ClampedArray(171, 81, 210), new Uint8ClampedArray(2, 50, 224), new Uint8ClampedArray(27, 124, 141), new Uint8ClampedArray(221, 107, 212), new Uint8ClampedArray(128, 108, 118), new Uint8ClampedArray(62, 159, 18), new Uint8ClampedArray(111, 177, 17)];
        var mc = new MCut();

        mc.init(data_uint32);
        var result_uint32 = mc.get_dynamic_size_palette(0.0);

        mc.init(data_uint16);
        var result_uint16 = mc.get_dynamic_size_palette(0.0);

        mc.init(data_uint8);
        var result_uint8  = mc.get_dynamic_size_palette(0.0);

        mc.init(data_uint8c);
        var result_uint8c = mc.get_dynamic_size_palette(0.0);

        expect(result_uint32).toEqual([[44, 126, 109], [186, 136, 173]]);
        expect(result_uint16).toEqual([[44, 126, 109], [186, 136, 173]]);
        expect(result_uint8 ).toEqual([[44, 126, 109], [186, 136, 173]]);
        expect(result_uint8c).toEqual([[44, 126, 109], [186, 136, 173]]);
    });

});

 /**************************************************************************
  * This file is part of median-cut.js                                     *
  *                                                                        *
  * median-cut.js is free software: you can redistribute it and/or modify  *
  * it under the terms of the GNU General Public License as published by   *
  * the Free Software Foundation, either version 3 of the License, or      *
  * (at your option) any later version.                                    *
  *                                                                        *
  * median-cut.js is distributed in the hope that it will be useful,       *
  * but WITHOUT ANY WARRANTY; without even the implied warranty of         *
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the          *
  * GNU General Public License for more details.                           *
  *                                                                        *
  * You should have received a copy of the GNU General Public License      *
  * along with median-cut.js.  If not, see <http://www.gnu.org/licenses/>. *
  **************************************************************************/


//  This is the median-cut algorithm.
//  
//  1. Find the smallest box which contains all the colors in the image.
//  
//  2. Sort the enclosed colors along the longest axis of the box.
//  
//  3. Split the box into 2 regions at median of the sorted list.
//  
//  4. Repeat the above process until the original color space has been divided
//     into N regions where N is the number of colors you want.

var MedianCut = function() {

    var boxes,

    init = function( _data ) {

        var box1 = Box();
        box1.init( _data );

        boxes = [ box1 ];

    },

    get_longest_box_index = function() {

        // find the box with the longest axis of them all...
        var longest_box_index = 0;

        for( var box_index = boxes.length - 1; box_index >= 0; --box_index ) {
            if( boxes[ box_index ] > longest_box_index ) {
                longest_box_index = boxes[ box_index ];
            }
        }

        return longest_box_index;

    },

    get_boxes = function() {
        return boxes;
    },

    get_dynamic_size_palette = function( _threshold ) {

        // threshold is a value in (0,1] that influences how many colors
        // will be in the resulting palette.  lower values of threshold
        // will result in a smaller palette size.

        var values = [],
            i,
            longest_box_index = get_longest_box_index(),
            longest_axis      = boxes[ longest_box_index ].get_longest_axis(),
            max_box_length    = longest_axis.length * ( 1 - _threshold );

        do {

            // remove the longest box and split it
            var box_to_split = boxes.splice( longest_box_index, 1 )[0];
            var split_boxes = box_to_split.split();
            var box1 = split_boxes[0];
            var box2 = split_boxes[1];

            // then push the resulting boxes into the boxes array
            boxes.push( box1 );
            boxes.push( box2 );

            longest_box_index = get_longest_box_index()
            longest_axis      = boxes[ longest_box_index ].get_longest_axis();

        }
        while( longest_axis.length > max_box_length );

        // palette is complete.  get the average colors from each box
        // and push them into the values array, then return.
        for( var i = boxes.length - 1; i >= 0; --i ) {
            values.push( boxes[i].average() );
        }

        return values;

    },

    get_fixed_size_palette = function( _number ) {

        var values = [];

        for( var i = _number - 1; i >= 0; --i ) {

            longest_box_index = get_longest_box_index();

            // remove the longest box and split it
            var box_to_split = boxes.splice( longest_box_index, 1 )[0];
            var split_boxes = box_to_split.split();
            var box1 = split_boxes[0];
            var box2 = split_boxes[1];

            // then push the resulting boxes into the boxes array
            boxes.push( box1 );
            boxes.push( box2 );
        }

        // palette is complete.  get the average colors from each box
        // and push them into the values array, then return.
        for( var i = _number - 1; i >= 0; --i ) {
            values.push( boxes[i].average() );
        }

        return values;

    };

    return {
        // This is a private function (listed here in case it needs to be made 
        // public easily :) 

        //get_boxes                : get_boxes

        // These are exposed (public) functions
        init                     : init,
        get_fixed_size_palette   : get_fixed_size_palette,
        get_dynamic_size_palette : get_dynamic_size_palette,
    };
};

var Box = function() {

    var data, // it's all about the data
        box,  // the bounding box of the data
        dim,  // number of dimensions in the data

    init = function( _data ) {

        // Initializes the data values, number of dimensions in the data
        // (currently fixed to 3 to handle RGB, but may be genericized in
        // the future), and the bounding box of the data.

        data = _data;
        dim  = 3; // lock this to 3 (RGB pixels) for now.
        box  = calculate_bounding_box();

    },

    get_data = function() {

        // Getter for data

        return data;

    },

    sort = function() {

        // Sorts all the elements in this box based on their values on the
        // longest axis.

        var a           = get_longest_axis().axis;
        var sort_method = get_comparison_func( a );

        data.sort( sort_method );

        return data;

    },

    get_comparison_func = function( _i ) {

        // Return a comparison function based on a given index (for median-cut,
        // sort on the longest axis) ie: sort ONLY on a single axis.  
        // get_comparison_func( 1 ) would return a sorting function that sorts
        // the data according to each item's Green value.

        var sort_method = function( a, b ) {
            return a[_i] - b[_i];
        };

        return sort_method;

    },

    split = function() {

        // Splits this box in two and returns two box objects. This function
        // represents steps 2 and 3 of the algorithm, as written at the top 
        // of this file.

        sort();

        var med   = median_pos();

        var data1 = data.slice( 0, med );   // elements 0 through med
        var data2 = data.slice( med );      // elements med through end

        var box1  = Box();
        var box2  = Box();

        box1.init( data1 );
        box2.init( data2 );

        return [ box1, box2 ];

    },

    average = function() {

        // Returns the average value of the data in this box

        var avg_r = 0;
        var avg_g = 0;
        var avg_b = 0;

        for( var i = data.length - 1; i >= 0; --i ) {
            avg_r += data[i][0];
            avg_g += data[i][1];
            avg_b += data[i][2];
        }

        avg_r /= data.length;
        avg_g /= data.length;
        avg_b /= data.length;

        return [ parseInt( avg_r ),
                 parseInt( avg_g ),
                 parseInt( avg_b ) ];

    },

    median_pos = function() {

        // Returns the position of the median value of the data in
        // this box.  The position number is rounded down, to deal
        // with cases when the data has an odd number of elements.

        return Math.floor( data.length / 2 );

    },

    get_bounding_box = function() {
        // Getter for the bounding box
        return box;
    },

    calculate_bounding_box = function() {

        // keeps running tally of the min and max values on each dimension
        // initialize the min value to the highest number possible, and the
        // max value to the lowest number possible

        var minmax = [ { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
                       { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
                       { min: Number.MAX_VALUE, max: Number.MIN_VALUE } ];

        for( var i = data.length - 1; i >= 0; --i ) {

            minmax[0].min = ( data[i][0] < minmax[0].min ) ? 
                              data[i][0] : minmax[0].min; // r
            minmax[1].min = ( data[i][1] < minmax[1].min ) ?
                              data[i][1] : minmax[1].min; // g
            minmax[2].min = ( data[i][2] < minmax[2].min ) ?
                              data[i][2] : minmax[2].min; // b

            minmax[0].max = ( data[i][0] > minmax[0].max ) ?
                              data[i][0] : minmax[0].max; // r
            minmax[1].max = ( data[i][1] > minmax[1].max ) ?
                              data[i][1] : minmax[1].max; // g
            minmax[2].max = ( data[i][2] > minmax[2].max ) ?
                              data[i][2] : minmax[2].max; // b
        }

        return minmax;

    },

    get_longest_axis = function() {

        // Returns the longest (aka "widest") axis of the data in this box.

        var longest_axis = 0,
            longest_axis_size = 0;

        for( var i = dim - 1; i >= 0; --i ) {
            var axis_size = box[i].max - box[i].min;
            if( axis_size > longest_axis_size ) {
                longest_axis      = i;
                longest_axis_size = axis_size;
            }
        }

        return { axis   : longest_axis,
                 length : longest_axis_size };
    };

    return {

        /**/ // these are private functions
        //get_data               : get_data,
        //median_pos             : median_pos,
        //get_bounding_box       : get_bounding_box,
        //calculate_bounding_box : calculate_bounding_box,
        //sort                   : sort,
        //get_comparison_func    : get_comparison_func,
        /**/

        // These are exposed (public) functions
        split            : split,
        get_longest_axis : get_longest_axis,
        average          : average,
        init             : init
    };
};

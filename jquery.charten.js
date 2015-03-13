// Copyright 2013 Stéphane Lavergne <http://www.imars.com/> Free software under <http://www.gnu.org/licenses/lgpl-3.0.txt>

/**
 * jQuery Charten
 *
 * Transform certain types of simple lists into graphic representations.
 *
 * Note that only function-critical CSS is embedded.  Actual styling is left
 * to your application's stylesheet.
 *
 * Usage:
 *
 * $('li.piechart' ).charten({ mode: 'horizontal_pie',  width: 250 });
 * $('dl.histogram').charten({ mode: 'horizontal_hist', width: 250,
 *   color:  '#ff0000',
 *   prefix: '',
 *   suffix: ''
 * });
 *
 * Options aside from 'mode' are optional.
 *
 * A special option array 'rainbow' can be specified in 'horizontal_pie' mode
 * to override the default list of 31 colors.  If you use the default rainbow
 * and would like to create a legend somewhere, 'css' mode is useful:
 *
 * // Paint background of something in rainbow's 8th color:
 * $(...).charten({ mode: 'css', prop: 'background-color', i: 7 });
 *
 * @package   jquery.charten
 * @author    Stéphane Lavergne <http://www.imars.com/>
 * @copyright 2013 Stéphane Lavergne
 * @license   http://www.gnu.org/licenses/lgpl-3.0.txt  GNU LGPL version 3
 */

/*jslint node: false, browser: true, es5: false, white: true, nomen: true, plusplus: true */
/*global jQuery: true */

(function ($) {
	"use strict";
	$.fn.charten = function (args) {
		var
			mode = null,
			rainbow = [
				'#ffb8b8', '#00ff80', '#0040ff', '#b8b8b8',
				'#00b8b8', '#8000ff', '#808080', '#ff0000',
				'#b8ffb8', '#b800b8', '#00b8ff', '#ff8080',
				'#00ffb8', '#b8b8ff', '#b80080', '#b8ff00',
				'#ff8000', '#8080ff', '#b8b800', '#8000b8',
				'#0080ff', '#00ff00', '#ff0080', '#ffb800',
				'#00b800', '#b80000', '#b88080', '#b800ff',
				'#b88000', '#00b880', '#ff40d8'
			],
			width = 250,
			color = '#ff0000',
			prefix = '',
			suffix = '',
			prop = '',
			rainbowIndex = 0
		;
		if (args) {
			if (args.mode)    { mode         = args.mode; }
			if (args.rainbow) { rainbow      = args.rainbow; }
			if (args.color)   { color        = args.color; }
			if (args.width)   { width        = args.width; }
			if (args.prefix)  { prefix       = args.prefix; }
			if (args.suffix)  { suffix       = args.suffix; }
			if (args.prop)    { prop         = args.prop; }
			if (args.i)       { rainbowIndex = args.i; }
		}

		function horizontalPie() {
			var list = $(this), items = list.find('li'), totalVal = 0, i = 0;
			list
				.css('list-style-type', 'none')
				.css('margin', 0)
				.css('padding', 0)
			;
			list.contents().not(items).remove();  // Trim whitespace nodes

			items.each(function () {
				totalVal += parseInt($(this).text(), 10);
			});

			items.each(function () {
				var item = $(this);
				item
					.css('display', 'inline-block')
					.css('list-style-type', 'none')
					.css('margin', 0)
					.css('padding', 0)
					.css('width', 0)
					.css('color', 'transparent')
					.css('border-left', Math.round((parseInt(item.text(), 10)*width)/totalVal) + 'px solid ' + rainbow[i])
				;
				i++;
			});

			return this;
		}

		function horizontalHist() {
			var
				list = $(this),
				labels = list.find('dt'),
				bars = list.find('dd'),
				maxVal = 0
			;

			labels
				.css('float', 'left')
				.css('white-space', 'nowrap')
				.css('overflow', 'hidden')
			;

			bars.each(function () {
				maxVal = Math.max(maxVal, $(this).text());
			});
			bars.each(function () {
				var bar = $(this), text = bar.text();
				bar
					.css('border-left', Math.round((parseInt(text, 10)*width)/maxVal) + 'px solid ' + color)
					.text(prefix + text + suffix)
				;
			});

			return this;
		}

		function doCSS() {
			return $(this).css(prop, rainbow[rainbowIndex]);
		}

		switch (mode) {
			case 'horizontal_pie':
				return this.each(horizontalPie);
			case 'horizontal_hist':
				return this.each(horizontalHist);
			case 'css':
				return this.each(doCSS);
			default:
				break;
		}
	};
}( jQuery ));

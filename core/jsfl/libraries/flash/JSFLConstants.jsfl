// ------------------------------------------------------------------------------------------------------------------------
//
//     ██ ██████ ██████ ██     ██████                    ██                ██         
//     ██ ██     ██     ██     ██                        ██                ██         
//     ██ ██     ██     ██     ██     █████ █████ █████ █████ █████ █████ █████ █████ 
//     ██ ██████ █████  ██     ██     ██ ██ ██ ██ ██     ██      ██ ██ ██  ██   ██    
//     ██     ██ ██     ██     ██     ██ ██ ██ ██ █████  ██   █████ ██ ██  ██   █████ 
//     ██     ██ ██     ██     ██     ██ ██ ██ ██    ██  ██   ██ ██ ██ ██  ██      ██ 
//  █████ ██████ ██     ██████ ██████ █████ ██ ██ █████  ████ █████ ██ ██  ████ █████ 
//
// ------------------------------------------------------------------------------------------------------------------------
// JSFLConstants

/**
 * JSFL Constants
 * @overview	Static object for referencing the more common JSFL constants
 * @see			https://www.google.co.uk/search?source=ig&hl=en&rlz=&q=%22Acceptable+values+are+%22+site%3Ahttp%3A%2F%2Fhelp.adobe.com%2Fen_US%2Fflash%2Fcs%2Fextend%2F
 */
JSFLConstants =
{
	bitmap:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WSA4775F51-754E-4c47-8AAA-A3AB025E32E5.html
		compressionType: 
		{
			'photo':				'photo',
			'lossless':				'lossless',
		},
		
	},
	element:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cbc.html
		elementType:
		{
			'shape':				'shape',
			'text':					'text',
			'tlfText':				'tlfText',
			'instance':				'instance',
			'shapeObj':				'shapeObj',
		},
	},
	filter:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7bc0.html
		type: 
		{
			'inner':				'inner',
			'outer':				'outer',
			'full':					'full',
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7be8.html
		name:
		{
			'adjustColorFilter':	'adjustColorFilter',
			'bevelFilter':			'bevelFilter',
			'blurFilter':			'blurFilter',
			'dropShadowFilter':		'dropShadowFilter',
			'glowFilter':			'glowFilter',
			'gradientBevelFilter':	'gradientBevelFilter',
			'gradientGlowFilter':	'gradientGlowFilter',	
		},
		property:
		{
			'blurX':				'blurX',
			'blurY':				'blurY',
			'quality':				'quality',
			'distance':				'distance',
			'strength':				'strength',
			'knockout':				'knockout',
			'inner':				'inner',
			'bevelType':			'bevelType',
			'color':				'color',
			'shadowColor':			'shadowColor',
			'highlightColor':		'highlightColor',
		}
	},
	fill:
	{
		fillStyle:
		{
			'bitmap':				'bitmap',
			'solid':				'solid',
			'linearGradient':		'linearGradient',
			'radialGradient':		'radialGradient',
			'noFill':				'noFill',
			'linearGradient':		'linearGradient',
			'radialGradient':		'radialGradient',
		}
	},
	frame:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7abd.html
		labelType: 
		{
			'none':					'none',
			'name':					'name',
			'comment':				'comment',
			'anchor':				'anchor',
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7aab.html
		tweenType:
		{
			'motion':				'motion',
			'shape':				'shape',
			'none':					'none',
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a93.html
		easeCurve:
		{
			'all':					'all',
			'position':				'position',
			'rotation':				'rotation',
			'scale':				'scale',
			'color':				'color',
			'filters':				'filters',
		}
	},
	instance:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a71.html
		instanceType: 
		{
			'symbol':				'symbol',
			'bitmap':				'bitmap',
			'embedded video':		'embedded video',
			'linked video':			'linked video',
			'video':				'video',
			'compiled clip':		'compiled clip',
		},
	},
	item:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a6f.html
		itemType:
		{
			'undefined':			'undefined',
			'component':			'component',
			'movie clip':			'movie clip',
			'graphic':				'graphic',
			'button':				'button',
			'folder':				'folder',
			'font':					'font',
			'sound':				'sound',
			'bitmap':				'bitmap',
			'compiled clip':		'compiled clip',
			'screen':				'screen',
			'video':				'video',
		},
		
	},
	layer:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7854.html
		animationType:
		{
			'none':					'none',
			'motion object':		'motion object',
			'IK pose':				'IK pose',
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a3d.html
		layerType:
		{
			'normal':				'normal',
			'guide':				'guide',
			'guided':				'guided',
			'mask':					'mask',
			'masked':				'masked',
			'folder':				'folder',
		},
	},
	parameter:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-79e2.html
		valueType:
		{
			'Default':				'Default',
			'Array':				'Array',
			'Object':				'Object',
			'List':					'List',
			'String':				'String',
			'Number':				'Number',
			'Boolean':				'Boolean',
			'Font Name':			'Font Name',
			'Color':				'Color',
			'Collection':			'Collection',
			'Web Service URL':		'Web Service URL',
			'Web Service Operation':'Web Service Operation',
		},
	},
	symbol:
	{
		 // http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-788f.html
		 // http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78a0.html
		symbolType: 
		{
			'button':				'button',
			'movie clip':			'movie clip',
			'graphic':				'graphic',
		},
		blendMode:
		{
			'normal':		'normal',
			'layer':		'layer',
			'multiply':		'multiply',
			'screen':		'screen',
			'overlay':		'overlay',
			'hardlight':	'hardlight',
			'lighten':		'lighten',
			'darken':		'darken',
			'difference':	'difference',
			'add':			'add',
			'subtract':		'subtract',
			'invert':		'invert',
			'alpha':		'alpha',
			'erase':				'erase',
		}
	},
	sound:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WSA4775F51-754E-4c47-8AAA-A3AB025E32E5.html
		compressionType: 
		{
			'Default':				'Default',
			'ADPCM':				'ADPCM',
			'MP3':					'MP3',
			'Raw':					'Raw',
			'Speech':				'Speech',
		},
	},
	stroke:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78d3.html
		capType:
		{
			'none':					'none',
			'round':				'round',
			'square':				'square',
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78d3.html
		joinType:
		{
			'miter':				'miter',
			'round':				'round',
			'bevel':				'bevel',
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78c1.html
		scaleType:
		{
			'normal':				'normal',
			'horizontal':			'horizontal',
			'vertical':				'vertical',
			'none':					'none',
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78d1.html
		style:
		{
			'noStroke':				'noStroke',
			'solid':				'solid',
			'dashed':				'dashed',
			'dotted':				'dotted',
			'ragged':				'ragged',
			'stipple':				'stipple',
			'hatched':				'hatched',
		}
	},
	text:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7854.html
		textType:
		{
			'static':				'static',
			'dynamic':				'dynamic',
			'input':				'input',		
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-786a.html
		lineType:
		{
			'single line':			'single line',
			'multiline':			'multiline',
			'multiline no wrap':	'multiline no wrap',
			'password':				'password',
		},
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-784e.html
		alignment:
		{
			'left':					'left',
			'center':				'center',
			'right':				'right',
			'justify':				'justify',
		}
		
	},
	transform:
	{
		align:
		{
			'left':					'left',
			'right':				'right',
			'top':					'top',
			'bottom':				'bottom',
			'vertical center':		'vertical center',
			'horizontal center':	'horizontal center',
		},
		corner:
		{
			'bottom left':			'bottom left',
			'bottom right':			'bottom right',
			'top right':			'top right',
			'top left':				'top left',
			'top center':			'top center',
			'right center':			'right center',
			'bottom center':		'bottom center',
			'left center':			'left center',
		},
		distribute:
		{
			'left edge':			'left edge',
			'horizontal center':	'horizontal center',
			'right edge':			'right edge',
			'top edge':				'top edge',
			'vertical center':		'vertical center',
			'bottom edge':			'bottom edge',
		}
	},
	video:
	{
		// http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a60.html
		videoType:
		{
			'embedded video':		'embedded video',
			'linked video':			'linked video',
			'video':				'video',
		},
	}
	
}

xjsfl.classes.register('JSFLConstants', JSFLConstants, this);


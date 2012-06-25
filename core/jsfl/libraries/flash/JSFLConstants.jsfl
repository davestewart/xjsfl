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

	// --------------------------------------------------------------------------------
	// # bitmap
	
		bitmap:
		{
			/**
			 * bitmap.compressionType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WSA4775F51-754E-4c47-8AAA-A3AB025E32E5.html
			 */
			compressionType: 
			{
				'photo':				'photo',
				'lossless':				'lossless',
			},
			
		},
	
	// --------------------------------------------------------------------------------
	// # element
	
		element:
		{
			/**
			 * element.elementType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cbc.html
			 */
			elementType:
			{
				'shape':				'shape',
				'text':					'text',
				'tlfText':				'tlfText',
				'instance':				'instance',
				'shapeObj':				'shapeObj',
			},
		},
	
	// --------------------------------------------------------------------------------
	// # filter
	
		filter:
		{
			/**
			 * filter.type
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7bc0.html
			 */
			type: 
			{
				'inner':				'inner',
				'outer':				'outer',
				'full':					'full',
			},
			/**
			 * filter.name
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7be8.html
			 */
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
			/**
			 * filter.property
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7dd4.html
			 */
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
	
	// --------------------------------------------------------------------------------
	// # fill
	
		fill:
		{
			/**
			 * fill.fillStyle
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7abd.html
			 */
			fillStyle:
			{
				'bitmap':				'bitmap',
				'solid':				'solid',
				'linearGradient':		'linearGradient',
				'radialGradient':		'radialGradient',
				'noFill':				'noFill',
			}
		},
	
	// --------------------------------------------------------------------------------
	// # frame
	
		frame:
		{
			/**
			 * frame.labelType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7abd.html
			 */
			labelType: 
			{
				'none':					'none',
				'name':					'name',
				'comment':				'comment',
				'anchor':				'anchor',
			},
			/**
			 * frame.tweenType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7aab.html
			 */
			tweenType:
			{
				'motion':				'motion',
				'shape':				'shape',
				'none':					'none',
			},
			/**
			 * frame.easeCurve
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a93.html
			 */
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
	
	// --------------------------------------------------------------------------------
	// # instance
	
		instance:
		{
			/**
			 * instance.instanceType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a71.html
			 */
			instanceType: 
			{
				'symbol':				'symbol',
				'bitmap':				'bitmap',
				'embeddedVideo':		'embedded video',
				'linkedVideo':			'linked video',
				'video':				'video',
				'compiledClip':			'compiled clip',
			},
		},
	
	// --------------------------------------------------------------------------------
	// # item
	
		item:
		{
			/**
			 * item.itemType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a6f.html
			 */
			itemType:
			{
				'undefined':			'undefined',
				'component':			'component',
				'movieClip':			'movie clip',
				'graphic':				'graphic',
				'button':				'button',
				'folder':				'folder',
				'font':					'font',
				'sound':				'sound',
				'bitmap':				'bitmap',
				'compiledClip':			'compiled clip',
				'screen':				'screen',
				'video':				'video',
			},
			
		},
	
	// --------------------------------------------------------------------------------
	// # layer
	
		layer:
		{
			/**
			 * layer.animationType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7854.html
			 */
			animationType:
			{
				'none':					'none',
				'motionObject':			'motion object',
				'ikPose':				'IK pose',
			},
			/**
			 * layer.layerType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a3d.html
			 */
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
	
	// --------------------------------------------------------------------------------
	// # parameter
	
		parameter:
		{
			/**
			 * parameter.valueType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-79e2.html
			 */
			valueType:
			{
				'default':				'Default',
				'array':				'Array',
				'object':				'Object',
				'list':					'List',
				'string':				'String',
				'number':				'Number',
				'boolean':				'Boolean',
				'fontName':				'Font Name',
				'color':				'Color',
				'collection':			'Collection',
				'webServiceUrl':		'Web Service URL',
				'webServiceOperation':	'Web Service Operation',
			},
		},
	
	// --------------------------------------------------------------------------------
	// # symbol
	
		symbol:
		{
			/**
			 * symbol.symbolType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-788f.html
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78a0.html
			 */
			symbolType: 
			{
				'button':				'button',
				'movieClip':			'movie clip',
				'graphic':				'graphic',
			},
			/**
			 * symbol.blendMode
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7cf4.html
			 */
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
				'erase':		'erase',
			}
		},
	
	// --------------------------------------------------------------------------------
	// # sound
	
		sound:
		{
			/**
			 * sound.compressionType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WSA4775F51-754E-4c47-8AAA-A3AB025E32E5.html
			 */
			compressionType: 
			{
				'default':				'Default',
				'adpcm':				'ADPCM',
				'mp3':					'MP3',
				'raw':					'Raw',
				'speech':				'Speech',
			},
		},
	
	// --------------------------------------------------------------------------------
	// # stroke
	
		stroke:
		{
			/**
			 * stroke.capType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78d3.html
			 */
			capType:
			{
				'none':					'none',
				'round':				'round',
				'square':				'square',
			},
			/**
			 * stroke.joinType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78d3.html
			 */
			joinType:
			{
				'miter':				'miter',
				'round':				'round',
				'bevel':				'bevel',
			},
			/**
			 * stroke.scaleType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78c1.html
			 */
			scaleType:
			{
				'normal':				'normal',
				'horizontal':			'horizontal',
				'vertical':				'vertical',
				'none':					'none',
			},
			/**
			 * stroke.style
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-78d1.html
			 */
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
	
	// --------------------------------------------------------------------------------
	// # text
	
		text:
		{
			/**
			 * text.textType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7854.html
			 */
			textType:
			{
				'static':				'static',
				'dynamic':				'dynamic',
				'input':				'input',		
			},
			/**
			 * text.lineType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-786a.html
			 */
			lineType:
			{
				'singleLine':			'single line',
				'multiline':			'multiline',
				'multilineNoWrap':		'multiline no wrap',
				'password':				'password',
			},
			/**
			 * text.alignment
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-784e.html
			 */
			alignment:
			{
				'left':					'left',
				'center':				'center',
				'right':				'right',
				'justify':				'justify',
			}
			
		},
	
	// --------------------------------------------------------------------------------
	// # transform
	
		transform:
		{
			/**
			 * transform.align
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e3c.html
			 */
			align:
			{
				'left':					'left',
				'right':				'right',
				'top':					'top',
				'bottom':				'bottom',
				'verticalCenter':		'vertical center',
				'horizontalCenter':		'horizontal center',
			},
			/**
			 * transform.corner
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7de2.html
			 */
			corner:
			{
				'bottomLeft':			'bottom left',
				'bottomRight':			'bottom right',
				'topRight':				'top right',
				'topLeft':				'top left',
				'topCenter':			'top center',
				'rightCenter':			'right center',
				'bottomCenter':			'bottom center',
				'leftCenter':			'left center',
			},
			/**
			 * transform.distribute
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7e1e.html
			 */
			distribute:
			{
				'leftEdge':				'left edge',
				'horizontalCenter':		'horizontal center',
				'rightEdge':			'right edge',
				'topEdge':				'top edge',
				'verticalCenter':		'vertical center',
				'bottomEdge':			'bottom edge',
			}
		},
	
	// --------------------------------------------------------------------------------
	// # video
	
		video:
		{
			/**
			 * video.videoType
			 * @see http://help.adobe.com/en_US/flash/cs/extend/WS5b3ccc516d4fbf351e63e3d118a9024f3f-7a60.html
			 */
			videoType:
			{
				'embeddedVideo':		'embedded video',
				'linkedVideo':			'linked video',
				'video':				'video',
			},
		}
			
}

xjsfl.classes.register('JSFLConstants', JSFLConstants, this);




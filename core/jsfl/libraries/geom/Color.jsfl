// ------------------------------------------------------------------------------------------------------------------------
//
//  ██████       ██
//  ██           ██
//  ██     █████ ██ █████ ████
//  ██     ██ ██ ██ ██ ██ ██
//  ██     ██ ██ ██ ██ ██ ██
//  ██     ██ ██ ██ ██ ██ ██
//  ██████ █████ ██ █████ ██
//
// ------------------------------------------------------------------------------------------------------------------------
// Color

	/**
	 * Color
	 * @overview	Represents, manipulates and converts to and from different colour spaces
	 * @instance	color
	 */

	xjsfl.init(this, ['Class']);
		
	// ----------------------------------------------------------------------------------------------------
	// Class

		/**
		 * Color Utils library
		 * @see			http://www.madebypi.co.uk/labs/colorutils/
		 */

		var aColor =
		{
			init : function (){ this.warn(); },
			toHex : function (){ this.warn(); },
			toRGB : function (){ this.warn(); },
			toXYZ : function (){ this.warn(); },
			toCIELab : function (){ this.warn(); },
			toCIELCh : function (){ this.warn(); },
			toCMY : function (){ this.warn(); },
			toCMYK : function (){ this.warn(); },
			toHSV : function (){ this.warn(); },
			distance : function (destinationColor){
				var a = this.toCIELab();
				var b = destinationColor.toCIELab();
				return Math.sqrt(Math.pow((a.l - b.l),2)+Math.pow((a.a - b.a),2)+Math.pow((a.b-b.b),2));
			},
			websafe : function (){
				var c=new Array('00','CC','33','66','99','FF');
				var palette = [];
				for(i=0;i<6;i++){
				  for(j=0;j<6;j++){
					for(k=0;k<6;k++){
					 palette.push(new Hex(c[i]+c[j]+c[k]));
					}
				  }
				}
				return this.match(palette);
			},
			match : function (palette){
				var distance = null;
				var closest = null;
				for (var i=0; i<palette.length; i++){
					var cdistance = this.distance(palette[i]);
					if (distance == null || cdistance < distance){
						distance = cdistance;
						closest = palette[i];
					}
				}
				return closest[this.toSelf]();
			},
			equal : function(parts, include){
				if (include == null) include = false;
				if (parts < 2) parts = 2;
				var current = this.toCIELCh();
				var distance = 360/parts;
				var palette = [];
				if (include) palette.push(this);
				for (var i=1; i<parts; i++){
					palette.push(new CIELCh(current.l, current.c,current.h+(distance*i))[this.toSelf]());
				}

				return palette;
			},
			split : function(include, distance){
				if (include == null) include = false;
				var current = this.toCIELCh();
				distance = distance || 150;
				var rtn = [
					new CIELCh(current.l, current.c,current.h+distance)[this.toSelf](),
					new CIELCh(current.l, current.c,current.h-distance)[this.toSelf]()
				];
				if (include) rtn.unshift(this);
				return rtn;
			},
			analogous : function(include){
				if (include == null) include = false;
				var current = this.toCIELCh();
				var distance = 30;
				var rtn = [
					new CIELCh(current.l, current.c,current.h+distance)[this.toSelf](),
					new CIELCh(current.l, current.c,current.h-distance)[this.toSelf]()
				];
				if (include) rtn.unshift(this);
				return rtn;
			},
			rectangle : function(sidelength,include){
				if (include == null) include = false;
				var side1 = sidelength;
				var side2 = (360-(sidelength*2))/2;
				var current = this.toCIELCh();
				var rtn = [
					new CIELCh(current.l, current.c,current.h+side1)[this.toSelf](),
					new CIELCh(current.l, current.c,current.h+side1+side2)[this.toSelf](),
					new CIELCh(current.l, current.c,current.h+side1+side2+side1)[this.toSelf]()
				];
				if (include) rtn.unshift(this);
				return rtn;
			},
			range : function (destinationColor, steps,include){
				if (include == null) include = false;
				var a = this.toRGB();
				var b = destinationColor.toRGB();
				var colors = [];
				steps--;
				for (n=1; n<steps;n++){
					var nr = Math.floor(a.r+(n*(b.r-a.r)/steps));
					var ng = Math.floor(a.g+(n*(b.g-a.g)/steps));
					var nb = Math.floor(a.b+(n*(b.b-a.b)/steps));
					colors.push(new RGB(nr,ng,nb)[this.toSelf]());
				}
				if (include) {
					colors.unshift(this);
					colors.push(destinationColor[this.toSelf]());
				}
				return colors;
			},
			greyscale : function (){
				var a = this.toRGB();
				var ds = (Math.max(a.r,a.g,a.b) + Math.min(a.r,a.g,a.b))/2;
				return new RGB(ds,ds,ds)[this.toSelf]();
			},
			hue : function (degreeModifier){
				var a = this.toCIELCh();
				a.h += degreeModifier;
				return a[this.toSelf]();
			},
			saturation : function (satModifier){
				var a = this.toHSV();
				a.s += (satModifier/100);
				a.s = Math.min(1,Math.max(0,a.s));
				return a[this.toSelf]();
			},
			brightness : function (brightnessModifier){
				var a = this.toHSV();
				a.v += (brightnessModifier/100);
				a.v = Math.min(1,Math.max(0,a.v));
				return a[this.toSelf]();
			},
			warn : function (){
				alert('aColor should not be created directly. Treat this as an abstract class.');
			}
		}
		aColor = Class.extend(aColor);

	// ----------------------------------------------------------------------------------------------------
	// Hex

		Hex =
		{
			init : function (hex){
				this.hex = hex;
				if (this.hex.substring(0,1) == '#') this.hex = this.hex.substring(1,7);
			},
			toHex : function (){ return this; },
			toRGB : function (){
				var r = parseInt(this.hex.substring(0,2), 16);
				var g = parseInt(this.hex.substring(2,4), 16);
				var b = parseInt(this.hex.substring(4,6), 16);
					return new RGB(r,g,b);
			},
			toXYZ : function (){
				return this.toRGB().toXYZ();
			},
			toCIELab : function (){
				return this.toXYZ().toCIELab();
			},
			toHSV : function (){
				return this.toRGB().toHSV();
			},
			toCMY : function (){
				return this.toRGB().toCMY();
			},
			toCMYK : function (){
				return this.toCMY().toCMYK();
			},
			toString : function (){
				return this.hex ?  this.hex.toUpperCase() : '';
			},
			toCIELCh : function (){
				return this.toCIELab().toCIELCh();
			},
			toSelf : "toHex"
		}
		Hex = aColor.extend(Hex);

	// ----------------------------------------------------------------------------------------------------
	// RGB

		RGB =
		{
			init : function (r,g,b){
				this.r = Math.min(255,Math.max(r,0));
				this.g = Math.min(255,Math.max(g,0));
				this.b = Math.min(255,Math.max(b,0));
			},
			toHex : function (){
				var rgbcols = [this.r,this.g,this.b];
				var hex = '';
				for (i=0;i<rgbcols.length;i++){
				  var chara = "0123456789ABCDEF";
				  hex += chara.charAt(Math.floor(rgbcols[i] / 16)) + chara.charAt(rgbcols[i] - (Math.floor(rgbcols[i] / 16) * 16));
				}

				return new Hex(hex);
			},
			toRGB : function (){ return this; },
			toXYZ : function (){
				var tmp_r = this.r/255;
				var tmp_g = this.g/255;
				var tmp_b = this.b/255;
				if(tmp_r > 0.04045) {
				  tmp_r = Math.pow(((tmp_r + 0.055) / 1.055),2.4)
				}else {
				  tmp_r = tmp_r / 12.92;
				}
				if(tmp_g > 0.04045) {
				  tmp_g = Math.pow(((tmp_g + 0.055) / 1.055), 2.4)
				}else {
				  tmp_g = tmp_g / 12.92
				}
				if(tmp_b > 0.04045) {
				  tmp_b = Math.pow(((tmp_b + 0.055) / 1.055), 2.4);
				}else {
				  tmp_b = tmp_b / 12.92
				}
				tmp_r = tmp_r * 100
				tmp_g = tmp_g * 100
				tmp_b = tmp_b * 100
				var x = tmp_r * 0.4124 + tmp_g * 0.3576 + tmp_b * 0.1805;
				var y = tmp_r * 0.2126 + tmp_g * 0.7152 + tmp_b * 0.0722;
				var z = tmp_r * 0.0193 + tmp_g * 0.1192 + tmp_b * 0.9505;
				return new XYZ(x,y,z);
			},
			toCIELab : function (){
				return this.toXYZ().toCIELab();
			},
			toHSV : function (){
				var var_R = (this.r / 255);
				var var_G = (this.g / 255);
				var var_B = (this.b / 255);

				var var_Min = Math.min( var_R, var_G, var_B );
				var var_Max = Math.max( var_R, var_G, var_B );
				var del_Max = var_Max - var_Min;

				var V = var_Max;

				if ( del_Max == 0 )
				{
				   var H = 0
				   var S = 0
				}
				else
				{
				   var S = del_Max / var_Max

				   var del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max
				   var del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max
				   var del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max

				   if      ( var_R == var_Max ) H = del_B - del_G
				   else if ( var_G == var_Max ) H = ( 1 / 3 ) + del_R - del_B
				   else if ( var_B == var_Max ) H = ( 2 / 3 ) + del_G - del_R

				   if ( H < 0 )  H += 1;
				   if ( H > 1 )  H -= 1;
				}
				return new HSV(H,S,V);
			},
			toCMY : function (){
				var C = 1 - ( this.r / 255 );
				var M = 1 - ( this.g / 255 );
				var Y = 1 - ( this.b / 255 );
				return new CMY(C,M,Y);
			},
			toCMYK : function (){
				return this.toCMY().toCMYK();
			},
			toString : function (){
				return this.r+','+this.g+','+this.b;
			},
			toCIELCh : function (){
				return this.toCIELab().toCIELCh();
			},
			toSelf : "toRGB"
		}
		RGB = aColor.extend(RGB);

	// ----------------------------------------------------------------------------------------------------
	// XYZ

		XYZ =
		{
			init : function (x,y,z){
				this.x = x;
				this.y = y;
				this.z = z;
			},
			toHex : function (){
				return this.toRGB().toHex();
			},
			toRGB : function (){
				var var_X = this.x / 100;
				var var_Y = this.y / 100;
				var var_Z = this.z / 100;

				var var_R = var_X *  3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
				var var_G = var_X * -0.9689 + var_Y *  1.8758 + var_Z *  0.0415;
				var var_B = var_X *  0.0557 + var_Y * -0.2040 + var_Z *  1.0570;

				if (var_R > 0.0031308) {
					var_R = 1.055 * Math.pow(var_R,(1/2.4)) - 0.055;
				}else {
					var_R = 12.92 * var_R;
				}
				if (var_G > 0.0031308){
					var_G = 1.055 * Math.pow(var_G,(1/2.4)) - 0.055;
				}else {
					var_G = 12.92 * var_G;
				}
				if (var_B > 0.0031308){
					var_B = 1.055 * Math.pow(var_B,(1/2.4)) - 0.055;
				}else {
					var_B = 12.92 * var_B;
				}
				var r = Math.round(var_R * 255);
				var g = Math.round(var_G * 255);
				var b = Math.round(var_B * 255);

				return new RGB(r,g,b);
			},
			toXYZ : function (){ return this; },
			toCIELab : function (){

				var Xn =  95.047;
				var Yn = 100.000;
				var Zn = 108.883;

				var x = this.x / Xn;
				var y = this.y / Yn;
				var z = this.z / Zn;

				if (x > 0.008856){
					x = Math.pow(x, 1/3);
				}else {
					x = (7.787 * x) + (16 / 116);
				}
				if (y > 0.008856){
					y = Math.pow(y, 1 / 3);
				}else {
					y = (7.787 * y) + (16 / 116);
				}
				if (z > 0.008856){
					z = Math.pow(z, 1 / 3);
				}else {
					z = (7.787 * z) + (16 / 116);
				}

				if (y>0.008856){
					var l = (116 * y) - 16;
				}else {
					var l=903.3*y;
				}
				var a = 500 * (x - y);
				var b = 200 * (y - z);

				return new CIELab(l, a, b);
			},
			toHSV : function (){
				return this.toRGB().toHSV();
			},
			toCMY : function (){
				return this.toRGB().toCMY();
			},
			toCMYK : function (){
				return this.toCMY().toCMYK();
			},
			toCIELCh : function (){
				return this.toCIELab().toCIELCh();
			},
			toString : function (){
				return this.x+','+this.y+','+this.z;
			},
			toSelf : "toXYZ"
		}
		XYZ = aColor.extend(XYZ);

	// ----------------------------------------------------------------------------------------------------
	// CIELab

		CIELab =
		{
			init : function (l,a,b){
				this.l = l;
				this.a = a;
				this.b = b;
			},
			toHex : function (){
				return this.toRGB().toHex();
			},
			toRGB : function (){
				return this.toXYZ().toRGB();
			},
			toXYZ : function (){
				var ref_X =  95.047;
				var ref_Y = 100.000;
				var ref_Z = 108.883;

				var var_Y = (this.l + 16 ) / 116;
				var var_X = this.a / 500 + var_Y;
				var var_Z = var_Y - this.b / 200;

				if (Math.pow(var_Y,3) > 0.008856){
					var_Y = Math.pow(var_Y,3);
				}else {
					var_Y = (var_Y - 16 / 116) / 7.787;
				}
				if(Math.pow(var_X,3) > 0.008856){
					var_X = Math.pow(var_X,3);
				}else {
					var_X = (var_X - 16 / 116) / 7.787;
				}
				if (Math.pow(var_Z,3) > 0.008856){
					var_Z = Math.pow(var_Z,3);
				}else {
					var_Z = (var_Z - 16 / 116) / 7.787;
				}
				var x = ref_X * var_X;
				var y = ref_Y * var_Y;
				var z = ref_Z * var_Z;
				return new XYZ(x,y,z);
			},
			toCIELab : function (){
				return this;
			},
			toHSV : function (){
				return this.toRGB().toHSV();
			},
			toCMY : function (){
				return this.toRGB().toCMY();
			},
			toCMYK : function (){
				return this.toCMY().toCMYK();
			},
			toCIELCh : function (){
				var var_H = Math.atan2( this.b, this.a );

				if ( var_H > 0 ) {
					var_H = ( var_H / Math.PI ) * 180;
				}else{
					var_H = 360 - ( Math.abs( var_H ) / Math.PI ) * 180
				}

				var l = this.l;
				var c = Math.sqrt(Math.pow(this.a,2) + Math.pow(this.b,2));
				var h = var_H;

				return new CIELCh(l,c,h);
			},
			toString : function (){
				return this.l+','+this.a+','+this.b;
			},
			toSelf : "toCIELab"
		}
		CIELab = aColor.extend(CIELab);

	// ----------------------------------------------------------------------------------------------------
	// HSV

		HSV =
		{
			init : function (h,s,v){
				this.h = h;
				this.s = s;
				this.v = v;
			},
			toHex : function (){
				return this.toRGB().toHex();
			},
			toRGB : function (){
				if (this.s == 0)
				{
				   var R = this.v * 255
				   var G = this.v * 255
				   var B = this.v * 255
				}
				else
				{
				   var var_r, var_g, var_b;
				   var var_h = this.h * 6
				   if ( var_h == 6 ) var_h = 0
				   var var_i = Math.floor( var_h )
				   var var_1 = this.v * ( 1 - this.s )
				   var var_2 = this.v * ( 1 - this.s * ( var_h - var_i ) )
				   var var_3 = this.v * ( 1 - this.s * ( 1 - ( var_h - var_i ) ) )

				   if      ( var_i == 0 ) { var_r = this.v     ; var_g = var_3 ; var_b = var_1 }
				   else if ( var_i == 1 ) { var_r = var_2 ; var_g = this.v     ; var_b = var_1 }
				   else if ( var_i == 2 ) { var_r = var_1 ; var_g = this.v     ; var_b = var_3 }
				   else if ( var_i == 3 ) { var_r = var_1 ; var_g = var_2 ; var_b = this.v     }
				   else if ( var_i == 4 ) { var_r = var_3 ; var_g = var_1 ; var_b = this.v     }
				   else                   { var_r = this.v     ; var_g = var_1 ; var_b = var_2 }

				   var R = var_r * 255
				   var G = var_g * 255
				   var B = var_b * 255
				}
				return new RGB(R,G,B);
			},
			toXYZ : function (){
				return this.toRGB().toXYZ();
			},
			toCIELab : function (){
				return this.toRGB().toCIELab();
			},
			toHSV : function (){
				return this;
			},
			toCMY : function (){
				return this.toRGB().toCMY();
			},
			toCMYK : function (){
				return this.toCMY().toCMYK();
			},
			toCIELCh : function (){
				return this.toCIELab().toCIELCh();
			},
			toString : function (){
				return this.h+','+this.s+','+this.v;
			},
			toSelf : "toHSV"

		}
		HSV = aColor.extend(HSV);

	// ----------------------------------------------------------------------------------------------------
	// CMY

		CMY =
		{
			init : function (c,m,y){
				this.c = c;
				this.m = m;
				this.y = y;
			},
			toHex : function (){
				return this.toRGB().toHex();
			},
			toRGB : function (){
				var R = ( 1 - this.c ) * 255;
				var G = ( 1 - this.m ) * 255;
				var B = ( 1 - this.y ) * 255;
				return new RGB(R,G,B);
			},
			toXYZ : function (){
				return this.toRGB().toXYZ();
			},
			toCIELab : function (){
				return this.toRGB().toCIELab();
			},
			toCMY : function (){
				return this;
			},
			toCMYK : function (){
				var var_K = 1

				if ( this.c < var_K )   var_K = this.c;
				if ( this.m < var_K )   var_K = this.m;
				if ( this.y < var_K )   var_K = this.y;
				if ( var_K == 1 ) {
				   var C = 0;
				   var M = 0;
				   var Y = 0;
				}
				else {
				   var C = ( this.c - var_K ) / ( 1 - var_K );
				   var M = ( this.m - var_K ) / ( 1 - var_K );
				   var Y = ( this.y - var_K ) / ( 1 - var_K );
				}
				var K = var_K;
				return new CMYK(C,M,Y,K);
			},
			toCIELCh : function (){
				return this.toCIELab().toCIELCh();
			},
			toString : function (){
				return this.c+','+this.m+','+this.y;
			},
			toSelf : "toCMY"
		}
		CMY = aColor.extend(CMY);

	// ----------------------------------------------------------------------------------------------------
	// CMYK

		CMYK =
		{
			init : function (c,m,y,k){
				this.c = c;
				this.m = m;
				this.y = y;
				this.k = k;
			},
			toHex : function (){
				return this.toRGB().toHex();
			},
			toRGB : function (){
				return this.toCMY().toRGB();
			},
			toXYZ : function (){
				return this.toRGB().toXYZ();
			},
			toCIELab : function (){
				return this.toRGB().toCIELab();
			},
			toCMY : function (){
				var C = ( this.c * ( 1 - this.k ) + this.k );
				var M = ( this.m * ( 1 - this.k ) + this.k );
				var Y = ( this.y * ( 1 - this.k ) + this.k );
				return new CMY(C,M,Y);
			},
			toCMYK : function (){
				return this;
			},
			toCIELCh : function (){
				return this.toCIELab().toCIELCh();
			},
			toString : function (){
				return this.c+','+this.m+','+this.y+','+this.k;
			},
			toSelf : "toCMYK"
		}
		CMYK = aColor.extend(CMYK);

	// ----------------------------------------------------------------------------------------------------
	// CIELCh

		CIELCh =
		{
			init : function (l,c,h){
				this.l = l;
				this.c = c;
				this.h = h<360?h:(h-360);
			},
			toHex : function (){
				return this.toCIELab().toHex();
			},
			toRGB : function (){
				return this.toCIELab().toRGB();
			},
			toXYZ : function (){
				return this.toCIELab().toXYZ();
			},
			toCIELab : function (){
				var l = this.l;
				var hradi = this.h * (Math.PI/180);
				var a = Math.cos(hradi) * this.c;
				var b = Math.sin(hradi) * this.c;
				return new CIELab(l,a,b);
			},
			toHSV : function (){
				return this.toCIELab().toHSV();
			},
			toCMY : function (){
				return this.toCIELab().toCMY();
			},
			toCMYK : function (){
				return this.toCIELab().toCMYK();
			},
			toString : function (){
				return this.l + ','+this.c +','+this.h;
			},
			toCIELCh : function (){
				return this;
			},
			toSelf : "toHex"
		}
		CIELCh = aColor.extend(CIELCh);

	// ----------------------------------------------------------------------------------------------------
	// Register classes

		if(xjsfl && xjsfl.classes)
		{
			xjsfl.classes.register('Hex', Hex);
			xjsfl.classes.register('RGB', RGB);
			xjsfl.classes.register('XYZ', XYZ);
			xjsfl.classes.register('HSV', HSV);
			xjsfl.classes.register('CMY', CMY);
			xjsfl.classes.register('CMYK', CMYK);
			xjsfl.classes.register('CIELab', CIELab);
			xjsfl.classes.register('CIELCh', CIELCh);
		}
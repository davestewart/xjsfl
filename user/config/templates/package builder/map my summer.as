import com.google.maps.Map;
import com.google.maps.overlays.Marker;
import com.google.maps.overlays.Polyline;

import flash.display.Sprite;
import flash.display.MovieClip;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.text.TextField;

import data.vo.ValueObject;

import display.views.View;


assets:Sprite
	fla
		preloader.fla
		animation.fla
	psd
	images
	fonts
		
bin
	
lib

src

	constants=static
		Keys=static
		Colors
		
	geom
		Donut
		Bounds
			
	data
		generators=static
		models:EventDispatcher
		parsers
		services
			proxy
		vo:ValueObject
			Partner
			Group
			Single
			User
			ValueObject
			
	display:Sprite
			
		components
		
			preloader
				Preloader
	
			maps
				map
					GoogleMap:Map;
					
				events:Event=event
					MapEvent
					
				overlays
					lines
						Line:Polyline
					hotspots
						Hotspot
						HotspotGroup
						Tooltip
					markers:BaseMarker
						BaseMarker:Marker
						Partner
						Group
						Single
					videos
						VideoThumbnail
						
			media
				video
					player
				
		forms
			Form
			
		shapes
			Donut
			
		text
			TextField:TextField;
			TextUtils=static

		ui:UIComponent
			UIComponent:Sprite
			buttons:BaseButton
				BaseButton:Sprite
				SquareButton
				HeaderButton
				TextButton
				ZoomButton
				
			dateslider
				DateSlider
				Track
				Thumb
				
			menus/IMenuElement
				IMenuElement
				MenuGroup
				MenuItem
				
			scrollbar
				Track
				Thumb
				
			tabs
				TabGroup
				Tab
				
		views:View
			base
				View:Sprite
				ModalView
			app
				MapView
				
				
		
	external
		loaders
		
	utils
	
swc
	
test
	test 1
	test 2
	test 3
	
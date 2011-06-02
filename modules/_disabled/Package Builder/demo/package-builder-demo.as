// run me to see the package output!

import flash.display.SimpleButton;
import flash.display.Sprite;
import flash.events.Event;

import com.google.maps.overlays.Marker;
import com.rehabstudio.mapMySummer.view.components.youTubePlayer.YouTubePlayer;

import interfaces.IFoo
import interfaces.IBar

display:Sprite
	elements
	BaseSprite:Sprite/IFoo,IBar=display
		Button:SimpleButton
	maps
		markers:Marker
			Group
			Single
	media
		Player:YouTubePlayer
		
interfaces
	IFoo
	IBar

events:Event
	TestEvent
	
utils=static
	ObjectUtils
	MathUtils
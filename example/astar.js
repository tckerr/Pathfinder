//constants
var BLOCK_SIZE = 16;
var AREAWIDTH_PX = 704;
var AREAHEIGHT_PX = 420;
var walls = new Array([]);
var set_start = {};
var set_end = {};
var menustate = 0;
var mdown = false;
var pfc = {};
var pfn_incr = 0;
var nodes = [];

//calculated vars
var AREAWIDTH_BLOCK = AREAWIDTH_PX/BLOCK_SIZE;
var AREAHEIGHT_BLOCK = AREAHEIGHT_PX/BLOCK_SIZE;

$(document).ready(function(){
	
	//INIT
	{
	init();
	
	//disable right click
	$('#playable-area').on('contextmenu', function(e){ return false; });
	}
	
	//BINDS & BUTTONS 
	{
	
	$("#overlay-button").click(function(){
		$("#overlay").fadeOut();
	});
	$("#helpme").click(function(){
		$("#overlay").fadeIn();
	});	
	$("#setstart").click(function(){
		changeMenuState(1);
	});
	$("#setend").click(function(){
		changeMenuState(2);
	});
	$("#drawwalls").click(function(){
		changeMenuState(3);
	});
	$("#clearall").click(function(){
		clearAll();
	});
	$("#clearwall").click(function(){
		clearWalls();
		getNewPathLite();
	});
	
	//menu binds
	$(document).keypress(function(e) {
		switch (e.which) {
			case 49: //1
				changeMenuState(1);
				break;
			case 50: //2
				changeMenuState(2);	
				break;
			case 51:
				changeMenuState(3);
				break;
			case 32:
				getNewPath();
				break;
		}
	});
	}
	
	//
	//check for draw walls
	$('.block').mouseenter(function(event){
		if ( menustate === 3 ){
			if (mdown && event.which == 1) {
				buildWall($(this));				
			} else if (mdown && event.which == 3) {
				removeWall($(this));
			} 
		}
	});
		
	//adding blocks
	$('.block').mousedown(function(event) {
		if (event.which == 1) {
			if ( menustate === 1 ){
				setStart($(this));
			} else if ( menustate === 2 ) {
				setEnd($(this));
			} else if ( menustate === 3 ){
				buildWall($(this));
			}
		} else if ( event.which == 3 ){
			removeWall($(this));
		}
	});
	
});

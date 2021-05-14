"use strict";

let map = [];
let set_start_position = false;
const MAP_SIZE = 15;

let front_current_x;
let front_current_y;
let has_front = true;
let pass_current_x;
let pass_current_y;

let map_stack = [];
let rand_array = [];

///////////////////////////////////////////
// MAP LOAD
///////////////////////////////////////////

function map_load(){

	// class constructor
	class map_gen {
  		constructor(type, frontier, current, id){
    	this.type = type; // free, block
    	this.frontier = frontier; // off, on, checked
    	this.current = current;
    	this.id = id;
  		}
	}

	// map object array creation
	for(var i = 0; i < MAP_SIZE; i++){
			map[i] = []
		for(var j = 0; j < MAP_SIZE; j++){
			let id = 'id'+i+'_'+j+'';
			map[i][j] = new map_gen("none", "off", "off", id);

			//let rand = Math.floor(Math.random() * 3);

			//if (rand > 0) {
			//	map[i][j].type = "free"; 
			//}
			//if (rand == 0) {
				map[i][j].type = "block"; 
			//}
		}
	}

	// FUNC*** add frontier
	function add_frontier(y,x){
		if (x < 0 || y < 0 || y > MAP_SIZE-1 || x > MAP_SIZE-1){
			return false;
		} else if(map[y][x].type == "block") {
			map[y][x].frontier = "on"; 
		}
	}

	// FUNC*** call add frontier
	function call_add_frontier(){
	add_frontier(pass_current_y-3,pass_current_x); add_frontier(pass_current_y,pass_current_x-3); 
	add_frontier(pass_current_y,pass_current_x+3); add_frontier(pass_current_y+3,pass_current_x);
	}

	// FUNC*** randon frontier
	function random_frontier(){
		rand_array = [];
		for(var y = 0; y < MAP_SIZE; y++){
			for(var x = 0; x < MAP_SIZE; x++){	
				if (map[y][x].frontier == "on"){
					rand_array.push([]);
					rand_array[rand_array.length-1][0] = y;
					rand_array[rand_array.length-1][1] = x;
					map[y][x].frontier = "off";
				}	
			}
		}
		if (rand_array.length > 0){
			let rand = Math.floor(Math.random() * rand_array.length);
			front_current_y = rand_array[rand][0];
			front_current_x = rand_array[rand][1];

			map[front_current_y][front_current_x].type = "free";

			// stack feed
			map_stack.unshift([]);
			map_stack[0][0] = front_current_y;
			map_stack[0][1] = front_current_x;

			// making block free - top - left - right - bottom
			if (front_current_y < pass_current_y){
				add_neibor(pass_current_y-1,pass_current_x); 
				add_neibor(pass_current_y-2,pass_current_x); 
			} else if (front_current_x < pass_current_x){ 
				add_neibor(pass_current_y,pass_current_x-1);
				add_neibor(pass_current_y,pass_current_x-2);
			} else if (front_current_x > pass_current_x){
				add_neibor(pass_current_y,pass_current_x+1);
				add_neibor(pass_current_y,pass_current_x+2);
			} else if (front_current_y > pass_current_y){
				add_neibor(pass_current_y+1,pass_current_x);
				add_neibor(pass_current_y+2,pass_current_x);
			}
		}
	}

	// FUNC*** add neibour
	function add_neibor(y,x){
		map[y][x].type = "free";
	}

	// FUNC*** set pass current
	function set_pass(){
		pass_current_y = map_stack[0][0];
		pass_current_x = map_stack[0][1];
	}

	// select start position 
	map[4][4].current = "on"; 
	pass_current_y = 4;
	pass_current_x = 4;
	map[4][4].type = "free"; // FAZER ISSO DEPOIS NOS OUTROS

	// stack feed
	map_stack.unshift([]);
	map_stack[0][0] = pass_current_y;
	map_stack[0][1] = pass_current_x;

	// adding first frontier set
	// top // left // right // bottom
	call_add_frontier()

	// pick random frontier
	random_frontier();

	// set pass_current
	set_pass();

	// loop	
	while(map_stack.length > 0){

		// top // left // right // bottom
		call_add_frontier();

		// new current frontier
		random_frontier();

		while(rand_array.length == 0 && map_stack.length > 0){
			map_stack.shift();

			if (map_stack.length > 0){
			pass_current_y = map_stack[0][0];
			pass_current_x = map_stack[0][1];

			// top // left // right // bottom
			call_add_frontier();

			// new current frontier
			random_frontier();
			}
		}

		// set pass_current
		if (map_stack.length > 0){
			set_pass();
		}

	}// END WHILE

//////////////////////////////////////////////////////////////
// BLOCKS DRAW
/////////////////////////////////////////////////////////////

	// select main div
	let main = document.querySelector('.main');

	for(var i = 0; i < MAP_SIZE; i++){
		for(var j = 0; j < MAP_SIZE; j++){

			function id_name(ttype){return 'map_grid '+ttype+' id'+i+'-'+j+''}

			if (map[i][j].type == "free") {
				let div = document.createElement('div');
				div.className = id_name("mg_free");

				// select player first position
				if (map[i][j].current == "on") {
					div.className = id_name("mg_current");
				} 

				main.appendChild(div);
			}
			if (map[i][j].type == "block") {
				let div = document.createElement('div');
				div.className = id_name("mg_block");
				main.appendChild(div);
			}
		}
	}// END

} // function END
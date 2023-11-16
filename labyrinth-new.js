/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(' ');
const R = parseInt(inputs[0]); // number of rows.
const C = parseInt(inputs[1]); // number of columns.
const A = parseInt(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.

var startingPoint = undefined; // [row,col]
var maze;

var visitedMaze = []; // maze to store walkable neighbors
for(let i = 0; i < R; i++){
    visitedMaze.push([]);
    for(let j = 0; j < C; j++){
        visitedMaze[i].push([]);
    }
}


var walkedWay = []; // stores moves to get to the controllroom

var deadend = false; // boolean to check if you are in a deadend
var queue = []; // stores way since last cross walk, reverse to get out of deadends


var finishedScanning = false; //if maze is completly scanned or there are no more new moves to explore
var goBack = false; //boolean to initialize way back to start 




var PathfindingMaze = []; //maze with 0 and 1s to use pathfinding
var wayHome = []; // array of moves to get back to the start

const directions = [ //array to use index to get the corresponding move Command
    "UP",
    "RIGHT",
    "DOWN",
    "LEFT"
]


// game loop
while (true) {
    var inputs = readline().split(' ');
    const KR = parseInt(inputs[0]); // row where Rick is located.
    const KC = parseInt(inputs[1]); // column where Rick is located.
 
    if(!startingPoint) startingPoint = [KR, KC];
    
 
 
    maze = []; //clears maze to write updated version
    for (let i = 0; i < R; i++) {
        maze.push(readline()); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).
    }
 


     //check if complete maze is scanned
     if(!finishedScanning){ 
        var tempIndex = 0;
        for(let i = 0; i < maze.length; i++){
            if(!maze[i].includes("?")){
                tempIndex++;
            } 
        }
        if(tempIndex == maze.length){
            console.error("done");
            finishedScanning = true;
            CreateWorkableMaze();
        }
    }

    //check if queue is empty and if there are unexplored cells next to the current
    if(!queue.length && walkedWay.length > 0 && !visitedMaze[KR][KC].includes(true)){
        finishedScanning = true;
        CreateWorkableMaze();
    }
 


    //at first check if the "goBack" flag is true, to walk back to the starting position
    if(goBack){
        WayBack(KR,KC);
        continue;
    }

    //then check if the current cell is the controllroom
    if(maze[KR][KC] == "C"){
        wayHome = Pathfinding([KR,KC], startingPoint); 
        wayHome.shift(); //removes first element, to get the first move (first element is the current position)
        
        goBack = true;
        WayBack(KR,KC);
       
        continue;
    } 
    
    // then check if the complete maze is scanned or if no moves are legal -> then walk to the controllroom
    if(finishedScanning){
        GoToC(KR,KC);
        continue;
    }

    // check if current Cell was walked before, if not, put walkable neighbors in array of booleans [up, rigth, down, left]
    if(!visitedMaze[KR][KC].length){
        visitedMaze[KR][KC] = ScanNeigbors(KR, KC);
    }   

    // if the current cell has walkable and unexplored neigbors, then deadend gets set to false
    if(visitedMaze[KR][KC].includes(true)){
        deadend = false;
    }

    // if deadend is true, walk back until the is a new path to explore
    if(deadend){
        goBackUntilCrosswalk() // go back walked path until you are at a crosswalk
        continue;
    }
    
    
    var walkTo = visitedMaze[KR][KC].indexOf(true); // gets index of walkable neighbor (0 = up, 1 = rigth...)
    if(walkTo != -1){ // if val == -1 means that there is no walkable neighbor 
        visitedMaze[KR][KC][walkTo] = false; // sets neighbor as not walkable from the current node
        
        queue.push(directions[walkTo]); 
        walkedWay.push(directions[walkTo]); 
        console.log(directions[walkTo]); // go to walkable direction
    } else {
        // no walkable direction... walk back until at a crosswalk
        deadend = true;
        goBackUntilCrosswalk()
    }
}










//check if location is in the boundry of the maze
function IsOnMap(localR, localC){
    if(localR > 0 && localR < R && localC > 0 && localC < C ){
        return true;
    }
 
    return false;
}
 


//check if a specific local is viabale to walk to
function IsWalkPossible(localR, localC){
     
    if(!IsOnMap(localR,localC)){
        return false;
    }
 
    if(maze[localR][localC] == "#"){
        return false;
    }
 
    if(!finishedScanning && maze[localR][localC] == "C"){ // while exploring cells, the controllroom is counted as not viable
        return false;
    }
 
    if(visitedMaze[localR][localC].length){ //if the cell was entered before, then it is not viable for the exploring
        return false;
    }
 
    return true;
}
 


//scanes every neigbor of a cell to check if its viable - returns array of booleans[up, rigth, down, left] 
function ScanNeigbors(localR, localC){
    return [
        IsWalkPossible(localR - 1, localC), //up
        IsWalkPossible(localR, localC  + 1), //rigth
        IsWalkPossible(localR + 1, localC), //down
        IsWalkPossible(localR, localC - 1), //left
    ];
}
 


//goes back to the last crosswalk-cell to check a new node
function goBackUntilCrosswalk(){
    var goTo = queue.pop(); // get last step and delete from que
     
    //reverse last step
    console.error(queue);
    if(goTo == "UP"){
        walkedWay.push("DOWN");
        console.log("DOWN");
    } else if(goTo == "DOWN"){
        walkedWay.push("UP");
        console.log("UP");
    } else if(goTo == "RIGHT"){
        walkedWay.push("LEFT");
        console.log("LEFT");
    } else {
        walkedWay.push("RIGHT");
        console.log("RIGHT");
    }
}
 


//follows the path home
function WayBack(localR, localC){
    const temp = wayHome.shift(); //get current step and shifts remaining array
    const _R = temp[0];
    const _L = temp[1];

    //translates position to Command
    if(_R > localR){
      console.log("DOWN");  
    } else if(_R < localR){
        console.log("UP"); 
    } else if(_L > localC){
        console.log("RIGHT"); 
    } else {
        console.log("LEFT"); 
    }
}
 
 
//walks back until the controllroom is a neighbor  
function GoToC(localR, localC){
    //checks if neighbor is controllroom
    if(NeighborIsC(localR + 1, localC)){
        console.log("DOWN");
    } else if(NeighborIsC(localR - 1, localC)){
        console.log("UP");
    } else if(NeighborIsC(localR, localC + 1)){
        console.log("RIGHT");
    } else if(NeighborIsC(localR, localC - 1)){
        console.log("LEFT");
    } else { 
        InverseWalk(walkedWay.pop()); //walks back by getting and removing the last element of the walked way
    }
}
 

//check if Cell is the Controllroom
function NeighborIsC(localR, localC){
    if(IsOnMap(localR,localC)){
        if(maze[localR][localC] == "C"){
            return true
        }
    }
    return false;
}
 


//inverse input, to reverse last steps
function InverseWalk(_input){
    if(_input == "UP"){
        console.log("DOWN");
    } else if(_input == "DOWN"){
        console.log("UP");
    } else if(_input == "RIGHT"){
        console.log("LEFT");
    } else {
        console.log("RIGHT");
    }
} 


// create Maze with 0s and 1s to use Pathfinding
function CreateWorkableMaze(){
    for(let i = 0; i < R; i++){
        PathfindingMaze.push([]);
        for(let j = 0; j < C; j++){
            if(maze[i][j] == "#"){
                PathfindingMaze[i].push(1);
            } else {
                PathfindingMaze[i].push(0);
            }
        }
    }
}




//Pathfinding whichery
function Pathfinding(position, end) {
    var queue = [];
  
    PathfindingMaze[position[0]][position[1]] = 1;
    queue.push([position]); 
  
    while (queue.length > 0) {
      var path = queue.shift(); 
      var pos = path[path.length-1];
      var direction = [
        [pos[0] + 1, pos[1]],
        [pos[0], pos[1] + 1],
        [pos[0] - 1, pos[1]],
        [pos[0], pos[1] - 1]
      ];
  
      for (var i = 0; i < direction.length; i++) {
        if (direction[i][0] == end[0] && direction[i][1] == end[1]) {
          return path.concat([end]); 
        }
        
        if (direction[i][0] < 0 || direction[i][0] >= PathfindingMaze.length 
            || direction[i][1] < 0 || direction[i][1] >= PathfindingMaze[0].length 
            || PathfindingMaze[direction[i][0]][direction[i][1]] != 0) { 
          continue;
        }
  
        PathfindingMaze[direction[i][0]][direction[i][1]] = 1;
        queue.push(path.concat([direction[i]])); 
      }
    }
}
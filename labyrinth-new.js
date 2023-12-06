var inputs = readline().split(' ');
const R = parseInt(inputs[0]); // number of rows.
const C = parseInt(inputs[1]); // number of columns.
const A = parseInt(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.

var startingPoint = undefined; // [row,col]
var maze;

var visitedMaze = []; // maze to store walkable neighbors for dfs
for(let i = 0; i < R; i++){
    visitedMaze.push([]);
    for(let j = 0; j < C; j++){
        visitedMaze[i].push([]);
    }
}


var deadend = false; // boolean to check if you are in a deadend
var queue = []; // stores way since last cross walk, reverse to get out of deadends


var finishedScanning = false; //if maze is completly scanned or there are no more new moves to explore
var goBackToStart = false; //boolean to initialize way back to start 


var PathfindingMaze = []; //maze with 0 and 1s to use pathfinding
var wayToC = []; // array of moves to get to the controllroom
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
 
 
    maze = []; //clears maze to write updated version
    for (let i = 0; i < R; i++) {
        maze.push(readline()); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).
    }
 

   //check if complete maze is scanned
   if(!finishedScanning){ 
       CheckForFinishedScanning(KR,KC);
   }

   if(!startingPoint) startingPoint = [KR, KC];

    //at first check if the "goBackToStart" flag is true, to walk back to the starting position
    if(goBackToStart){
       WayBack(KR,KC, wayHome);
       continue;
    }


    //then check if the current cell is the controllroom
    if(maze[KR][KC] == "C"){
        CreateWorkableMaze();
        wayHome = Pathfinding([KR,KC], startingPoint); 
        wayHome.shift(); //removes first element, to get the first move (first element is the current position)
         
        goBackToStart = true;
        WayBack(KR,KC, wayHome);
        
        continue;
    } 


    // then check if the complete maze is scanned or if no moves are legal -> then walk to the controllroom
    if(finishedScanning){
        WayBack(KR,KC, wayToC);
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
    
    // walk to next cell
    var walkTo = visitedMaze[KR][KC].indexOf(true); // gets index of walkable neighbor (0 = up, 1 = rigth...)
    if(walkTo != -1){ // if val == -1 means that there is no walkable neighbor 
        visitedMaze[KR][KC][walkTo] = false; // sets neighbor as not walkable from the current cell
        
        queue.push(directions[walkTo]); 
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


//check if a specific cell is viabale to walk to
function IsWalkPossible(localR, localC){
     
    if(!IsOnMap(localR,localC)){ return false; }
 
    if(maze[localR][localC] == "#" || maze[localR][localC] == "C") { return false; }// while exploring cells, the controllroom is counted as not viable
 
    if(visitedMaze[localR][localC].length){ //if the cell was entered before, then it is not viable for the exploring
       return false;
    }
 
    return true;
}
 

//scanes every neigbor of a cell to check if its viable to walk to - returns array of booleans[up, rigth, down, left] 
function ScanNeigbors(localR, localC){
    return [
        IsWalkPossible(localR - 1, localC), //up
        IsWalkPossible(localR, localC  + 1), //rigth
        IsWalkPossible(localR + 1, localC), //down
        IsWalkPossible(localR, localC - 1), //left
    ];
}
 

//goes back to the last crosswalk-cell to check a new path
function goBackUntilCrosswalk(){
   var goTo = queue.pop(); // get last step and delete from que
   InverseWalk(goTo);
}
 

//check if complete maze is scanned -> initiate walk to controllroom
function CheckForFinishedScanning(KR,KC){
  
   // checks if there are no more "?" in the maze
   var tempIndex = 0; 
   for(let i = 0; i < maze.length; i++){ 
       if(!maze[i].includes("?")){
           tempIndex++;
       } 
   }

   if(tempIndex == maze.length){
       finishedScanning = true;
   }
   
   //check if queue is empty and if there are unexplored cells next to the current 
   if(!queue.length && !visitedMaze[KR][KC].includes(true) && startingPoint){
       finishedScanning = true;
   }
    
   var posC = [0,0]; //search for C in maze 
   if(finishedScanning){
       for(let i = 0; i < R; i++){
           for(let j = 0; j < C; j++){
               if(maze[i][j] == "C"){
                   posC = [i,j];
               }
           }
       }
       CreateWorkableMaze(); 
       wayToC = Pathfinding([KR,KC], posC); //sets path to the controllroom
       wayToC.shift(); // removes first element (first element is current position)
   }
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


//follows the path to the starting position or controllroom
function WayBack(localR, localC, _array){
    const temp = _array.shift(); //get current step and shifts remaining array
    const _R = temp[0];
    const _L = temp[1];

    //translates position to move command
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
 

// create Maze with 0s and 1s to use Pathfinding
function CreateWorkableMaze(){
   PathfindingMaze = [];
    for(let i = 0; i < R; i++){
        PathfindingMaze.push([]);
        for(let j = 0; j < C; j++){
            PathfindingMaze[i].push(maze[i][j]);
            
        }
    }
}


//Pathfinding Algorythm (BFS) to get shortes way between 2 points
function Pathfinding(start, goal) {
    var queue = [];
  
    PathfindingMaze[start[0]][start[1]] = 1; //sets starting position to not walkable
    queue.push([start]); //puts start pos to queue
  
    while (queue.length > 0) {
      var path = queue.shift(); //gets first element from que
      var pos = path[path.length-1]; //gets last element from path -> current position 
      var direction = [ // stores directions from current position
        [pos[0] + 1, pos[1]],
        [pos[0], pos[1] + 1],
        [pos[0] - 1, pos[1]],
        [pos[0], pos[1] - 1]
      ];
  
      for (var i = 0; i < direction.length; i++) {
        
        //checks if cells is goal 
        if (direction[i][0] == goal[0] && direction[i][1] == goal[1]) {
          return path.concat([goal]); // returns path + goal as last position
        }
        
        //check if cell is walkable line 0-4 checks out of bounds, line 5 checks for wall
        //when the cell is not walkable, then the position get skipped 
        if (!IsOnMap(direction[i][0],direction[i][1]) || 
            PathfindingMaze[direction[i][0]][direction[i][1]] == "#" || 
            PathfindingMaze[direction[i][0]][direction[i][1]] == "?" ) { 
          continue;
        }
        
        
        PathfindingMaze[direction[i][0]][direction[i][1]] = "#"; //sets current pos to not walkable 
        queue.push(path.concat([direction[i]])); //add currently checking pos to que 
      }
    }
}
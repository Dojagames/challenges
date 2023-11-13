/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(' ');
const R = parseInt(inputs[0]); // number of rows.
const C = parseInt(inputs[1]); // number of columns.
const A = parseInt(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.

var path = []; //put directions in here, when arrived at the target, then recursivly check for the shortest route
var scannedMaze = [];


var maze = [];

var wayBackMaze = [];
//empty maze for way back
for(let i = 0; i < R; i++){
   wayBackMaze.push([]);
   for(let j = 0; j < C; j++){
       wayBackMaze[i].push(false);
   }
}


var reachedControllRoom = false;

var walkedCoordinates = [];
var shortenedPath = [];


var currentDirection = 0;

const directions = [ //eigentlich 4 Elemente, start bei 0, aber spart code fuer wrapping (nicht elegant)
    "UP",
    "RIGHT",
    "DOWN",
    "LEFT",
    "UP",
    "RIGHT",
    "DOWN",
    "LEFT",
    "UP",
    "RIGHT",
    "DOWN",
    "LEFT",
]

const directionIdentifier = [//eigentlich 4 Elemente, start bei 0, aber spart code fuer wrapping (nicht elegant)
    [-1,0], //one row up 
    [0,1], //one column up
    [1,0], //one row down
    [0,-1], //one column down
    [-1,0], //one row up 
    [0,1], //one column up
    [1,0], //one row down
    [0,-1], //one column down
    [-1,0], //one row up 
    [0,1], //one column up
    [1,0], //one row down
    [0,-1], //one column down
]


var direction = 4;


// game loop
while (true) {
    var inputs = readline().split(' ');
    const KR = parseInt(inputs[0]); // row where Rick is located.
    const KC = parseInt(inputs[1]); // column where Rick is located.

    walkedCoordinates.push([KR,KC]);


    maze = [];
    for (let i = 0; i < R; i++) {
        maze.push(readline()); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).
    }

    
    if(reachedControllRoom){
       WayBack()
       
    } else {
        if(maze[KR][KC] == "C"){
           reachedControllRoom = true;

           for(let i = walkedCoordinates.length - 1; i >= 0; i--){
               if(wayBackMaze[walkedCoordinates[i][0]][walkedCoordinates[i][1]]){
                   const lastCross = wayBackMaze.indexOf(walkedCoordinates[i]);
                   shortenedPath = shortenedPath.slice(0, lastCross);
               } else {
                   wayBackMaze[walkedCoordinates[i][0]][walkedCoordinates[i][1]] = true;
                   shortenedPath.push(path[i]);
               }
           }

           shortenedPath = shortenedPath.reverse();
           if(!shortenedPath[shortenedPath.length -1]){shortenedPath.pop();};
           WayBack()

        } else {
           
            var preventAutoBehavior = false;
            //if possible: turn rigth (rotation += 1), else if possible: walk straigth(rotation += 0), else if possible turn left(rotation -= 1), else walk back(rotation += 2)  
            if(direction == 8 || direction == 0){
                direction = 4;
                //preventAutoBehavior = true;
            } 
           

            console.error(direction);
            if(IsWalkPossible(KR+parseInt(directionIdentifier[direction - 1][0]),KC+parseInt(directionIdentifier[direction - 1][1])) && !preventAutoBehavior){
                //turn rigth
                direction -= 1;
            } else if(IsWalkPossible(KR+directionIdentifier[direction][0],KC+directionIdentifier[direction][1])){
                //go straigth
               
            } else if(IsWalkPossible(KR+directionIdentifier[direction +1][0],KC+directionIdentifier[direction+1][1])){
                //turn left
        
                direction += 1;
            } else {
                //go back
                direction += 2;
            }
        
            path.push(directions[direction]);
            console.log(directions[direction]);
        
        
            // Write an action using console.log()
            // To debug: console.error('Debug messages...');


        }
    }
}


function IsOnMap(localR, localC){
    if(localR > 0 && localR < R && localC > 0 && localC < C ){
        return true;
    }

    return false;
}

function IsWalkPossible(localR, localC){
    if(!IsOnMap(localR,localC)){
        return false;
    }

    if(maze[localR][localC] == "#" || maze[localR][localC] == "?"){
        return false;
    }
    return true;
}

function WayBack(){
   var queue = shortenedPath.pop();
   if(queue == "UP"){
       console.log("DOWN");
   } else if(queue == "DOWN"){
       console.log("UP");
   } else if(queue == "RIGHT"){
       console.log("LEFT");
   } else {
       console.log("RIGHT");
   }
}
/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(' ');
const R = parseInt(inputs[0]); // number of rows.
const C = parseInt(inputs[1]); // number of columns.
const A = parseInt(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.

var path = [];
var scannedMaze = [];
for(let i = 0; i < R; i++){
    scannedMaze.push([]);
    for(let j = 0; j < C; j++){
        scannedMaze[i].push("");
    }
}

var startingPointR = undefined;
var startingPointC = undefined;

var reachedControllRoom = false;

var currentDirection = 0;

const directions = [
    "UP",
    "RIGHT",
    "DOWN",
    "LEFT"
]

const directionIdentifier = [
    [-1, 0], //one row up 
    [0, -1], //one column up
    [1, 0], //one row down
    [0, 1] //one column down
]

const turn = 1;

var rotation = 0;

var walkedPath = []; //put directions in here, when arrived at the target, then recursivly check for the shortest route

// game loop
while (true) {
    var inputs = readline().split(' ');
    const KR = parseInt(inputs[0]); // row where Rick is located.
    const KC = parseInt(inputs[1]); // column where Rick is located.

    //maybe useless depends on the alg to find the way back
    if(!startingPointR){
        startingPointR = KR;
        startingPointC = KC;
    }




    var maze = [];
    for (let i = 0; i < R; i++) {
        maze.push(readline()); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).
    }

    //scan maze in 5x5 radius
    for(let i = -2; i <= 2; i++){
        for(let j = -2; j <= 2; j++){
            const scanPosR = KR + i;
            const scanPosC = KC + j;

            if(IsOnMap(scanPosR,scanPosC)){
                if(maze[scanPosR][scanPosC] = "") {
                    scannedMaze[scanPosR][scanPosC] = maze[scanPosR][scanPosC];    
                }
            }   
        }
    }


    //pledge alg
    
    
    //check if current pos is destination
   

    if(reachedControllRoom){
        //go best way back (que via recusion and revese)


    } else {
        if(scannedMaze[KR][KC] == "C"){
            reachedControllRoom = true;
            //recursion to find best way back

        } else {


            var preventAutoBehavior = false;
            //if possible: turn rigth (rotation += 1), else if possible: walk straigth(rotation += 0), else if possible turn left(rotation -= 1), else walk back(rotation += 2)  
            if(direction == 4){
                direction = 0;
                preventAutoBehavior = true;
            
            } // add to prevent turn rigth...
        
            if(IsWalkPossible(KR+directionIdentifier[direction][0],KC+directionIdentifier[direction][1]) && !preventAutoBehavior){
                //turn rigth
                
                direction += 1;
            } else if(IsWalkPossible(KR+directionIdentifier[direction + 1][0],KC+directionIdentifier[direction+1][1])){
                //go straigth
        
            } else if(IsWalkPossible(KR+directionIdentifier[direction + 2][0],KC+directionIdentifier[direction+2][1])){
                //turn left
        
                direction -= 1;
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

    if(scannedMaze[localR][localC] == "#"){
        return false;
    }
    return true;
}
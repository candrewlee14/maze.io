module.exports =
    /**
     * class that holds all player data and methods for players
     */
    class Player {
        /**
         * Constructor for new player object. Default color is white, all other values are set as zero
         * @param {string} id randomly generated UUID
         */
        constructor(id) {
            this.position = {x: 0, y: 0}; 
            this.destPos = {x: 0, y: 0} ;
            this.color = [255, 255, 255];
            this.id = id;
            this.moveAmount = {x: 0, y: 0};
            this.name = "";
            this.isMoving = false;
        }

        /**
         *  Moves the player towards its destination position a calculated amount every server heartbeat
         * @param {number} time number of milliseconds to arrive at destination position
         * @param {number} HBPS hearbeats per second (this allows us to calculate amount to move)
         * @returns bool - is player moving?
         */
        MoveToDestOverTime(time, HPBS) {
            if (isNaN(time) || isNaN(HPBS)){
                throw "Parameters weren't both numbers!";
            }
            //If this the player was at rest and now is going to move, set isMoving and moveAmounts
            if (this.isMoving == false && (this.position.x != this.destPos.x || this.position.y != this.destPos.y)) {
                this.isMoving = true;
                this.moveAmount.x = (this.destPos.x - this.position.x) / (HPBS * time);
                this.moveAmount.y = (this.destPos.y - this.position.y) / (HPBS * time);
                console.log(`destPos:${this.destPos.x},${this.destPos.y}`);
                console.log(`moveAmount:${this.moveAmount.x},${this.moveAmount.y}`);
            } 
            if (this.position.x == this.destPos.x && this.position.y == this.destPos.y){
                this.isMoving = false;
                return false;
            }
            this.position.x += absMin(this.moveAmount.x, (this.destPos.x - this.position.x));
            this.position.y += absMin(this.moveAmount.y, (this.destPos.y - this.position.y));
            // DEBUG console.log(`x: ${this.position.x}, y: ${this.position.y}`);

            return true;
        }

        
    };

/**
 * Finds the min of the absolute value of two numbers, and returns the corresponding original number
 * @param {number} a 
 * @param {number} b 
 */
function absMin(a, b) {

    var num = Math.min(Math.abs(a), Math.abs(b));
    if (num == Math.abs(a))
        return a;
    else
        return b;
}
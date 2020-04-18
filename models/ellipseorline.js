module.exports = class EllipseOrLine {
    constructor(p1, p2, p3, p4, type, p5, p6) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.type = type;
        this.p5 = p5;
        this.p6 = p6;
        this.strokeDivide = 120;
    }

    convertFromObj(obj) {
        if (obj.type == 2) {
            this.type = 2;
        }

        if (obj.type == 3) {
            this.type = 3;   
        }
    }

    display(sk) {
        sk.push();
        if (this.type == 1) {
            sk.noStroke();
            sk.ellipse(this.p1, this.p2, this.p3, this.p4);
        } else if (this.type == 2) {
            sk.stroke(0, 0, 0);
            var weight = Math.sqrt(this.p5 * this.p5 + this.p6 * this.p6) / this.strokeDivide;
            sk.strokeWeight(weight);
            sk.line(this.p1, this.p2, this.p3, this.p4);
        } else if (this.type == 3) {
            //this is for carved paths
            //it's supposed to be empty
        } else if (this.type == 4) {
            //this is for trail
            sk.strokeWeight(20);
            sk.stroke(this.p5[0], this.p5[1], this.p5[2]);
            sk.line(this.p1, this.p2, this.p3, this.p4);
        }
        sk.pop();
    }
}
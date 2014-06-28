var zero = {
	bg: document.getElementById("viewport"),
	z: document.getElementById("zero"),
	isTurn: false,
	isRun: false,
	isDash: false,
	isBike: false,
	isJump: false,
	isAttack: false,
	getComputed: function (property) {
		var computed = window.getComputedStyle(this.z);
		if (property === "left")
			return parseInt(computed.left.substr(0, computed.left.length - 2), 10);
		else if (property === "width")
			return parseInt(computed.width.substr(0, computed.width.length - 2), 10);
	},
	standStill: function () {
		if (this.isRun && !this.isBike) {
            this.z.style.webkitAnimation = "zero-stand 1s steps(2, end) infinite";
            this.isRun = false;
        }
        if (this.isRun && this.isBike) {
            this.z.style.webkitAnimation = "zero-bike 0.5s steps(5, end) infinite";
            this.isRun = false;
        }
        if (!this.isJump && !this.isBike) {
        	this.z.style.webkitAnimation = "zero-stand 1s steps(2, end) infinite";
        	this.isRun = false;
        }
	},
	moveChar: function (direction, speed, type) {
		if (direction === "left" && this.getComputed("left") - speed < 11)
			return;
		if (direction === "right" && this.getComputed("left") + speed > 705 - this.getComputed("width"))
			return;
		if (type === "run" && !this.isRun) {
			this.z.style.webkitAnimation = "zero-run 1s steps(14, end) infinite";
			this.isRun = true;
		}
		if (type === "dash" && !this.isRun && this.isBike) {
			this.z.style.webkitAnimation = "zero-bike 0.5s steps(5, end) infinite";
			this.isRun = true;
		}
		if (type === "dash" && !this.isRun  && !this.isBike) {
			this.z.style.webkitAnimation = "zero-dash 0.5s steps(11, end) infinite";
			this.isRun = true;
		}
		if (type === "bike" && !this.isRun) {
			this.z.style.webkitAnimation = "zero-bike 0.5s steps(5, end) infinite";
			this.isRun = true;
		}
		if (direction === "left" && !this.isTurn && !this.isBike) {
            this.z.style.webkitTransform = "rotateY(180deg)";
            this.isTurn = !this.isTurn;
		}
        if (direction === "right" && this.isTurn && !this.isBike) {
            this.z.style.webkitTransform = "";
            this.isTurn = !this.isTurn;
        }
		if (direction === "left")
			this.z.style.left = (this.getComputed("left") - speed) + "px";
		if (direction === "right")
			this.z.style.left = (this.getComputed("left") + speed) + "px";
	},
	dash: function () {
		var that = this;
		var stop = setInterval(function () {
			if (that.isTurn)
				that.moveChar("left", i, "dash");
			else if (!that.isTurn)
				that.moveChar("right", i, "dash");
			if (i > 50) {
			    clearInterval(stop);
			    that.standStill();
			}
			i += 3;
		}, 10);
	},
	jump: function () {
        if (!this.isJump && !this.isBike) {
            this.z.style.webkitAnimation = "zero-jump 1.5s steps(16, end) 1, zero-stand 1s 1.5s steps(2, end) infinite";
        }
        if (!this.isTurn && !this.isBike) {
            this.z.style.webkitTransform = "";
        }
        else if (this.isTurn && !this.isBike)
            this.z.style.webkitTransform = "rotateY(180deg)";
		zero.isJump = true;
    },
    attack: function (type) {
        if(!this.isAttack){
            if (this.isTurn) {
                this.z.style.left = (zero.getComputed() - 35)+"px";
            }
            if (type === "1")
            	this.z.style.webkitAnimation = "zero-attack1 .5s steps(17, end) 1";
            else if (type === "2")
            	this.z.style.webkitAnimation = "zero-attack2 .5s steps(11, end) 1";
            else if (type === "3")
            	this.z.style.webkitAnimation = "zero-attack3 .5s steps(14,end) 1";
            else if (type === "4")
            	this.z.style.webkitAnimation = "zero-attack-ryuuenjin 1s steps(16, end) 1";
            else if (type === "5")
            	this.z.style.webkitAnimation = "zero-attack-hyouretsuzan 1s steps(9, end) 1";
            else if (type === "6")
            	this.z.style.webkitAnimation = "zero-attack-eBlade 1s steps(7, end) 1";
            this.isAttack = true;
        }        
    },
    fin: function () {
        this.z.style.webkitAnimation = "zero-finish 2s steps(11, end) 1";
        setTimeout(function () {
            document.getElementById("viewport").innerHTML = "";
        }, 2000);
	},
	moveBg: function () {
		this.bg.classList.add("move");
		this.bg.classList.remove("pause");
		this.bg.classList.add("play");
	},
	pauseBg: function () {
		this.bg.classList.remove("play");
		this.bg.classList.add("pause");
	}
};

var code = 0;
var state = 0;
window.addEventListener("keydown", function (e) {
	code = e.keyCode;
	if (code === 68 && !zero.isDash) {
		i = 0;
		zero.dash();
		zero.isDash = true;
	}
	if (code === 66 && !zero.isTurn) {
		if (zero.isBike) {
			zero.isBike = false;
			zero.pauseBg();
			zero.z.style.webkitAnimation = "zero-stand 1s steps(2, end) infinite";
		}
		else {
			zero.isBike = true;
			zero.moveBg();
			zero.z.style.webkitAnimation = "zero-bike 0.5s steps(5, end) infinite";
		}
	}
	if (code === 32 && !zero.isJump) {
		zero.jump();
	}
	if (code === 27) {
		zero.fin();
	}
	if (code === 65 && !zero.isAttack) {
		if (state === 0) {
			zero.attack("1");
			state++;
		}
		else if (state === 1) {
			zero.attack("2");
			state++;
		}
		else if (state === 2) {
			zero.attack("3");
			state++;
		}
		else if (state === 3) {
			zero.attack("4");
			state++;
		}
		else if (state === 4) {
			zero.attack("5");
			state++;
		}
		else if (state === 5) {
			zero.attack("6");
			state = 0;
		}
		else{
			state = 0;
		}
		//zero.isAttack = true;
	}
	/*if (code === 67 && !zero.isAttack) {
		zero.attack("2");
		zero.isAttack = true;
	}
	if (code === 69 && !zero.isAttack) {
		zero.attack("3");
		zero.isAttack = true;
	}*/
});

window.addEventListener("keyup", function (e) {
	if (e.keyCode === 37 || e.keyCode === 39) {
		code = 0;
		zero.standStill();
	}
	if (e.keyCode === 68)
		zero.isDash = false;
	if (code === 32) {
		zero.isJump = false;
		setTimeout(function() {
            zero.standStill();
        }, 1800);
	}
	if (code === 65) {
		zero.isAttack = false;
		//setTimeout(function() {
            //zero.standStill();
        //}, 375);
	}

	/*if (code === 65 || code === 67 || code === 69) {
		zero.isAttack = false;
		setTimeout(function() {
            zero.standStill();
        }, 375);
	}*/
});

var loop = function () {
	if (code === 37 && !zero.isBike)
		zero.moveChar("left", 1, "run");
	if (code === 39 && !zero.isBike)
		zero.moveChar("right", 1, "run");
	if (code === 37 && zero.isBike)
		zero.moveChar("left", 3, "bike");
	if (code === 39 && zero.isBike)
		zero.moveChar("right", 3, "bike");
	setTimeout(loop, 10);
};

loop();
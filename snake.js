/**
 * Created by Administrator on 2016/3/24.
 */
(function(){
    window.retroSnake = function (obj) {
        this.id         = obj.id  // 面板id
        this.startId    = obj.startId  // 游戏开始按钮id
        this.reStartId  = obj.reStartId  // 游戏开始按钮id
        this.row        = obj.row // 行数
        this.column     = obj.column //
        this.speed      = obj.speed //
        this.workThread = null

    }

    retroSnake.prototype.drawPanel = function () { //

        var html = '<table>'

        for(var i = 0; i < this.row; i++){
            html += '<tr>'
            for(var j = 0;j < this.column; j++){
                html +='<td id="box_' + i + '_' + j +'"></td>'
            }
            html += '</tr>'
        }

        this.pannel = document.getElementById(this.id);
        this.pannel.innerHTML = html
    }

    retroSnake.prototype.Direction = function () {
        var direction = new Object();

        direction.UP = 38;
        direction.RIGHT = 39;
        direction.DOWN = 40;
        direction.LEFT = 37;

        return direction;
    }

    //

    retroSnake.prototype.init = function(){
        var that = this

        that.drawPanel()

        this.Start = function () {
            that.drawSnake()

            this.MoveSnake = function (ev) {
                var evt = window.event || ev;
                that.setDir(evt.keyCode);
            };
            try {
                document.attachEvent("onkeydown", this.MoveSnake);
            } catch (e) {
                document.addEventListener("keydown", this.MoveSnake, false);
            }

            that.drawFood(that.snakePos)

            that.workThread = setInterval(function () {
                that.Eat(that.foodPos)
                that.snake = that.snakeMove()
            },that.speed)
        }
        var startDom = document.getElementById(this.startId)
        var reStartDom = document.getElementById(this.reStartId)

        reStartDom.disabled = true
        reStartDom.setAttribute('disabled',true)

        startDom.addEventListener('click', function () {

            this.disabled = true
            this.setAttribute('disabled',true)

            reStartDom.disabled = false
            reStartDom.removeAttribute('disabled')

            that.Start()

        },false)

        reStartDom.addEventListener('click', function () {

            that.removeSnake(1)

            that.Start()
        },false)

    }

    retroSnake.prototype.Eat = function (foodPos) {

        var head  = this.snakePos[this.snakePos.length - 1]
        var isEat = false

        switch (this.moveDir){
            case this.direction.UP:
                if(head.X == foodPos.X + 1 && head.Y == foodPos.Y){
                    isEat = true;
                    console.log('food up ' + isEat)

                }
                break;
            case this.direction.DOWN:
                if(head.X == foodPos.X - 1 && head.Y == foodPos.Y){
                    isEat = true;
                    console.log('food down ' + isEat)
                }
                break;
            case this.direction.LEFT:
                if(head.X == foodPos.X && head.Y == foodPos.Y + 1){
                    isEat = true;
                    console.log('food left ' + isEat)

                }
                break;
            case this.direction.RIGHT:
                if(head.X == foodPos.X && head.Y == foodPos.Y - 1){
                    isEat = true;
                    console.log('food right ' + isEat)
                }
                break;
        }

        if(isEat){
            this.snakePos[this.snakePos.length] = this.createPosition(foodPos.X,foodPos.Y)
            this.drawFood(this.snakePos)

            console.log(this.foodPos)
            console.log('food eat')
        }
    }

    // snake 的前进方向
    retroSnake.prototype.setDir = function (dir) {
        switch (dir){
            case this.direction.UP:
                if(!this.isDone && this.moveDir != this.direction.DOWN) {
                    this.moveDir = dir
                    this.isDone  = false
                }
                break;
            case this.direction.DOWN:
                if(!this.isDone && this.moveDir != this.direction.UP) {
                    this.moveDir = dir
                    this.isDone  = false
                }
                break;
            case this.direction.LEFT:
                if(!this.isDone && this.moveDir != this.direction.RIGHT) {
                    this.moveDir = dir
                    this.isDone  = false
                }
                break;
            case this.direction.RIGHT:
                if(!this.isDone && this.moveDir != this.direction.LEFT) {
                    this.moveDir = dir
                    this.isDone  = false
                }
                break;
        }

    }

    retroSnake.prototype.snakeMove = function () {

        document.getElementById('box_'+ this.snakePos[0].X +'_' + this.snakePos[0].Y).className = ''

        for(var i = 0; i < this.snakePos.length - 1;i++){
            this.snakePos[i].X = this.snakePos[i+1].X
            this.snakePos[i].Y = this.snakePos[i+1].Y
        }

        // 改变头部
        var head = this.snakePos[this.snakePos.length -1]

        switch (this.moveDir){
            case this.direction.UP:
                head.X --;
                break;
            case this.direction.DOWN:
                head.X ++;
                break;
            case this.direction.LEFT:
                head.Y --;
                break;
            case this.direction.RIGHT:
            default :
                head.Y ++;
                break;
        }

        this.snakePos[this.snakePos.length-1] = head

        // 画
        for(var i = 0; i < this.snakePos.length ;i++){
            var isExit = false;

            for(var j = i + 1;j < this.snakePos.length;j++){
                if(this.snakePos[j].X == this.snakePos[i].X && this.snakePos[j].Y == this.snakePos[i].Y){
                    isExit = true;
                    break;
                }
            }
            if(isExit){ // 咬自己
                this.grameOver()
                break;
            }
            var snake = document.getElementById('box_'+ this.snakePos[i].X +'_' + this.snakePos[i].Y)
            if(snake) {snake.className = 'snake'}
            else {
                this.grameOver();

                break;
            }
        }

    }

    retroSnake.prototype.removeSnake = function(type){

        clearInterval(this.workThread)
        if(this.snakePos.length > 0){
            var len = type == 1 ? this.snakePos.length : (this.snakePos.length - 1);
            for(var i = 0; i < len;i++){
                document.getElementById('box_'+ this.snakePos[i].X +'_' + this.snakePos[i].Y).className = ''
            }
            document.getElementById('box_'+ this.foodPos.X +'_' + this.foodPos.Y).className = ''

            this.snakePos.length = 0
            this.foodPos.length  = 0
        }

    }

    retroSnake.prototype.grameOver = function () {
        clearInterval(this.workThread)

        var startDom = document.getElementById(this.startId)
        var reStartDom = document.getElementById(this.reStartId)

        startDom.disabled = false
        startDom.removeAttribute('disable')

        reStartDom.disabled = true
        reStartDom.setAttribute('disabled',true)

        alert("Game Over!")

        this.removeSnake(0)

    }

    retroSnake.prototype.drawSnake = function () {
        this.isDone    = false
        this.snakePos  = new Array(this.createPosition())
        this.direction = this.Direction()
        this.moveDir   = this.direction.RIGHT

        if(this.snakePos.length == 1 ) {
            this.snakePos[0] = this.createPosition()
            this.snakePos[1] = this.createPosition(this.snakePos[0].X,this.snakePos[0].Y + 1)
        }

        for(var i = 0; i < this.snakePos.length ;i++){
            var snake = document.getElementById('box_'+ this.snakePos[i].X +'_' + this.snakePos[i].Y)
            if(snake) snake.className = 'snake'
        }
    }

    retroSnake.prototype.drawFood = function(snakePos){
        this.foodPos = this.createPosition()

        //排除
        var foodX = 0,foodY = 0, isCover = false;
        do{
            isCover = false
            foodX   = parseInt(Math.random() * (this.row - 1))
            foodY   = parseInt(Math.random() * (this.column - 1))

            for(var i = 0;i < snakePos.length;i++){
                if(foodX == snakePos[i].X && foodY == snakePos[i].Y) {
                    isCover = true;
                    break;
                }
            }

        }while(isCover)

        this.foodPos = this.createPosition(foodX,foodY)
        document.getElementById('box_'+ this.foodPos.X + '_'+this.foodPos.Y).className = 'food'

    }

    retroSnake.prototype.createPosition = function(x,y){
        var pos = new Object()

        pos.X = 0
        pos.Y = 0

        if(arguments.length >= 1) pos.X = x
        if(arguments.length >= 2) pos.Y = y

        return pos
    }
})()
let canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
let ctx = canvas.getContext("2d");
ctx.strokeStyle = 'none';
var lineWidth = 5
ctx.lineCap = "round";

let painting = false;
var eraserEnabled = false 
let last;
let LiColor = document.getElementsByTagName("li");
listenToUser()
getColor();

function getColor(){
    for (let i = 0; i < LiColor.length; i++) {
        LiColor[i].onclick = function () {
            for (let i = 0; i < LiColor.length; i++) {
                LiColor[i].classList.remove("active");
                this.classList.add("active");
                activeColor = this.style.backgroundColor;
                console.log(this.style.backgroundColor)
                ctx.fillStyle = activeColor;
                ctx.strokeStyle = activeColor;
            }
        }
    }
}

function listenToUser() {
    thin.onclick = function(){
        lineWidth = 2
        thin.classList.add("active")
        normal.classList.remove("active")
        strong.classList.remove("active")
        eraser.classList.remove("active")
    }
    normal.onclick = function(){
        lineWidth = 5
        normal.classList.add("active")
        thin.classList.remove("active")
        strong.classList.remove("active")
        eraser.classList.remove("active")
    }
    strong.onclick = function(){
        lineWidth = 10
        strong.classList.add("active")
        thin.classList.remove("active")
        normal.classList.remove("active")
        eraser.classList.remove("active")
    }
    eraser.onclick = function () {
        eraserEnabled = true
        eraser.classList.add("active")
        pen.classList.remove("active")
        thin.classList.remove("active")
        normal.classList.remove("active")
        strong.classList.remove("active")
    }
    pen.onclick = function write() {
        eraserEnabled = false
        pen.classList.add("active")
        eraser.classList.remove("active")
    }
    clear.onclick = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        eraser.classList.remove("active")
    }
    download.onclick = function(){
        var url = canvas.toDataURL()
        window.alert("????????????????????????????????????myDrawing.png")
        var a = document.createElement("a")
        a.download = "myDrawing.png"
        a.href = url
        a.click()
        eraser.classList.remove("active")
    }

    let historyData = [];
    function saveData (data) {
    (historyData.length === 10) && (historyData.shift());// ???????????????10???
    historyData.push(data);
    }

    undo.onclick = function(){
        eraser.classList.remove("active")
        if(historyData.length < 1) return false;
        ctx.putImageData(historyData[historyData.length - 1], 0, 0);
        historyData.pop()
    };
    //??????????????????
    function is_touch_device() {  
    try {  
        document.createEvent("TouchEvent");  
        return true;  
    } catch (e) {  
        return false;  
    }  
    }
    // ??????????????????????????????drawLine??????????????????????????????
    if(is_touch_device()){
    canvas.ontouchstart =(e)=>{
        this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height);//?????????????????????
        saveData(this.firstDot);
        painting = true
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        // ??????
        last = [x,y];
    }
    canvas.ontouchmove = (e)=>{
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        if (painting) {           
            if (eraserEnabled) {
                ctx.clearRect(x - 5, y - 5, 20, 20)
            }else{
                drawLine(last[0],last[1],x,y);
                // ???????????? last
                last = [x,y];
            }
        }
    }
    }else{
        // ?????????PC??????painting ????????? ???/??? ??????;
        canvas.onmousedown = (e) =>{
            this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height);//?????????????????????
            saveData(this.firstDot);
            painting = true;
            last = [e.clientX, e.clientY];
        }
        canvas.onmouseup = (e) =>{
            painting = false;
        }

        canvas.onmousemove = (e)=>{
            if (painting === true){
                if (eraserEnabled) {
                    ctx.clearRect(e.clientX - 5, e.clientY - 5, 20, 20)
                }else{
                    drawLine(last[0],last[1],e.clientX, e.clientY);
                    last = [e.clientX, e.clientY];
                } 
            }
        }
    }
}
// ???????????????canvas????????? ??????
function drawLine(x1,y1,x2,y2){
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.lineWidth = lineWidth  //??? ????????????
ctx.stroke();
}
var RetinaDrawContainer = (function(){
  function RetinaDrawContainer(funktion){
    this.visible = true;
    this.drawOnlyOnce = true;
    this.drawn = false;
    this.draw = funktion;
  }
  return RetinaDrawContainer;
})();

var RetinaCanvas = (function () {
 
  function RetinaCanvas (id) {
    var self = this;
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
 
    this.globalWidth = window.innerWidth;
    this.globalHeight = window.innerHeight;
    this.ratio = 1;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.drawArray = [];
    
    this.update = function () {};
    this.draw = function () {};

    if (this.ctx) {
      
      window.addEventListener('resize', function () {
        self.rescale();
      });
 
      this.rescale(); 
    }
 
  }
 
  RetinaCanvas.prototype.rescale = function () {
    if (this.ctx.webkitBackingStorePixelRatio < 2) {
      this.ratio = window.devicePixelRatio || 1;
    }
    this.globalWidth = window.innerWidth;
    this.globalHeight = window.innerHeight;
    this.canvas.setAttribute('width', this.globalWidth* this.ratio);
    this.canvas.setAttribute('height', this.globalHeight* this.ratio);
    for (var index = 0; index < this.drawArray.length; ++index) {
      this.drawArray[index].drawn = false;
    }
    this.__update();
  };
 
  RetinaCanvas.prototype.__update = function () {
    var self = this;
 
    this.update();
 
    requestAnimationFrame(function () {
      self.__update();
    });
  };
 
  RetinaCanvas.prototype.__draw = function () {
    this.ctx.save();
    this.ctx.scale(this.ratio, this.ratio);

    this.draw(this.ctx);

    for (var index = 0; index < this.drawArray.length; ++index) {
      if(this.drawArray[index].visible){
        if(this.drawArray[index].drawOnlyOnce && this.drawArray[index].drawn){
          return;
        }else{
          this.drawArray[index].drawn = true;
        }
        this.drawArray[index].draw(this.ctx);
      }
    }
 
    this.ctx.restore();
  };
 
  return RetinaCanvas;
 
})();
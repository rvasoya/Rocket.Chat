import videojs from 'video.js';

const Plugin = videojs.getPlugin('plugin');
const Component = videojs.getComponent('Component');

class Advanced extends Plugin {
  constructor(player, options) {
    super(player, options);
    // Whenever the player emits a playing or paused event, we update the
    // state if necessary
    this.annotation = options.timeInterval
    this.on(player,'timeupdate', this.check);
  }
  dispose() {
    super.dispose();
  }
  check(){
    let disp = this.annotation.filter(n=>{
      let x = (Math.ceil(n.time)) - Math.ceil(this.player.currentTime());
      if(x == 0) {
        n.opacity = 1
        return n;
      }
    });
    $('.vjs-annotation-circle .vjs-annotation[data-aid]').css('opacity',0).css('visibility','hidden')
    disp.forEach(item=>{
      $('.vjs-annotation-circle .vjs-annotation[data-aid='+item.id+']').css('opacity',item.opacity).css('visibility','visible')
    })
  }
}

class AnnotationDot extends Component{
  constructor(player, options) {
    super(player, options)
  }
  createEl() {
    //element
    let el = videojs.dom.createEl('div', {
      className: 'vjs-annotation-bar'
    });
    //childrens of el
    let annotations = this.options_.annotation
    if(annotations){
      annotations.forEach(item=>{
        let temp = videojs.dom.createEl('div',{
          className:'vjs-annotation-line'
        })
        temp.style.left = item.pos.bar+'%';
        temp.setAttribute('data-mid',item.mid)
        temp.setAttribute('data-aid',item._id)
        temp.setAttribute('data-sid',item.pos.time)
        videojs.dom.prependTo(temp,el);
      })
    }
    return el;
  }
  dispose(){
    super.dispose()
  }
};

class AnnotationCircle extends Component{
  constructor(player, options) {
    super(player, options)
  }
  createEl() {
    //element
    let el = videojs.dom.createEl('div', {
      className: 'vjs-annotation-circle'
    });
    //childrens of el
    let annotations = this.options_.annotation
    if(annotations){
      annotations.forEach(item=>{
        let temp = videojs.dom.createEl('div',{
          className:'vjs-annotation'
        })
        temp.style.left = item.pos.x+'%';
        temp.style.top = item.pos.y+'%';
        temp.setAttribute('data-aid',item._id)
        temp.setAttribute('data-message',item.review)
        videojs.dom.prependTo(temp,el);
      })
    }
    return el;
  }
  dispose(){
    super.dispose()
  }
};


// Register the component with Video.js, so it can be used in players.
videojs.registerComponent('AnnotationDot', AnnotationDot);
videojs.registerComponent('AnnotationCircle', AnnotationCircle);
// Register the plugin with Video.js, so it can be used in players.
videojs.registerPlugin('advanced', Advanced);


this.videojs = videojs

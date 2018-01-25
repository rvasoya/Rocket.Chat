import 'magnific-popup/dist/jquery.magnific-popup.js'
import 'magnific-popup/dist/magnific-popup.css'
import './assets/uiVideo.css'
import moment from 'moment'

const fixCordova = function(url) {
	if (Meteor.isCordova && (url && url[0] === '/')) {
		url = Meteor.absoluteUrl().replace(/\/$/, '') + url;
		const query = `rc_uid=${ Meteor.userId() }&rc_token=${ Meteor._localStorage.getItem('Meteor.loginToken') }`;
		if (url.indexOf('?') === -1) {
			url = `${ url }?${ query }`;
		} else {
			url = `${ url }&${ query }`;
		}
	}
	if (Meteor.settings['public'].sandstorm || url.match(/^(https?:)?\/\//i)) {
		return url;
	} else if (navigator.userAgent.indexOf('Electron') > -1) {
		return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + url;
	} else {
		return Meteor.absoluteUrl().replace(/\/$/, '') + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + url;
	}
};

Template.renderVideo.helpers({
  fixCordova,
	videoId(){
		return this.file._id
	},
	video_url(){
		return fixCordova(this.attachments[0].video_url)
	},
	video_type(){
		return this.attachments[0].video_type
	},
	description(){
		return this.attachments[0].description
	}
});

Template.renderVideo.onRendered(() =>{
	player = videojs('#videohaha',{
		controlBar: {
			fullscreenToggle: false
		}
	});
	if(Template.instance().data.isAnnotated != true){
		Template.instance().data.annotation = []
	}
	player.annotationLine = player.addChild('AnnotationDot',{
		annotation: Template.instance().data.annotation
	});
	player.annotationCircle= player.addChild('AnnotationCircle',{
		annotation: Template.instance().data.annotation
	});
	player.advanced({
		timeInterval : Template.instance().data.annotation.map(n=>{
			n.pos.id = n._id
			return n.pos;
		})
	});
	$.magnificPopup.open({
		items: {
				src: '#videojsload',
				type: 'inline'
		},
		callbacks:{
			close: function() {
				// Will fire when popup is closed
				roomTemplate = Blaze.getView($('.dropzone')[0]).templateInstance()
				videojs.players.videohaha=null;
				roomTemplate.videoTemplate.set()
				roomTemplate.videoTemplateData.set();
			}
		}
	});
});

	$('body').on('click','.vjs-annotation',function(){
		//display message...
		videojs.players.videohaha.pause()
		AnnotationHistoryManager.goToAnnotation($(this).data('aid'), 100)
	})

	$('body').on('click','.vjs-annotation-line',function(){
		//seek to player...
		videojs.players.videohaha.currentTime($(this).data('sid'))
	})

	$('body').on('click','video.vjs-tech',function(e){
		let renderVideo = Blaze.getView($('#videohaha')[0]).templateInstance().data.annotation
		let annotationList = Blaze.getView($('[data-template="annotationTemplateVideo"]')[0]).templateInstance()
		let player = videojs.players.videohaha
    if(player.currentTime() < 0.5){
      console.log("don't allow annotaiton...");
      return ;
    }
		player.pause()
    var text = prompt('Enter message....')
    if(text==null)
      return ;
    else if(text.length==0)
      return ;
	    let originalEvent = event;
	    let target = event.target;
	    let rect = target.getBoundingClientRect();
			Meteor.call('createVideoAnnotation',{
	    	review:text,
				i : $('#videojsload').attr('video-id'),
				rid:Session.get('openedRoom'),
	      pos:{
	        x : ((originalEvent.clientX - rect.left) / rect.width * 100)-1.3,
	        y : ((originalEvent.clientY - rect.top) / rect.height * 100)-2.5,
	        bar: (player.currentTime()/player.duration())*100,
	        time: player.currentTime()
	      }
	    },(err,result)=>{
				if(err)
					return console.log(err);
				if(result){
					renderVideo = result.annotation;
					Blaze.getView($('#videohaha')[0]).templateInstance().data = result
					annotationList.annotation.set(result.annotation.reverse())
					annotationList.isAnnotated.set(result.isAnnotated)
					player.annotationLine.dispose()
					player.annotationLine = player.addChild('AnnotationDot',{
						annotation: renderVideo
					})
					player.annotationCircle.dispose()
					player.annotationCircle = player.addChild('AnnotationCircle',{
						annotation: renderVideo
					})
					player.advanced().dispose()
					player.advanced({
						timeInterval : renderVideo.map(n=>{
							n.pos.id = n._id
							return n.pos
						})
					})
				}
			})
  })


Template.annotationTemplateVideo.onCreated(function(){
	const data = Template.currentData();
	this.annotation = Template.currentData().annotation ? new ReactiveVar(Template.currentData().annotation.reverse()) : new ReactiveVar([])
	this.isAnnotated = new ReactiveVar(Template.currentData().isAnnotated)
})
Template.annotationTemplateVideo.helpers({
	time(ts) {
		return moment(ts).format(RocketChat.settings.get('Message_TimeFormat'));
	},
	date(ts) {
		return moment(ts).format(RocketChat.settings.get('Message_DateFormat'));
	},
	isAnnotated(){
		return Template.instance().isAnnotated.get()
	},
	annotation() {
		return Template.instance().annotation.get();
	}
})
Template.annotationTemplateVideo.events({
	'click .annotation-message'(e){
		if(videojs.players.videohaha.paused()){
			videojs.players.videohaha.play()
		}
		videojs.players.videohaha.pause()
		videojs.players.videohaha.currentTime($(e.currentTarget).data('seek'));
		let msgEl = $(`.vjs-annotation[data-aid='${$(e.currentTarget).data('id')}']`)
		msgEl.addClass('highlight')
		setTimeout(()=>{
			msgEl.removeClass('highlight')
		},1500)
	}
})

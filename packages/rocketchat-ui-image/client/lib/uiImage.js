import moment from 'moment'
import './uiImage.css'


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

Template.renderImage.helpers({
  fixCordova,
	imageId(){
		return this.file._id
	},
	image_url(){
		return fixCordova(this.attachments[0].image_url)
	},
	image_type(){
		return this.attachments[0].image_type
	},
	description(){
		return this.attachments[0].description
	},
	isAnnotated(){
		return Template.instance().isAnnotated.get()
	},
	annotation(){
		return Template.instance().annotation.get()
	}
});

Template.renderImage.onCreated(function(){
  let template = this;
	let data = Template.currentData();
	console.log(data);
	this.isAnnotated = new ReactiveVar(data.isAnnotated ? data.isAnnotated : false)
	this.annotation = new ReactiveVar(data.isAnnotated ? data.annotation : [])
})

Template.renderImage.onRendered(function(){
	let instance = Template.instance()
	roomTemplate = Blaze.getView($('.dropzone')[0]).templateInstance()
  $.magnificPopup.open({
	  items: {
	      src: '#imageload',
	      type: 'inline'
	  },
	  callbacks:{
	    close: function() {
	      // Will fire when popup is closed
	      roomTemplate.imageTemplate.set()
	      roomTemplate.imageTemplateData.set();
	    }
	  }
	});
});

$('body').on('click','#imageload .image-container img',function(e){
	var text = prompt('Enter text....')
	if(text==null)
		return ;
	else if(text.length==0)
		return ;
	let originalEvent = event;
	let target = event.target;
	let rect = target.getBoundingClientRect();
	let x = originalEvent.clientX - rect.left-5;
	let y = originalEvent.clientY - rect.top-5;
	let instance = Blaze.getView($(this)[0]).templateInstance()
	let Ob ={
		review :text,
		i : target.src.split('/')[4],
		x : ( x/rect.width * 100),
		y : ( y/rect.height * 100),
		rid : Session.get('openedRoom')
	}
	console.log(Ob);
	Meteor.call('createImageAnnotation',Ob,(err,result)=>{
		if(err)
			return console.log(err);
		if(result){
			let annotationList = Blaze.getView($('[data-template="annotationTemplateImage"]')[0]).templateInstance()
			annotationList.isAnnotated.set(true)
			annotationList.annotation.set(result.annotation.reverse())
			instance.isAnnotated.set(true);
			instance.annotation.set(result.annotation)
		}
	})
})

$('body').on('click','.image-annotation',function(){
	AnnotationHistoryManager.goToImageAnnotation($(this).data('id'), 100)
})

Template.annotationTemplateImage.onCreated(function(){
	const data = Template.currentData();
	this.annotation = Template.currentData().annotation ? new ReactiveVar(Template.currentData().annotation.reverse()) : new ReactiveVar([])
	this.isAnnotated = new ReactiveVar(Template.currentData().isAnnotated)
})
Template.annotationTemplateImage.helpers({
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
Template.annotationTemplateImage.events({
	'click .annotation-message'(e){
		let msgElement = $(`#imageload .image-annotation[data-id="${$(e.currentTarget).data('id')}"]`)
		msgElement.addClass('highlight');
		return setTimeout(() => msgElement.removeClass('highlight'), 2500);
	}
})

import moment from 'moment'
import toastr from 'toastr';

import './uiPdf.css'
let newScript = document.createElement("script");
newScript.type = "text/javascript";
newScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.332/pdf.min.js";
$('head').append(newScript);
newScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.332/pdf.worker.js";
$('head').append(newScript);

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

const showPage = function(instance,page_no) {

	let pdf = instance.pdf.get()
	let size = instance.canvasSize.get()
	let canvas = instance.canvas.get()
	let ctx = instance.ctx.get()

  // Fetch the page
  pdf.getPage(page_no).then(function(page) {
    var viewport = page.getViewport(size);
    // Set canvas height &  width
		$('.pdf-canvas-container canvas').remove()
		$('.pdf-canvas-container').append(canvas)
    canvas.height = page.getViewport(size).height;
    canvas.width = page.getViewport(size).width;
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    // Render the page contents in the canvas
    page.render(renderContext).then(function() {
			instance.currentPage.set(page_no)
    });
  });
}

const showHighlight = function(elId){
  let el = $('.pdf-annotation[data-id='+elId+']')
  el.addClass('highlight');
  let wrapper = $('.pdf-wrapper');
  let pos = (wrapper.scrollTop() + el.offset().top) - (wrapper.height()/2);
  wrapper.animate({
    scrollTop: pos
  }, 500);
  setTimeout(()=>{el.removeClass('highlight')},1500);
}


Template.renderPdf.helpers({
  fixCordova,
	pdfId(){
		return this.file._id
	},
	pdf_url(){
		return fixCordova(this.attachments[0].pdf_url)
	},
	pdf_type(){
		return this.attachments[0].pdf_type
	},
	description(){
		return this.attachments[0].description
	},
	totalPage(){
		return Template.instance().totalPage.get()
	},
	currentPage(){
		return Template.instance().currentPage.get()
	},
	isAnnotated(){
		return Template.instance().isAnnotated.get()
	},
	annotation(){
		return Template.instance().annotation.get().filter(item=>{
			return item.pos.page==Template.instance().currentPage.get()
		})
	}
});

Template.renderPdf.onCreated(function(){
  let template = this;
	let canvas = document.createElement('canvas')
	canvas.id = 'pdf-canvas';
	let data = Template.currentData();
	this.isAnnotated = new ReactiveVar(data.isAnnotated ? data.isAnnotated : false)
	this.annotation = new ReactiveVar(data.isAnnotated ? data.annotation : [])
	this.canvasSize = new ReactiveVar(1)
	this.totalPage = new ReactiveVar(0)
	this.currentPage = new ReactiveVar(0)
	this.pdf = new ReactiveVar()
	this.canvas = new ReactiveVar(canvas)
	this.ctx = new ReactiveVar(canvas.getContext('2d'))
	this.password = '';
})

function generatePdf(url, instance){
	PDFJS.getDocument({ url: url, password: instance.password }).then(function(pdf_doc) {
		let roomTemplate = Blaze.getView($('.dropzone')[0]).templateInstance()
		toastr.remove()
		//set totalpage, current page, pdf
		instance.pdf.set(pdf_doc)
		instance.totalPage.set(pdf_doc.numPages)
		instance.currentPage.set(1)
		//set annotation and render first page
		showPage(instance,1);
		$.magnificPopup.open({
			items: {
					src: '#pdfload',
					type: 'inline'
			},
			callbacks:{
				close: function() {
					// Will fire when popup is closed
					roomTemplate.pdfTemplate.set()
					roomTemplate.pdfTemplateData.set();
				}
			}
		});
	}).catch(function(error) {
		toastr.remove();
		let roomTemplate = Blaze.getView($('.dropzone')[0]).templateInstance()
		if(error.name=="PasswordException"){
			if(error.code == 1){
				instance.password = prompt('Enter password to open file.')
				if(instance.password!=null && instance.password.length>0)
					generatePdf(url, instance)
				else{
					roomTemplate.pdfTemplate.set()
					roomTemplate.pdfTemplateData.set();
				}
			}
			else{
				toastr.error('Icorrect Password for given file.')
				roomTemplate.pdfTemplate.set()
				roomTemplate.pdfTemplateData.set();
			}
		}
		else{
			toastr.error(error.message)
			roomTemplate.pdfTemplate.set()
			roomTemplate.pdfTemplateData.set();
		}
	});
}

Template.renderPdf.onRendered(function(){
	let instance = Template.instance()
  let url = instance.data.attachments[0].pdf_url
  url = fixCordova(url);
	toastr.info('rendering pdf...');
	generatePdf(url, instance);
});

$('body').on('click','#pdf-canvas',function(e){
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
	 Meteor.call('createPdfAnnotation',{
		 review:text,
		 i : $('#pdfload').attr('data-id'),
		 rid:Session.get('openedRoom'),
		 pos:{
			x : ( x/rect.width * 100),
			y : ( y/rect.height * 100),
			page:instance.currentPage.get()
		 }
	 },(err,result)=>{
		 if(err)
			 return console.log(err);
		 if(result){
			 let annotationList = Blaze.getView($('[data-template="annotationTemplatePdf"]')[0]).templateInstance()
			 annotationList.isAnnotated.set(true)
			 annotationList.annotation.set(result.annotation.reverse())
			 instance.isAnnotated.set(true);
			 instance.annotation.set(result.annotation)
		 }
	 })
 })

$('body').on('click','.pdf-next ,.pdf-prev',function(){
	let instance = Blaze.getView($(this)[0]).templateInstance()
	let op = $(this).data('go')
	let current = instance.currentPage.get()
	if(op == 'next'){
		if(current != instance.totalPage.get())
      showPage(instance,++current);
	}
	else{
		if(current != 1)
      showPage(instance,--current);
	}
})

$('body').on('click','.pdf-annotation',function(){
	AnnotationHistoryManager.goToPdfAnnotation($(this).data('id'), 100)
})

Template.annotationTemplatePdf.onCreated(function(){
	const data = Template.currentData();
	this.annotation = Template.currentData().annotation ? new ReactiveVar(Template.currentData().annotation.reverse()) : new ReactiveVar([])
	this.isAnnotated = new ReactiveVar(Template.currentData().isAnnotated)
})
Template.annotationTemplatePdf.helpers({
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
Template.annotationTemplatePdf.events({
	'click .annotation-message'(e,instance){
		pdfInstance = Blaze.getView($('canvas#pdf-canvas')[0]).templateInstance()
		if(pdfInstance.currentPage.get() == $(e.currentTarget).data('go')){
      showHighlight($(e.currentTarget).data('id'))
    }
    else{
			showPage(pdfInstance,$(e.currentTarget).data('go'));
			setTimeout(()=>{
				showHighlight($(e.currentTarget).data('id'))
			},1000)
    }
	}
})

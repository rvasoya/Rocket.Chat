/* globals Annotation */
import _ from 'underscore';

Template.annotateDots.helpers({
	hasAnnotation() {
		console.log(AnnotateDots);
    console.log('data==>', AnnotateDots.find().fetch());
		return AnnotateDots.find({
			rid: this.rid
		}).count() > 0;
	},
	annotation() {
		return AnnotateDots.find({
			rid: this.rid
		}).fetch()
	}
});

Template.annotateDots.onCreated(function() {
	return this.autorun(() => {
		const data = Template.currentData();
		return this.subscribe('annotateDots',Session.get('openedRoom') ,data.rid);
	});
});

Template.annotateDots.events({
	'click .annotate'(e,instance){
		console.log('clicked annotated dots');
	}
});

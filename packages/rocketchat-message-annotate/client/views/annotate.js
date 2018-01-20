/* globals Annotation */
import _ from 'underscore';

Template.annotateTemplate.helpers({
	annotation(){
		console.log(Template.instance().dots.get());
	}
});

Template.annotateTemplate.onCreated(function() {
	this.dots = new ReactiveVar();
	return this.autorun(() => {
		const data = Template.currentData();
		Meteor.call('getAnnotation', data._id, (err, data) => {
			if(err)
				return console.log(err);
			console.log(data);
			this.dots.set(data)
		});
	});
});

Template.annotateTemplate.events({
	'click .annotate'(e, instance) {
			console.log(e.target);
		}
});

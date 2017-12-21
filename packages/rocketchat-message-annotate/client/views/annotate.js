/* globals Annotation */
import _ from 'underscore';

Template.annotateTemplate.helpers({
	annotation(){
		console.log('annotate ====>',AnnotateDots.find().fetch());
		return AnnotateDots.find({
			rid: this.rid
		}).count() > 0;
	}
});

Template.annotateTemplate.onCreated(function() {
	return this.autorun(() => {
		console.log(AnnotateDots);
		const data = Template.currentData();
		return this.subscribe('annotateMessage', Session.get('openedRoom'), data._id, () => {
				console.log('hahahahahaha');
		});
	});
});

Template.annotateTemplate.events({
	'click .annotate'(e, instance) {
			console.log(e.target);
		}
});

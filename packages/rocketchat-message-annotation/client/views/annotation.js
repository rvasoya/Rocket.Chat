/* globals Annotation */
import _ from 'underscore';

Template.annotationTemplate.helpers({
	// hasAnnotation() {
	// 	return AnnotationMessage.find({
	// 		rid: this.rid
	// 	}, {
	// 		sort: {
	// 			ts: -1
	// 		}
	// 	}).count() > 0;
	// },
	// messages() {
	// 	return AnnotationMessage.find({
	// 		rid: this.rid
	// 	}, {
	// 		sort: {
	// 			ts: -1
	// 		}
	// 	});
	// },
	// message() {
	// 	return _.extend(this, { customClass: 'pinned', actionContext: 'pinned'});
	// },
	// hasMore() {
	// 	return Template.instance().hasMore.get();
	// }
});

Template.annotationTemplate.onCreated(function() {
	this.hasMore = new ReactiveVar(true);
	this.limit = new ReactiveVar(50);
	// return this.autorun(() => {
	// 	const data = Template.currentData();
	// 	return this.subscribe('annotationMessage', data.rid, this.limit.get(), () => {
	// 		if (AnnotationMessage.find({
	// 			rid: data.rid
	// 		}).count() < this.limit.get()) {
	// 			return this.hasMore.set(false);
	// 		}
	// 	});
	// });
});

Template.annotationTemplate.events({
	'scroll .js-list': _.throttle(function(e, instance) {
		// if (e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight && instance.hasMore.get()) {
		// 	return instance.limit.set(instance.limit.get() + 50);
		// }
	}, 200)
});

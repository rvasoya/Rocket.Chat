/* globals Annotation */
import _ from 'underscore';

Template.annotateTemplate.helpers({
	hasAnnotation() {
		return Template.instance().has.get();
	},
	annotation() {
		let x = Mannotate.findOne({
			'file._id':this._id
		});
		return x.annotation;
	}
});
// {
// at:Thu Dec 28 2017 15:48:02 GMT+0530 (IST),
// i:"NZA23bLWr6tMiXCpT",//image id
// mid:"ijygBhAXjThxisvKh",//message id
// review:"on logo",
// rid:"a7fBpxxE7c3eggnyM",/room id
// uid:"wFZZcKybDiD2Njjju",//userid
// username:"ravi",
// x:36.63157894736842,
// y:29.629629629629626,
// _id:"BJGiykJoft9mQ9Yxy",//annotation id
// }

Template.annotateTemplate.onCreated(function() {
  var self = this;
	self.has = new ReactiveVar(false);
	const data = Template.currentData();
	Meteor.subscribe('mannotate', data._id)
	return Tracker.autorun(() => {
		if(Mannotate.find({
			'file._id':data._id
		}).count() > 0)
		return self.has.set(true);
	});
});

Template.annotateTemplate.events({
	'click .annotate'(e){
		console.log(e);
		console.log('clicked annotation on image');
	},
	'click'(){
	console.log('haha');
	}
});

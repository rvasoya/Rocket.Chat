Meteor.startup(function() {
	return Tracker.autorun(function() {
		RocketChat.TabBar.addButton({
			groups: ['channel', 'group', 'direct'],
			id: 'messages-annotation',
			i18nTitle: 'Messages_Annotation',
			icon: 'pin',
			template: 'annotationTemplate',
			order: 11
		});
	});
});

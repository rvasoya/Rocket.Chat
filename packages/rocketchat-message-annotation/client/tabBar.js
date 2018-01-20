Meteor.startup(function() {
	return Tracker.autorun(function() {
		if (RocketChat.settings.get('Message_AllowAnnotation')) {
			RocketChat.TabBar.addButton({
				groups: ['channel', 'group', 'direct'],
					id: 'messages-annotation',
				i18nTitle: 'Messages Annotation',
				icon: 'pin',
				template: 'annotationTemplate',
				order: 11
			});
		} else {
			RocketChat.TabBar.removeButton('messages-annotation');
		}
	});
});

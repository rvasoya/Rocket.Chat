Meteor.startup(function() {
	RocketChat.settings.add('Message_AllowAnnotation', true, {
		type: 'boolean',
		group: 'Message',
		'public': true
	});
	return RocketChat.models.Permissions.upsert('Message_AllowAnnotation', {
		$setOnInsert: {
			roles: ['owner', 'moderator', 'admin', 'user']
		}
	});
});

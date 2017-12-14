Meteor.methods({
	createAnnotation(annotation) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'createAnnotation'
			});
		}

		if (!RocketChat.settings.get('Message_AllowAnnotation')) {
			throw new Meteor.Error('error-action-not-allowed', 'Annotation not allowed', {
				method: 'createAnnotation',
				action: 'Message_AllowAnnotation'
			});
		}
		annotation.message = RocketChat.models.Messages.getMessageByFileId(annotation.i);
		return annotation;
	}
});

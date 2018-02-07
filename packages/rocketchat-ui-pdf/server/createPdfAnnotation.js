Meteor.methods({
	createPdfAnnotation(annotation) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'createPdfAnnotation'
			});
		}

		if (!RocketChat.settings.get('Message_AllowAnnotation')) {
			throw new Meteor.Error('error-action-not-allowed', 'Annotation not allowed', {
				method: 'createPdfAnnotation',
				action: 'Message_Allow_Annotation'
			});
		}

		//get original message
		let originalMessage = RocketChat.models.Messages.getMessageByFileId(annotation.i);
		if (originalMessage == null || originalMessage._id == null) {
			throw new Meteor.Error('error-invalid-message', 'Message for provided file was not found', {
				method: 'createPdfAnnotation',
				action: 'Message_Annotation_notFound'
			});
		}

		const me = RocketChat.models.Users.findOneById(Meteor.userId());
		annotation._id = Random.id()
		annotation.at = new Date
		annotation.uid = Meteor.userId()
		annotation.username = Meteor.user().username
		annotation.mid = originalMessage._id

		RocketChat.models.Messages.setAnnotationByIdAndAnnotation(originalMessage._id, annotation);
		// return RocketChat.models.Messages.setAnnotationByIdAndAnnotation(originalMessage._id, originalMessage.annotation);
		return RocketChat.models.Messages.getMessageByFileId(annotation.i);
	}
});

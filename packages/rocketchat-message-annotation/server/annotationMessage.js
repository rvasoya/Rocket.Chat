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

		//get original message
		let originalMessage = RocketChat.models.Messages.getMessageByFileId(annotation.i);
		if (originalMessage == null || originalMessage._id == null) {
			throw new Meteor.Error('error-invalid-message', 'Message you are annotation was not found', {
				method: 'createAnnotation',
				action: 'Message_Annotation_notFound'
			});
		}

		//If we keep history of edits, insert a new message to store history information
		if (RocketChat.settings.get('Message_KeepHistory')) {
			RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);
		}

		const me = RocketChat.models.Users.findOneById(Meteor.userId());

		annotation._id = Random.id()
		annotation.at = new Date
		annotation.uid = Meteor.userId()
		annotation.username = Meteor.user().username
		annotation.mid = originalMessage._id

		// originalMessage.annotation.push(annotation)

		RocketChat.models.Messages.setAnnotationByIdAndAnnotation(originalMessage._id, annotation);
		// return RocketChat.models.Messages.setAnnotationByIdAndAnnotation(originalMessage._id, originalMessage.annotation);
		return RocketChat.models.Messages.getMessageByFileId(annotation.i);

	}
});

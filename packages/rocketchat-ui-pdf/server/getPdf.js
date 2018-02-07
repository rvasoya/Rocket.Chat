Meteor.methods({
	getPDF(id) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'getPDF'
			});
		}

		//get original message
		let originalMessage = RocketChat.models.Messages.getMessageByFileId(id);
		if (originalMessage == null || originalMessage._id == null) {
			throw new Meteor.Error('error-invalid-id', 'Message was not found for given attachment id', {
				method: 'getPDF',
				action: 'Message_PDF_notFound'
			});
		}
		return originalMessage;
	}
});

Meteor.methods({
	createVideoAnnotation(annotation) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'createVideoAnnotation'
			});
		}

		if (!RocketChat.settings.get('Message_AllowAnnotation')) {
			throw new Meteor.Error('error-action-not-allowed', 'Annotation not allowed', {
				method: 'createVideoAnnotation',
				action: 'Message_Allow_Annotation'
			});
		}

		//get original message
		let originalMessage = RocketChat.models.Messages.getMessageByFileId(annotation.i);
		if (originalMessage == null || originalMessage._id == null) {
			throw new Meteor.Error('error-invalid-message', 'Message for provided file was not found', {
				method: 'createVideoAnnotation',
				action: 'Message_Annotation_notFound'
			});
		}

		const me = RocketChat.models.Users.findOneById(Meteor.userId());
		// //0 = image, 1 = video, 2 = docs
		// RocketChat.models.Annotation.createAnnotation(1,
		// 	 annotation.rid,//roomId
		// 	 annotation.i,//fileId
		// 	 {	_id : Meteor.userId(),
	 	// 			username : Meteor.user().username},//User
		// 	annotation.review,//message of annotation
		// 	annotation.pos)//pos of cursor with time,per,x,y {

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

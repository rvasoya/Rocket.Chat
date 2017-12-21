Meteor.methods({
	// getAnnotation(fileId, options) {
	// 	if (!Meteor.userId()) {
	// 		throw new Meteor.Error('error-invalid-user', 'Invalid user', {
	// 			method: 'getAnnotation'
	// 		});
	// 	}
  //
	// 	//get original message
	// 	console.log(fileId, options);
	// 	let originalMessage = RocketChat.models.Messages.getMessageAnnotationByFileId(fileId, options)
	// 	if (originalMessage == null || originalMessage._id == null) {
	// 		throw new Meteor.Error('error-invalid-message', 'Message not found', {
	// 			method: 'getAnnotation',
	// 			action: 'Message_Not_Found'
	// 		});
	// 	}
  //
  //   if (originalMessage.annotation == null || originalMessage.annotation.length == 0) {
	// 		throw new Meteor.Error('no-annotation', 'Annotation not Found', {
	// 			method: 'getAnnotation',
	// 			action: 'Annotation_Not_Found'
	// 		});
	// 	}
  //
	// 	return originalMessage;
	// }
});

Meteor.methods({
	getAnnotation(fileId, options) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'getAnnotation'
			});
		}
  return RocketChat.models.Messages.getAnnotatedMessageByFile(fileId,{ fields:{ annotation : 1}}).fetch()
  }
});

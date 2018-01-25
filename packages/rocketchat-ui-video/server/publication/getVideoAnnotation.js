Meteor.publish('getVideoAnnotation', function(videoId) {
	if (!this.userId) {
		return this.ready();
	}
	const publication = this;

	const user = RocketChat.models.Users.findOneById(this.userId);
	if (!user) {
		return this.ready();
	}
	// const cursorHandle = RocketChat.models.Annotation.getAnnotatedByFileId(videoId).observeChanges({

	const cursorHandle = RocketChat.models.Messages.getAnnotatedMessageByFile(videoId).observeChanges({
		added(_id, record) {
			publication.added('rocketchat_one_video_annotation', _id, record);
		},
		changed(_id, record) {
			publication.added('rocketchat_one_video_annotation', _id, record);
		},
		removed(_id) {
			publication.removed('rocketchat_one_video_annotation', _id);
		}
	});
	this.ready();
	return this.onStop(function() {
		return cursorHandle.stop();
	});
});

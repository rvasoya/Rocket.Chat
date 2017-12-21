Meteor.publish('annotateMessage', function(roomId, fileId, limit = 50) {
  const publication = this;
	const user = RocketChat.models.Users.findOneById(this.userId);
	if (!user) {
		return this.ready();
	}
  const cursorHandle = RocketChat.models.Messages.getAnnotatedMessageByFileAndRoom(roomId, fileId, { sort: { ts: -1 }, limit }).observeChanges({
		added(_id, record) {
      record.annotation.forEach(item=>{
        console.log('adding',item);
        publication.added('rocketchat_annotate_dots', item._id, item.annotation);
      })
		},
		changed(_id, record) {
      record.annotation.forEach(item=>{
        console.log('changed',item);
        publication.changed('rocketchat_annotate_dots', item._id, item.annotation);
      })
		},
		removed(_id) {
      record.annotation.forEach(item=>{
        console.log('changed',item);
        publication.removed('rocketchat_annotate_dots', item._id);
      })
		}
	});
	this.ready();
	return this.onStop(function() {
		return cursorHandle.stop();
	});
});

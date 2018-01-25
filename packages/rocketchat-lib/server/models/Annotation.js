/* globals InstanceStatus */
import _ from 'underscore';
import s from 'underscore.string';

RocketChat.models.Annotation = new class extends RocketChat.models._Base {
	constructor() {
		super('annotation');

		this.tryEnsureIndex({ 'rid': 1, 'ts': 1 ,'fileId':1 , t:1});
	}

  //INSERT
  createAnnotation(type, roomId, fileId, user, review, data, extraData) {
    const room = RocketChat.models.Rooms.findOneById(roomId, { fields: { sysMes: 1 }});
    if ((room != null ? room.sysMes : undefined) === false) {
      return;
    }
    const message = RocketChat.models.Messages.getMessageByFileId(fileId);
    if(message ==null || message._id==null){
      return;
    }
    const record = {
      t: type,
      rid: roomId,
      ts: new Date,
      msg: message._id,
      i: fileId,
      attachments: message.attachments,
      u: {
        _id: user._id,
        username: user.username
      },
      review:review,
      annotation:data
    };

    record._id = this.insertOrUpsert(record);
    RocketChat.models.Messages.setAnnotation(message._id,record._id);

    return record;
  }

  //FIND
  getAnnotatedByRoom(roomId, options) {
		const query = {
			rid: roomId
		};
		return this.find(query, options)
	}

	getAnnotatedByFileId(fileId, options) {
		const query = {
			i:fileId
		};
		return this.find(query, options);
	}

  // REMOVE
	removeById(_id) {
		const query =	{_id};

		return this.remove(query);
	}

};

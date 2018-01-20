/* globals readMessage UserRoles RoomRoles*/
import _ from 'underscore';

export const AnnotationHistoryManager = new class {
	constructor() {
		this.defaultLimit = 100;
		this.histories = {};
	}
	getSurroundingMessages(annotation, limit) {
		if (limit == null) { limit = this.defaultLimit; }
		if (!(annotation != null ? annotation.rid : undefined)) {
			return;
		}

    const instance = Blaze.getView($('.annotationList')[0]).templateInstance();

		if (AnnotationMessage.findOne(annotation._id)) {
			const wrapper = $('.annotationList');
			const msgElement = $(`.annotation-message[data-id="${ annotation._id }"]`);
			const pos = (wrapper.scrollTop() + msgElement.offset().top) - (wrapper.height()/2);
			wrapper.animate({
				scrollTop: pos
			}, 500);
			msgElement.addClass('highlight');

			setTimeout(function() {
				const messages = wrapper[0];
				return instance.atBottom = messages.scrollTop >= (messages.scrollHeight - messages.clientHeight);
			});

			return setTimeout(() => msgElement.removeClass('highlight'), 2500);
		} else {
      console.log('annotation may be is in history....');
		}
  }
};
this.AnnotationHistoryManager = AnnotationHistoryManager;

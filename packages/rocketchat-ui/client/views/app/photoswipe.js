import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import tippy from 'tippy.js'
import 'photoswipe/dist/photoswipe.css';
import './disablezoom.css'

const escapeHTML = (html) => (html || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
Meteor.startup(() => {
	let galleryInstance = null;
	const initGallery = (selector, items, options) => {
		const gallery = new PhotoSwipe(selector, PhotoSwipeUI_Default, items, options);
		galleryInstance = gallery;
		gallery.init();
		// Image loaded callback for annotation
		gallery.listen('imageLoadComplete', function(index, item) {
		    // gallery.shout('getAnnotation', gallery.currItem.src.split('/')[4]);
		});
		gallery.listen('afterChange', () => {
			// gallery.shout('getAnnotation', gallery.currItem.src.split('/')[4]);
		});
	};
	const getItems = (selector, imageSrc) => {
		const results = {
			index: 0,
			items: []
		};

		for (let i = 0, len = selector.length; i < len; i++) {
			results.items.push({
				src: selector[i].src,
				w: selector[i].naturalWidth,
				h: selector[i].naturalHeight,
				title: selector[i].dataset.title,
				description: selector[i].dataset.description
			});
			if (imageSrc === selector[i].src) {
				results.index = i;
			}
		}

		return results;
	};

	const galleryOptions = {
		index: 0,
		bgOpacity: 0.8,
		showHideOpacity: true,
		counterEl: false,
		getDoubleTapZoom: function(isMouseClick, item) {
	    return item.initialZoomLevel;
	  },
	  pinchToClose: false,
		maxSpreadZoom: 1,
		shareEl: false
	};

	$(document).on('click', '.gallery-item', function() {
		const images = getItems(document.querySelectorAll('.gallery-item'), $(this)[0].src);

		galleryOptions.index = images.index;
		galleryOptions.addCaptionHTMLFn = function(item, captionEl) {
			captionEl.children[0].innerHTML = `${ escapeHTML(item.title) }<br/><small>${ escapeHTML(item.description) }</small> `;
			return true;
		};
		initGallery(document.getElementById('pswp'), images.items, galleryOptions);
	});
Template.photoswipe.helpers({
	roomName() {
		const roomData = Session.get(`roomData${ this._id }`);
		if (!roomData) {
			return '';
		}
		if (roomData.t === 'd') {
			const chat = ChatSubscription.findOne({
				rid: this._id
			}, {
				fields: {
					name: 1
				}
			});
			return chat && chat.name;
		} else {
			return roomData.name;
		}
	}
})

	$(document).on('click', '.room-files-image', (e) => {
		e.preventDefault();
		e.stopPropagation();

		const img = new Image();
		img.src = e.currentTarget.href;
		img.addEventListener('load', function() {
			const item = [{
				src: this.src,
				w: this.naturalWidth,
				h: this.naturalHeight
			}];

			initGallery(document.getElementById('pswp'), item, galleryOptions);
		});
	});
});

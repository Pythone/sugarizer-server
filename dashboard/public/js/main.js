function initDragDrop() {

	var adjustment;

	$("ol.simple_with_animation").sortable({
		group: 'simple_with_animation',
		pullPlaceholder: false,
		// animation on drop
		onDrop: function($item, container, _super) {
			var $clonedItem = $('<li/>').css({
				height: 0
			});
			$item.before($clonedItem);
			$clonedItem.animate({
				'height': $item.height()
			});

			$item.animate($clonedItem.position(), function() {
				$clonedItem.detach();
				_super($item, container);
			});

			//update activities
			updateActivities();
		},

		// set $item relative to cursor position
		onDragStart: function($item, container, _super) {
			var offset = $item.offset(),
				pointer = container.rootGroup.pointer;

			adjustment = {
				left: pointer.left - offset.left,
				top: pointer.top - offset.top
			};

			_super($item, container);
		},
		onDrag: function($item, position) {
			$item.css({
				left: position.left - adjustment.left,
				top: position.top - adjustment.top
			});
		}
	});
}


function updateActivities() {

	//get favorites
	var list = []
	$.each($('[name="favoriteActivities"]:checked'), function(index, value) {
		list.push($(this).parent().data('id'));
	});
	var data = {
		favorites: list.join()
	};

	$.post((url + 'api/v1/activities?' + decodeURIComponent($.param({
		x_key: headers['x-key'],
		access_token: headers['x-access-token']
	}))), data, function(response) {
		$.notify({
			icon: "notifications",
			message: document.webL10n.get('successActivityUpdate')
		}, {
			type: 'success',
			timer: 2000,
			placement: {
				from: 'top',
				align: 'right'
			}
		});
	});
}

function highlight(text) {

	//set var
	var offset = -1;
	var text = text.toLowerCase().trim();

	//search elemetns for text
	$('.search_textbox').each(function() {

		//get data
		var inputText = $(this).text();
		var index = inputText.toLowerCase().indexOf(text);

		//check
		if (index >= 0 && text.length > 0) {
			if (offset == -1) {
				offset = $(this).offset().top;
			}
			inputText = inputText.substring(0, index) + "<span class='highlight'>" + inputText.substring(index, index + text.length) + "</span>" + inputText.substring(index + text.length);
		}
		$(this).html(inputText);
	});

	//scroll
	$('.main-panel').animate({
		scrollTop: (offset - 30)
	}, 500);
}

// localization
function onLocalized() {
	var l10n = document.webL10n;
	var lang = document.getElementById('languageSelection');

	if (lang.selectedIndex == -1) {
		lang.value = l10n.getLanguage();
	} else if (localStorage.getItem("languageSelection") == null) {
		l10n.setLanguage(lang.options[lang.selectedIndex].value);
	} else {
		l10n.setLanguage(localStorage.getItem("languageSelection"));
		lang.value = localStorage.getItem("languageSelection");
	}
	lang.onchange = function() {
		l10n.setLanguage(this.value);
		localStorage.setItem("languageSelection", this.value);
	};
}
document.webL10n.ready(onLocalized);

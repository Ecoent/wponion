'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @param window = Window Object
 * @param document = Document Object
 * @param $ = jQuery Object
 * @param wpo = $wponion object
 * @param wpf = $wonion.field object
 * @param wpt = $wponion.theme object.
 */
(function (window, document, $, wpo, $wpf, wp) {
	var wphooks = wp.hooks;

	/**
  * Input Mask JS Handler.
  */
	$wpf.fn.inputmask = function () {
		if (this.elem.length > 0) {
			var $settings = this.arg('inputmask');
			if ($settings) {
				$settings = wpo.validate_js_function($settings);
				this.elem.inputmask($settings);
				this.save($settings);
				wpo.__plugin_debug_info(this.elem, 'inputmask', $settings);
			}
		}
		return this;
	};

	/**
  * Handles Maxlength Field.
  */
	$wpf.fn.maxlength = function () {
		if (this.elem.length > 0) {
			var $settings = this.arg('max_length');
			if ($settings) {
				$settings['appendToParent'] = true;

				if ($settings['threshold'] !== undefined) {
					$settings['threshold'] = parseInt($settings['threshold']);
				}

				if ($settings['warningClass'] === undefined) {
					$settings['warningClass'] = 'badge badge-success';
				}

				if ($settings['limitReachedClass'] === undefined) {
					$settings['limitReachedClass'] = 'badge badge-danger';
				}

				this.save(this.elem.maxlength($settings));
			}
		}
		return this;
	};

	/**
  * Renders Fields Debug Popup.
  */
	$wpf.fn.field_debug = function () {
		if (this.elem.find('.wponion-field-debug').length > 0) {
			var $elem = this.elem;

			$elem.find('.wponion-field-debug a.wponion-field-debug-handle').on('click', function () {
				var $data = wpo._get_debug_info($(this), {});
				var $divID = wpo.field_js_id($(this)) + 'debugINFO',
				    $notice_txt = "<p class='wponion-field-debug-notice'>" + wpo.settings('debug_notice') + "</p>",
				    $elem = $("<div id='" + $divID + "' class='wponion-field-debug-popup' ><div id='" + $divID + "' ></div> " + $notice_txt + "</div>");

				var $ops = swal({
					html: $elem,
					showConfirmButton: true,
					confirmButtonText: wpo.txt('get_json_output', 'Get JSON Output'),
					showCloseButton: false,
					width: '800px',
					onOpen: function onOpen() {
						$('#swal2-content > div > #' + $divID).jsonView($data).overlayScrollbars({
							className: "os-theme-dark",
							resize: "vertical"
						});
					}
				}).then(function (result) {
					if (result.value) {
						swal({
							width: '600px',
							html: '<textarea style="min-width:550px; min-height:300px">' + JSON.stringify($data) + '</textarea>'
						});
					}
				});
			});
		}
		return this;
	};

	/**
  * Icon Picker Field Handler.
  */
	$wpf.fn.icon_picker = function () {
		var $_this = this,
		    $elem = $_this.elem,
		    $args = $_this.args(),
		    $input = $elem.find(".wponion-icon-picker-input"),
		    $remove_btn = $elem.find('button[data-wponion-iconpicker-remove]'),
		    $add_btn = $elem.find("button[data-wponion-iconpicker-add]"),
		    $preview = $elem.find('span.wponion-icon-preview');

		var $manager = {

			/**
    * Stores POPUP Information.
    */
			elems: null,

			/**
    * Stores POPUP Information.
    */
			popup: null,

			/**
    * Stores POPUP Information.
    */
			popupel: null,
			/**
    * Creates A New Instance for ToolTip.
    */
			init_tooltip: function init_tooltip() {
				if ($args['popup_tooltip'] !== 'false') {
					var $tp = _typeof($args['popup_tooltip']) === 'object' ? $args['popup_tooltip'] : {};
					if ($manager.elems.length > 0) {
						$manager.elems.each(function () {
							tippy($(this)[0], $tp);
						});
					}
				}
			},

			/**
    * Inits For each and every POPUP.
    * @param $popupel
    * @param $instance
    */
			init: function init($popupel, $instance) {
				$manager.popupel = $popupel;
				$manager.popup = $instance;
				$manager.elems = $manager.popupel.find("span.wponion-icon-preview");
				var $height = $manager.popupel.find('.wponion-icon-picker-container-scroll').css('height');
				$manager.popupel.find('.wponion-icon-picker-container-scroll').css('height', $height);
				$manager.select();
				$manager.input();
				$manager.elems.on('click', function () {
					var $icon = $(this).attr('data-icon');
					$input.val($icon).trigger('change');
					swal.closeModal();
				});
				$manager.init_tooltip();
			},

			/**
    * Works with POPUP Input Search.
    */
			input: function input() {
				$manager.popupel.find('div.wponion-icon-picker-model-header input[type=text]').on('keyup', function () {
					var $val = $(this).val();
					$manager.elems.each(function () {
						if ($(this).attr('data-icon').search(new RegExp($val, 'i')) < 0) {
							$(this).parent().hide();
						} else {
							$(this).parent().show();
						}
					});
				});
			},

			/**
    * Handles Selectbox in popup.
    */
			select: function select() {
				$manager.popupel.find('div.wponion-icon-picker-model-header select').on('change', function () {
					swal.enableLoading();
					var $val = $(this).val();
					wpo.ajax('icon_picker', {
						data: {
							"wponion-icon-lib": $val
						}
					}, function ($res) {
						if ($res.success) {
							swal.resetValidationError();
							$($manager.popupel).find("#swal2-content").html($res.data).show();
							$($manager.popupel).find('#swal2-content .wponion-icon-picker-container-scroll').overlayScrollbars({
								className: "os-theme-dark",
								resize: "vertical"
							});
							$manager.init($manager.popupel, $manager.popup);
						} else {
							$($manager.popupel).find(".wponion-icon-picker-container-scroll").remove();
							$manager.popup.showValidationError($res.data);
						}
					}, function () {
						$manager.popup.showValidationError(wpo.txt('unknown_ajax_error'));
					}, function () {
						$manager.popup.disableLoading();
					});
				});
			}
		};

		if ($input.val() === '') {
			$remove_btn.hide();
			$preview.hide();
		}

		/**
   * Handles Blur Even / change even in inputfield.
   */
		$input.on('keyup blur change keypress', function () {
			var $val = $(this).val();

			if ($val !== '') {
				$preview.html('<i class="' + $val + '"></i>').show();
				$remove_btn.show();
			} else {
				$preview.hide();
				$remove_btn.hide();
			}
		});

		/**
   * Handles Add Button Click Event.
   */
		$add_btn.on('click', function () {
			var $popup = swal({
				title: $elem.find(".wponion-field-title h4").html(),
				animation: false,
				allowOutsideClick: false,
				showConfirmButton: false,
				showCloseButton: true,
				width: '700px',
				customClass: "wponion-icon-picker-model",
				onBeforeOpen: function onBeforeOpen($elem) {
					swal.enableLoading();
					$_this.ajax('icon_picker', {
						onSuccess: function onSuccess($res) {
							if ($res.success) {
								swal.resetValidationError();
								var $popup_elem = $($elem);
								$popup_elem.find("#swal2-content").html($res.data).show();
								$popup_elem.find('#swal2-content .wponion-icon-picker-container-scroll').overlayScrollbars({ className: "os-theme-dark", resize: "vertical" });
								$manager.init($popup_elem, $popup);
							} else {
								wpo.tost({
									type: 'error',
									title: $res.data
								});
								$popup.showValidationError($res.data);
							}
						},
						onError: function onError() {
							$popup.showValidationError(wpo.txt('unknown_ajax_error'));
						},
						onAlways: function onAlways() {
							$popup.disableLoading();
						}
					});
				}
			});
		});

		/**
   * Handles Remove Button Event.
   */
		$remove_btn.on('click', function () {
			$input.val('');
			$preview.hide();
			$remove_btn.hide();
		});
		return this;
	};

	/**
  * Select2 Field Handler.
  */
	$wpf.fn.select2 = function () {
		var $arg = this.arg('select2', {});
		$arg = wpo.validate_js_function($arg);
		this.save(this.elem.select2($arg));
		return this;
	};

	/**
  * Chosen Field Handler
  */
	$wpf.fn.chosen = function () {
		var $arg = this.arg('chosen');
		wpo.__plugin_debug_info(this.elem, 'chosen', $arg);
		this.save(this.elem.chosen($arg));
		return this;
	};

	/**
  * Selectize Field Handler.
  */
	$wpf.fn.selectize = function () {
		var $arg = this.arg('selectize');
		if ($arg['theme'] !== undefined) {
			this.elem.parent().addClass($arg['theme']);
		} else {
			this.elem.parent().addClass('selectize-default');
		}

		this.elem.removeClass('form-control');
		this.save(this.elem.selectize($arg));
		return this;
	};

	/**
  * Handles Clone Element Functions.
  */
	$wpf.fn.clone_element = function () {
		var $this = this,
		    $elem = $this.elem,
		    $clone_wrap = $elem.find('div.wponion-clone-wrap'),
		    $add_btn = $elem.find("button[data-wponion-clone-add]"),
		    $remove_btn = $clone_wrap.find("button[data-wponion-clone-remove]"),
		    $arg = $this.arg('clone'),
		    $limit = $arg['limit'] !== undefined ? $arg['limit'] : false,
		    $is_toast = $arg['toast_error'] !== undefined ? $arg['toast_error'] : true,
		    $eror_msg = $arg['error_msg'];

		$clone_wrap.WPOnionCloner({
			add_btn: $add_btn,
			limit: $limit,
			clone_elem: '.wponion-field-clone',
			remove_btn: "button[data-wponion-clone-remove]",
			template: $this.arg('clone_template'),
			onRemove: function onRemove($elem) {
				$elem.parent().parent().remove();
			},
			templateAfterRender: function templateAfterRender($_wrap) {
				var $data = $_wrap.find("> div.wponion-field-clone:last-child");
				wponion_field($data).reload();
			},
			sortable: {
				items: '.wponion-field-clone',
				handle: '.wponion-field-clone-sorter',
				placeholder: 'wponion-cloner-placeholder',
				start: function start(event, ui) {
					ui.item.css('background-color', '#eeee');
				},
				stop: function stop(event, ui) {
					ui.item.removeAttr('style');
				}

			},
			onLimitReached: function onLimitReached() {

				if ($is_toast === true) {
					wpo.tost({
						type: "error",
						title: $eror_msg
					});
				} else {
					var $html = $('<div class="alert alert-warning" role="alert">' + $eror_msg + '</div>').hide();
					$add_btn.parent().prepend($html);
					$add_btn.parent().find("div.alert").fadeIn(function () {
						var $__E = $(this);
						setTimeout(function () {
							$__E.fadeOut('slow', function () {
								$__E.remove();
							});
						}, 1000);
					});
				}
			}
		});
	};

	/**
  * Handles Fields ToolTip Along With A Image Option.
  */
	$wpf.fn.field_tooltip = function () {
		var $fid = this.elem.attr('data-field-jsid');
		var $tip = {};

		if (this.arg($fid + 'tooltip')) {
			var $arg = this.arg($fid + 'tooltip');

			$arg['performance'] = false;
			if ($arg['image'] !== false) {
				$arg.html = '#wponiontooltipimagetippy';
				$arg.updateDuration = 2000;
				$arg.followCursor = false;
				$arg.livePlacement = true;
				$arg.inertia = true;

				$arg.onShow = function () {
					var content = this.querySelector('.tippy-content');
					if ($tip.loading) return;

					$tip.loading = true;

					fetch($arg['image']).then(function (resp) {
						return resp.blob();
					}).then(function (blob) {
						var url = URL.createObjectURL(blob);
						content.innerHTML = '<img src="' + url + '">';
						$tip.loading = false;
					}).catch(function (e) {
						content.innerHTML = 'Loading failed';
						$tip.loading = false;
					});
				};
				$arg.onHidden = function () {
					var content = this.querySelector(".tippy-content");
					content.innerHTML = '';
				};
				$arg['popperOptions'] = {
					modifiers: {
						preventOverflow: {
							enabled: false
						},
						hide: {
							enabled: false
						}
					}
				};
			}
			$tip = tippy(this.elem[0], $arg);
			this.save($tip);
		}
		return this;
	};

	/**
  * Handles Font Selector.
  * @returns {$wponion_field}
  */
	$wpf.fn.font_selector = function () {
		var $this = this,
		    $elem = this.elem,
		    $font_select = $elem.find('select.wponion-font-selector'),
		    $variant = $elem.find('select.wponion-variant-selector'),
		    $websafe = wpo.js_args('wponion_websafe_fonts'),
		    $gfonts = wpo.js_args('wponion_gfonts');

		var $build_options = function $build_options(data) {
			var $return = '';
			for (var $_d in data) {
				$return += '<option value="' + $_d + '">' + data[$_d] + '</option>';
			}
			return $return;
		};

		$font_select.on('change', function () {
			var $val = $(this).val();
			var $html = null;
			if ($websafe['fonts'][$val] !== undefined) {
				$html = $build_options($websafe['variants']);
			} else if ($gfonts[$val] !== undefined) {
				$html = $build_options($gfonts[$val]);
			}
			$variant.html($html);
			wpo.trigger_update_select($variant);
		});
		return this;
	};

	/**
  * Handles Accordion Field.
  */
	$wpf.fn.accordion = function () {
		this.elem.each(function () {
			$(this).find('.wponion-accordion-wrap').each(function () {
				$(this).accordion({
					header: '> .wponion-accordion-title',
					collapsible: true,
					animate: 250,
					heightStyle: 'content',
					active: $(this).hasClass('is_open'),
					icons: {
						'header': 'dashicons dashicons-arrow-right',
						'activeHeader': 'dashicons dashicons-arrow-down'
					}
				});
			});
		});
	};

	/**
  * Handles Group Field.
  */
	$wpf.fn.group = function () {
		var $this = this,
		    $elem = $this.elem,
		    $add = $elem.find('> .wponion-fieldset > button[data-wponion-group-add]'),
		    $group_wrap = $elem.find('> .wponion-fieldset > .wponion-group-wrap'),
		    $limit = $this.arg('limit'),
		    $error_msg = $this.arg('error_msg');
		wponion_field($elem).accordion();

		$group_wrap.WPOnionCloner({
			add_btn: $add,
			limit: parseInt($limit),
			clone_elem: '> .wponion-fieldset > .wponion-accordion-wrap',
			remove_btn: ".wponion-group-action > button",
			template: $this.arg('group_template'),
			onRemove: function onRemove($elem) {
				$elem.parent().parent().parent().remove();
			},
			templateAfterRender: function templateAfterRender($_wrap) {
				var $data = $group_wrap.find("> .wponion-accordion-wrap:last-child");
				wponion_field($group_wrap).accordion();
				wponion_field($data).reload();
			},
			sortable: {
				items: '.wponion-accordion-wrap',
				handle: '.wponion-accordion-title',
				placeholder: 'wponion-accordion-placeholder',
				start: function start(event, ui) {
					ui.item.css('background-color', '#eeee');
				},
				stop: function stop(event, ui) {
					ui.item.removeAttr('style');
				}

			},
			onLimitReached: function onLimitReached() {
				var $html = $('<div class="alert alert-warning" role="alert">' + $error_msg + '</div>').hide();
				$add.before($html);
				$add.parent().find("div.alert").fadeIn(function () {
					var $__E = $(this);
					setTimeout(function () {
						$__E.fadeOut('slow', function () {
							$__E.remove();
						});
					}, 1000);
				});
			}
		});
	};

	/**
  * Handles WP Links Fields.
  */
	$wpf.fn.wp_links = function () {
		var $this = this,
		    $elem = $this.elem,
		    $textarea = $elem.find('textarea');
		$elem.find('#wponion-wp-link-picker > button').on('click', function () {
			$textarea.val('');
			var $dialog = !window.wpLink && $.fn.wpdialog && $("#wp-link").length ? {
				$link: !1,
				open: function open() {
					this.$link = $('#wp-link').wpdialog({
						title: wpLinkL10n.title,
						width: 480,
						height: "auto",
						modal: !0,
						dialogClass: "wp-dialog",
						zIndex: 3e5
					});
				},
				close: function close() {
					this.$link.wpdialog('close');
				}
			} : window.wpLink;
			$dialog.open($textarea.attr('id'));
		});

		$textarea.on('change', function () {
			var $data = $($(this).val());
			$elem.find('span.example_output span.value').html($(this).val());
			$elem.find("input#url").val($data.attr('href'));
			$elem.find("input#title").val($data.text());
			$elem.find("input#target").val($data.attr('target'));
			$elem.find("span.url span.value").html($data.attr('href'));
			$elem.find("span.title span.value").html($data.text());
			$elem.find("span.target span.value").html($data.attr('target'));
		});
		return this;
	};

	/**
  * Handles Key Value Pair Fields.
  */
	$wpf.fn.keyvalue_pair = function () {
		var $this = this,
		    $elem = $this.elem,
		    $keyvalue_wrap = $elem.find('.wponion-keyvalue_wrap');
		$keyvalue_wrap.WPOnionCloner({
			add_btn: $elem.find('.wponion-fieldset > button[data-wponion-keyvalue-add]'),
			limit: false,
			clone_elem: '> .wponion-fieldset > .wponion-keyvalue-field',
			remove_btn: ".wponion-keyvalue-field > button[data-wponion-keyvalue-remove]",
			template: $this.arg('html_template'),
			templateAfterRender: function templateAfterRender($elem) {
				wphooks.doAction('wponion_key_value_updated', $elem);
			},
			onRemove: function onRemove($elem) {
				$elem.parent().remove();
				wphooks.doAction('wponion_key_value_updated', $elem);
			}
		});
	};

	/**
  * Handles jQuery Tab.
  */
	$wpf.fn.jquery_tab = function () {
		var $this = this,
		    $elem = $this.elem;

		$elem.find('ul.wponion-tab-menus li a').on("click", function (e) {
			e.preventDefault();
			$(this).parent().parent().find('.wponion-tab-current').removeClass('wponion-tab-current');
			$(this).parent().addClass('wponion-tab-current');
			$elem.find('.wponion-tab-page').hide();
			$elem.find('.wponion-tab-page').removeClass('wponion-tab-current');
			var $tab = $(this).attr('data-tab-name');
			$elem.find('div#wponion-tab-' + $tab).addClass('wponion-tab-current').show();
		});

		if ($elem.find('ul.wponion-tab-menus li.current').length > 0) {
			$elem.find('ul.wponion-tab-menus li.current a').trigger('click');
		} else {
			$elem.find('ul.wponion-tab-menus li:first-child a').trigger('click');
		}
	};

	/**
  * Handles Image POPUP View For Gallery.
  * @param $image
  */
	$wpf.fn.image_popup = function ($image) {
		swal({
			imageUrl: $image,
			animation: false,
			background: 'transparent',
			showConfirmButton: false,
			backdrop: 'rgba(0,0,0,0.44)'
		});
	};

	/**
  * Handles Single Image Selectl
  */
	$wpf.fn.image_upload = function () {
		var $this = this,
		    $elem = $this.elem,
		    $input = $elem.find('input#image_id'),
		    $preview_add = $elem.find('.wponion-image-preview .wponion-preview-add'),
		    $preview = $elem.find('.wponion-image-preview .wponion-preview'),
		    wp_media_frame = void 0;

		$input.on('change', function () {
			if ($(this).val() === '') {
				$preview.hide();
				$preview_add.show();
			} else {
				$preview_add.hide();
				$preview.show();
			}

			wphooks.doAction('wponion_image_upload_updated', $input, $preview, $preview_add);
		});

		$preview_add.on('click', function () {
			if (typeof wp === 'undefined' || !wp.media || !wp.media.gallery) {
				return;
			}

			if (wp_media_frame) {
				wp_media_frame.open();
				return;
			}

			wp_media_frame = wp.media({
				library: {
					type: 'image'
				}
			});
			wp_media_frame.on('select', function () {
				var attachment = wp_media_frame.state().get('selection').first().attributes;
				var thumbnail = typeof attachment.sizes !== 'undefined' && typeof attachment.sizes.thumbnail !== 'undefined' ? attachment.sizes.thumbnail.url : attachment.url;
				$preview.find('img').attr('src', thumbnail).attr('data-fullsize', attachment.url);
				$input.val(attachment.id).trigger('change');
			});
			wp_media_frame.open();
		});

		$preview.find(".wponion-remove").on('click', function () {
			$input.val('').trigger('change');
		});

		$preview.on('click', 'img', function () {
			var $_this = $(this),
			    $image = $_this.attr('data-fullsize') !== undefined ? $_this.attr('data-fullsize') : $_this.attr('src');
			$this.image_popup($image);
		});
	};

	/**
  * Handles WordPress Gallery
  */
	$wpf.fn.gallery = function () {
		var $this = this,
		    $elem = $this.elem,
		    $html_temp = $this.arg('html_template'),
		    $input = $elem.find('input#image_id'),
		    $preview = $elem.find('.wponion-image-preview'),
		    wp_media_frame = void 0,
		    $add = $elem.find('button[data-wponion-gallery-add]'),
		    $edit = $elem.find('button[data-wponion-gallery-edit]'),
		    $clear = $elem.find('button[data-wponion-gallery-clear]'),
		    $manage = function $manage($type) {
			var ids = $input.val(),
			    what = $type === 'edit' ? 'edit' : 'add',
			    state = what === 'add' && !ids.length ? 'gallery' : 'gallery-edit';

			if (typeof wp === 'undefined' || !wp.media || !wp.media.gallery) {
				return;
			}

			$preview.html('');

			if (state === 'gallery') {
				wp_media_frame = wp.media({
					library: {
						type: 'image'
					},
					frame: 'post',
					state: 'gallery',
					multiple: true
				});
				wp_media_frame.open();
			} else {
				wp_media_frame = wp.media.gallery.edit('[gallery ids="' + ids + '"]');
				if (what === 'add') {
					wp_media_frame.setState('gallery-library');
				}
			}

			wp_media_frame.on('update', function (selection) {
				var selectedIds = selection.models.map(function (attachment) {
					var item = attachment.toJSON(),
					    thumb = typeof item.sizes.thumbnail !== 'undefined' ? item.sizes.thumbnail.url : item.url,
					    $template = $($html_temp);
					$template.attr('data-wponion-image_id', item.id);
					$template.find("img").attr('data-fullsize', item.url).attr('src', thumb).removeClass('hidde');
					$preview.append($template);
					return item.id;
				});
				$input.val(selectedIds.join(',')).trigger('change');
			});
		};

		$input.on('change', function () {
			if ($(this).val() === '') {
				$add.show();
				$edit.hide();
				$clear.hide();
			} else {
				$edit.show();
				$clear.show();
				$add.hide();
			}
		});

		$add.on('click', function () {
			$manage('add');
		});

		$edit.on('click', function () {
			$manage('edit');
		});

		$clear.on('click', function () {
			$input.val('');
			$preview.html('');
			$clear.hide();
			$edit.hide();
			$add.show();
		});

		$preview.on('click', 'img', function () {
			var $_this = $(this),
			    $image = $_this.attr('data-fullsize') !== undefined ? $_this.attr('data-fullsize') : $_this.attr('src');
			$this.image_popup($image);
		});

		$preview.on('click', 'i.wponion-remove', function () {
			var $parent = $(this).parent(),
			    $image_id = $parent.attr('data-wponion-image_id'),
			    $value = $input.val().split(',');
			$.each($input.val().split(','), function ($k, $v) {
				if ($v === $image_id) {
					$value.splice($k, 1);
				}
			});

			$input.val($value.join(','));
			$parent.fadeOut(function () {
				$(this).remove();
			});
			$input.trigger('change');
		});

		$input.trigger('change');
	};

	/**
  * Handles Color Picker Field.
  */
	$wpf.fn.color_picker = function () {
		this.elem.find('input').wpColorPicker();
	};

	/**
  * Handles Field Dependency.
  * @type {function()}
  */
	$wpf.fn.dependency = function ($elem, $is_sub) {
		if ($elem.find('.wponion-has-dependency').length > 0) {
			var $app = {

				/**
     * Inits dependency framework.
     * @type {function()}
     */
				init: function init() {
					$app.ruleset = $.deps.createRuleset();

					var $config = {
						show: function show($el) {
							$el.show();
						},
						hide: function hide($el) {
							$el.hide();
						},
						log: false, //wpo.settings( 'debug' ),
						checkTargets: false
					};

					if ($is_sub !== undefined) {
						$app.dep_sub();
					} else {
						$app.dep_root();
					}

					$.deps.enable($elem, $app.ruleset, $config);
				},

				dep_root: function dep_root() {
					$elem.find('.wponion-has-dependency').each(function () {
						var $elem = $(this),
						    $dep_data = wpo.field_args($elem, {}),
						    $_rules = $app.ruleset;

						if ($dep_data['dependency'] !== undefined) {
							var $controller = $dep_data['dependency']['controller'],
							    $condition = $dep_data['dependency']['condition'],
							    $value = $dep_data['dependency']['value'];

							$.each($controller, function ($i, $el) {
								var $_value = $value[$i] || '',
								    $_condition = $condition[$i] || $condition[0],
								    $_ruless = $_rules.createRule('[data-depend-id="' + $el + '"]', $_condition, $_value);
								$_ruless.include($elem);
							});
						}
					});
				}
			};

			$app.init();
		}
	};

	$wpf.fn.__dependency = function () {
		var $this = this,
		    $el = $('.wponion-framework'),
		    $base = $this,
		    $dep_data = $this.arg('dependency');

		$base.init = function () {
			$base.ruleset = $.deps.createRuleset();
			var $cgf = {
				log: true, //wpo.is_debug(),
				checkTargets: false
			};

			$base.dep_root();
			$.deps.enable($el, $base.ruleset, $cgf);
		};

		$base.dep_root = function () {
			var $controller = $dep_data['controller'],
			    $condition = $dep_data['condition'],
			    $value = $dep_data['value'],
			    $_rules = $base.ruleset;

			$.each($controller, function ($i, $_el) {
				var $_value = $value[$i] || '',
				    $_condition = $condition[$i] || $condition[0],
				    $_ruless = $_rules.createRule('[data-depend-id="' + $_el + '"]', $_condition, $_value);
				$_ruless.include($el);
			});
		};

		$base.init();
	};

	/**
  * Reloads All Fields Instance. For the given key.
  */
	$wpf.fn.reload = function () {
		wphooks.addAction('wponion_before_fields_reload');
		this.init_field('input[data-wponion-inputmask]', 'inputmask');
		this.init_field('[data-wponion-maxlength]', 'maxlength');
		this.init_field('.wponion-element-icon_picker', 'icon_picker');
		this.init_field('.select2', 'select2');
		this.init_field('.chosen', 'chosen');
		this.init_field('.selectize', 'selectize');
		this.init_field('.wponion-element-accordion', 'accordion');
		this.init_field('.wponion-element-group', 'group');
		this.init_field('.wponion-element-clone', 'clone_element');
		this.init_field('.wponion-field-tooltip', 'field_tooltip');
		this.init_field('.wponion-element-font_picker', 'font_selector');
		this.init_field('.wponion-element-wp_link', 'wp_links');
		this.init_field('.wponion-element-key_value', 'keyvalue_pair');
		this.init_field('.wponion-element-tab', 'jquery_tab');
		this.init_field('.wponion-element-image', 'image_upload');
		this.init_field('.wponion-element-gallery', 'gallery');
		this.init_field('.wponion-element-color_picker', 'color_picker');
		this.field_debug();
		wphooks.addAction('wponion_after_fields_reload');
	};

	/**
  * Hooks With before init to base init / reload fileds.
  */
	wphooks.addAction('wponion_before_init', function () {
		if ($('#wponiontooltipimagetippy').length === 0) {
			$('body').append($('<div id="wponiontooltipimagetippy" style="display: none;min-width:300px;min-height:400px;">Loading.</div>'));
		}

		if ($('.wp-customizer').length > 0) {
			//wponion_field( '.wp-customizer' ).reload();
		}

		if ($('.wponion-framework').length > 0) {
			wponion_field('.wponion-framework').reload();
		}
		//$wpf.fn.dependency( $( '.wponion-framework' ) );
	});
})(window, document, jQuery, $wponion, $wponion_field, wp);
//# sourceMappingURL=wponion-fields.js.map
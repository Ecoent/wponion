import WPOnion_Field from '../core/field';

/* global wponion_field:true */
class field extends WPOnion_Field {
	/**
	 * Inits Field.
	 */
	init() {
		let $arg        = this.handle_args( this.option( 'clone', {} ) );
		let $this       = this,
			$elem       = $this.element,
			$clone_wrap = $elem.find( 'div.wponion-clone-wrap' ),
			$add_btn    = $elem.find( 'button[data-wponion-clone-add]' ),
			//$remove_btn = $clone_wrap.find( 'button[data-wponion-clone-remove]' ),
			$limit      = ( $arg.limit !== undefined ) ? $arg.limit : false,
			//$is_toast   = ( $arg.toast_error !== undefined ) ? $arg.toast_error : true,
			$eror_msg   = $arg.error_msg,
			$sort       = ( $arg.sort !== false ) ? {
				items: '.wponion-field-clone',
				handle: '.wponion-field-clone-sorter',
				placeholder: 'wponion-cloner-placeholder',
				start: ( event, ui ) => ui.item.css( 'background-color', '#eeee' ),
				stop: ( event, ui ) => {
					$elem.trigger( 'change' );
					ui.item.removeAttr( 'style' );
				},
			} : false;

		$clone_wrap.WPOnionCloner( {
			add_btn: $add_btn,
			limit: $limit,
			clone_elem: '.wponion-field-clone',
			remove_btn: '.wponion-clone-action > .wponion-remove',
			template: $this.option( 'clone_template' ),
			templateAfterRender: ( $e ) => {
				$elem.trigger( 'change' );
				wponion_field( $e.find( '> div.wponion-field-clone:last-child' ) ).reload();
			},
			onRemoveAfter: () => $elem.trigger( 'change' ),
			sortable: $sort,
			onLimitReached: function() {
				if( $add_btn.parent().find( 'div.alert' ).length === 0 ) {
					$add_btn.parent().prepend( jQuery( $eror_msg ).hide() );
					$add_btn.parent().find( 'div.alert' ).slideDown();
					window.wponion_notice( $add_btn.parent().find( 'div.alert, div.notice' ) );
				}
			},
			show_animation: $arg.animations.show,
			hide_animation: $arg.animations.hide,
		} );
	}
}

export default ( ( w ) => w.wponion_register_field( 'clone', ( $elem ) => new field( $elem ) ) )( window );

import $wponion from './core';


export default class WPOnion_Validator {
	constructor() {
		this.form  = WPOnion_Validator.get_form();
		this.rules = {
			invalidHandler: () => {
				jQuery( '#publish' ).removeClass( 'button-primary-disabled' );
				jQuery( '#ajax-loading' ).attr( 'style', '' );
				this.form.siblings( '#message' ).remove();
				this.form.before( '<div id="message" class="error"><p>' + $wponion.txt( 'validation_summary' ) + '</p></div>' );
			},
			ignore: false,
			errorPlacement: function( error, element ) {
				element.trigger( 'wponion_js_validation_message', { error, element } );
			},
			errorClass: 'wponion-error',
			errorElement: 'p'
		};
		this.form.validate( this.rules );
	}

	static get_form() {
		if( jQuery( 'form.wponion-form' ).length > 0 ) {
			return jQuery( 'form.wponion-form' );
		}

		if( jQuery( 'form#your-profile' ).length > 0 ) {
			return jQuery( 'form#your-profile' );
		}
		return jQuery( 'form.wponion-form' );
	}
}

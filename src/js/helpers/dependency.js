import WPOnion_Field from '../core/field';
import $wponion from '../core/core';
import $wponion_debug from '../core/debug';

export default class extends WPOnion_Field {
	constructor( $selector, $contxt, $config ) {
		super( $selector, $contxt, $config );
	}

	init() {
		let $dep = this.option( 'dependency' );
		for( let $key in $dep.controller ) {
			let $controller = $dep.controller [ $key ],
				$condition  = $dep.condition [ $key ],
				$value      = $dep.value [ $key ],
				$field      = '[data-depend-id="' + $controller + '"]';
			if( false !== this.config.nestable ) {
				let $INPUT = this.config.parent.find( '[data-depend-id=' + $controller + ']' );
				if( $INPUT.length > 0 ) {
					$field = '[data-wponion-jsid="' + $wponion.fieldID( $INPUT ) + '"]:input';
				}
			}
			this.set_contxt( this.contxt.createRule( $field, $condition, $value ) );
			this.set_contxt( this.contxt.include( this.element ) );
		}
		$wponion_debug.add( this.id(), { 'Dependency': $dep, 'Nestable Dependency': this.config.nestable } );
	}

	field_debug() {
	}
}


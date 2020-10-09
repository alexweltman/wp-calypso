/**
 * External dependencies
 */
import { By } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
import * as driverHelper from '../../driver-helper';
import GutenbergBlockComponent from './gutenberg-block-component';

class TiledGalleryBlockComponent extends GutenbergBlockComponent {
	static blockTitle = 'Tiled Gallery';
	static blockName = 'jetpack/tiled-gallery';
	static blockFrontendSelector = By.css( '.entry-content .wp-block-jetpack-tiled-gallery' );

	/**
	 * Uploads images to the gallery.
	 *
	 * @param {{imageName: string, fileName: string, file: string}[]} filesDetails a list of fileDetails
	 */
	async uploadImages( filesDetails ) {
		const fileInputSelector = By.css( `${ this.blockID } input[type="file"]` );
		const files = filesDetails.map( ( f ) => f.file ).join( '\n ' );

		await driverHelper.setWhenSettable( this.driver, fileInputSelector, files );
	}
}

export { TiledGalleryBlockComponent };

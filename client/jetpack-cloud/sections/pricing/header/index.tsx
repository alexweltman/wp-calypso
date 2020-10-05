/**
 * External dependencies
 */
import React from 'react';
import { useTranslate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FormattedHeader from 'components/formatted-header';
import { preventWidows } from 'lib/formatting';
import JetpackComMasterbar from '../jpcom-masterbar';

/**
 * Style dependencies
 */
import './style.scss';

const Header = () => {
	const translate = useTranslate();

	return (
		<>
			<JetpackComMasterbar />
			<div className="header">
				<FormattedHeader
					className="header__main-title"
					headerText={ preventWidows(
						translate( 'Security, performance, and marketing tools for WordPress' )
					) }
					align="center"
				/>
				<p>
					{ translate(
						'Get everything your site needs, in one package — so you can focus on your business.'
					) }
				</p>
			</div>
		</>
	);
};

export default Header;

/**
 * External dependencies
 */
import React from 'react';
import { Button } from '@automattic/components';

/**
 * Internal dependencies
 */
import { useTranslate } from 'i18n-calypso';

/**
 * Style dependencies
 */
import './style.scss';

const JetpackFreeCardAlt = () => {
	const translate = useTranslate();

	const freeFeatures = [
		translate( 'Site stats' ),
		translate( 'Brute force attack protection' ),
		translate( 'Content Delivery Network' ),
		translate( 'Automated social media posting' ),
		translate( 'Downtime monitoring' ),
		translate( 'Activity Log' ),
	];

	return (
		<div className="jetpack-free-card-alt">
			<div className="jetpack-free-card-alt__main">
				<header>
					<h2>{ translate( 'Jetpack Free' ) }</h2>
					<div className="jetpack-free-card-alt__subheadline">
						{ translate( 'Included for free with all products' ) }
					</div>
				</header>
				<Button primary>{ translate( 'Start for free' ) }</Button>
			</div>
			<div className="jetpack-free-card-alt__features">
				{ freeFeatures.map( ( feature ) => (
					<div className="jetpack-free-card-alt__feature">{ feature }</div>
				) ) }
			</div>
		</div>
	);
};

export default JetpackFreeCardAlt;

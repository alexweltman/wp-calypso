/**
 * External dependencies
 */
import page from 'page';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import { recordTracksEvent } from 'calypso/state/analytics/actions/record';
import PlansFilterBar from './plans-filter-bar';
import { EXTERNAL_PRODUCTS_LIST } from './constants';
import { getPathToDetails, getPathToUpsell, checkout } from './utils';
import QueryProducts from './query-products';
import useHasProductUpsell from './use-has-product-upsell';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import { getYearlyPlanByMonthly } from 'calypso/lib/plans';
import { TERM_ANNUALLY } from 'calypso/lib/plans/constants';
import { getSelectedSiteId, getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import { managePurchase } from 'calypso/me/purchases/paths';
import Main from 'calypso/components/main';
import QuerySitePurchases from 'calypso/components/data/query-site-purchases';
import QuerySites from 'calypso/components/data/query-sites';
import QueryProductsList from 'calypso/components/data/query-products-list';
import ProductsGridAlt from './products-grid-alt';

/**
 * Type dependencies
 */
import type { Duration, SelectorPageProps, SelectorProduct, PurchaseCallback } from './types';
import type { ProductSlug } from 'calypso/lib/products-values/types';

import './style.scss';

const SelectorPageAlt = ( {
	defaultDuration = TERM_ANNUALLY,
	siteSlug: siteSlugProp,
	rootUrl,
	urlQueryArgs,
	header,
	footer,
}: SelectorPageProps ) => {
	const dispatch = useDispatch();

	const siteId = useSelector( ( state ) => getSelectedSiteId( state ) );
	const siteSlugState = useSelector( ( state ) => getSelectedSiteSlug( state ) ) || '';
	const siteSlug = siteSlugProp || siteSlugState;
	const hasUpsell = useHasProductUpsell();
	const [ currentDuration, setDuration ] = useState< Duration >( defaultDuration );

	useEffect( () => {
		setDuration( defaultDuration );
	}, [ defaultDuration ] );

	// Sends a user to a page based on whether there are subtypes.
	const selectProduct: PurchaseCallback = (
		product: SelectorProduct,
		isUpgradeableToYearly = false,
		purchase
	) => {
		if ( EXTERNAL_PRODUCTS_LIST.includes( product.productSlug ) ) {
			dispatch(
				recordTracksEvent( 'calypso_product_external_click', {
					site_id: siteId || undefined,
					product_slug: product.productSlug,
					duration: currentDuration,
				} )
			);
			window.location.href = product.externalUrl || '';
			return;
		}

		if ( purchase && isUpgradeableToYearly ) {
			dispatch(
				recordTracksEvent( 'calypso_product_checkout_click', {
					site_id: siteId || undefined,
					product_slug: product.productSlug,
					duration: currentDuration,
				} )
			);
			checkout( siteSlug, getYearlyPlanByMonthly( product.productSlug ), urlQueryArgs );
			return;
		}

		if ( purchase ) {
			dispatch(
				recordTracksEvent( 'calypso_product_manage_click', {
					site_id: siteId || undefined,
					product_slug: product.productSlug,
					duration: currentDuration,
				} )
			);
			page( managePurchase( siteSlug, purchase.id ) );
			return;
		}

		if ( product.subtypes.length ) {
			dispatch(
				recordTracksEvent( 'calypso_product_subtypes_click', {
					site_id: siteId || undefined,
					product_slug: product.productSlug,
					duration: currentDuration,
				} )
			);
			page(
				getPathToDetails( rootUrl, urlQueryArgs, product.productSlug, currentDuration, siteSlug )
			);
			return;
		}

		if ( hasUpsell( product.productSlug as ProductSlug ) ) {
			dispatch(
				recordTracksEvent( 'calypso_product_upsell_click', {
					site_id: siteId || undefined,
					product_slug: product.productSlug,
					duration: currentDuration,
				} )
			);
			page(
				getPathToUpsell( rootUrl, urlQueryArgs, product.productSlug, currentDuration, siteSlug )
			);
			return;
		}

		dispatch(
			recordTracksEvent( 'calypso_product_checkout_click', {
				site_id: siteId || undefined,
				product_slug: product.productSlug,
				duration: currentDuration,
			} )
		);
		checkout( siteSlug, product.productSlug, urlQueryArgs );
	};

	const trackDurationChange = ( selectedDuration: Duration ) => {
		if ( selectedDuration === currentDuration ) {
			return;
		}

		dispatch(
			recordTracksEvent( 'calypso_plans_duration_change', {
				site_id: siteId || undefined,
				duration: selectedDuration,
			} )
		);
		setDuration( selectedDuration );
	};

	const viewTrackerPath = siteId ? `${ rootUrl }/:site` : rootUrl;
	const viewTrackerProps = siteId ? { site: siteSlug } : {};

	return (
		<Main className="selector-alt__main" wideLayout>
			<PageViewTracker path={ viewTrackerPath } properties={ viewTrackerProps } title="Plans" />

			{ header }

			<PlansFilterBar
				showDurations
				onDurationChange={ trackDurationChange }
				duration={ currentDuration }
			/>

			<ProductsGridAlt
				duration={ currentDuration }
				onSelectProduct={ selectProduct }
				urlQueryArgs={ urlQueryArgs }
			/>

			<QueryProductsList />
			<QueryProducts />
			{ siteId && <QuerySitePurchases siteId={ siteId } /> }
			{ siteId && <QuerySites siteId={ siteId } /> }

			{ footer }
		</Main>
	);
};

export default SelectorPageAlt;

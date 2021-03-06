/**
 * Internal dependencies
 */
import { GUTENBERG_IFRAME_ELIGIBLE_SET } from 'state/action-types';
import { keyedReducer, withStorageKey } from 'state/utils';

export const gutenbergIframeEligible = ( state, { type, isEligibleForGutenframe } ) =>
	type === GUTENBERG_IFRAME_ELIGIBLE_SET ? isEligibleForGutenframe : state;

const reducer = keyedReducer( 'siteId', gutenbergIframeEligible );

export default withStorageKey( 'gutenbergIframeEligible', reducer );

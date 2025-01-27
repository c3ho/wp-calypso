import debugFactory from 'debug';
import wpcom from 'calypso/lib/wp';
import { isJetpackSite } from 'calypso/state/sites/selectors';
import {
	ACTIVE_THEME_REQUEST_FAILURE,
	ACTIVE_THEME_REQUEST_SUCCESS,
	ACTIVE_THEME_REQUEST,
} from 'calypso/state/themes/action-types';
import { receiveTheme } from 'calypso/state/themes/actions/receive-theme';

import 'calypso/state/themes/init';

const debug = debugFactory( 'calypso:themes:actions' );

/**
 * This action queries wpcom endpoint for active theme for site.
 * If request success information about active theme is stored in Redux themes subtree.
 * In case of error, error is stored in Redux themes subtree.
 *
 * @param  {number}   siteId Site for which to check active theme
 * @returns {Function}        Redux thunk with request action
 */
export function requestActiveTheme( siteId ) {
	return ( dispatch, getState ) => {
		dispatch( {
			type: ACTIVE_THEME_REQUEST,
			siteId,
		} );

		return wpcom
			.undocumented()
			.activeTheme( siteId )
			.then( ( theme ) => {
				debug( 'Received current theme', theme );
				// We want to store the theme object in the appropriate Redux subtree -- either 'wpcom'
				// for WPCOM sites, or siteId for Jetpack sites.
				const siteIdOrWpcom = isJetpackSite( getState(), siteId ) ? siteId : 'wpcom';
				dispatch( receiveTheme( theme, siteIdOrWpcom ) );
				dispatch( {
					type: ACTIVE_THEME_REQUEST_SUCCESS,
					siteId,
					theme,
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: ACTIVE_THEME_REQUEST_FAILURE,
					siteId,
					error,
				} );
			} );
	};
}

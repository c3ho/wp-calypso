import { SIGNUP_STEPS_SITE_VERTICAL_SET } from 'calypso/state/action-types';
import { submitSignupStep } from 'calypso/state/signup/progress/actions';

import 'calypso/state/signup/init';

/**
 * Action creator: Set site vertical data
 *
 * @param {object} siteVerticalData An object containing `isUserInput`, `name`, `preview` and `slug` vertical values.
 * @returns {object} The action object.
 */
export function setSiteVertical( siteVerticalData ) {
	return {
		type: SIGNUP_STEPS_SITE_VERTICAL_SET,
		...siteVerticalData,
	};
}

/**
 * TODO: It was a thunk since there used to be Flux involved, but now it can be converted to a plain object.
 * We can just keep setSiteVertical() and keep all the dependency filling and progress filling in a middleware.
 *
 * @param {object} siteVerticalData An object containing `isUserInput`, `name`, `preview` and `slug` vertical values.
 * @param {string} stepName The name of the step to submit. Default is `site-topic`
 * @param {string} suggestedTheme Fulfills the theme dependency if this vertical has a suggested theme e.g. `pub/maywood`
 * @returns {Function} A thunk
 */
export const submitSiteVertical = (
	siteVerticalData,
	stepName = 'site-topic',
	suggestedTheme = undefined
) => ( dispatch ) => {
	dispatch( setSiteVertical( siteVerticalData ) );
	dispatch(
		submitSignupStep(
			{ stepName },
			{
				siteTopic: siteVerticalData.name,
				...( 'site-topic-with-theme' !== stepName &&
					suggestedTheme && { themeSlugWithRepo: suggestedTheme } ),
			}
		)
	);
};

import { keyToString } from 'calypso/reader/post-key';
import {
	READER_EXPAND_CARD,
	READER_RESET_CARD_EXPANSIONS,
} from 'calypso/state/reader/action-types';

export default ( state = {}, action ) => {
	switch ( action.type ) {
		case READER_EXPAND_CARD: {
			if ( ! action.payload.postKey ) {
				return state;
			}

			const { postKey } = action.payload;

			return {
				...state,
				[ keyToString( postKey ) ]: true,
			};
		}
		case READER_RESET_CARD_EXPANSIONS:
			return {};
	}

	return state;
};

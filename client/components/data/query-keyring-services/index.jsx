import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { requestKeyringServices } from 'calypso/state/sharing/services/actions';
import { isKeyringServicesFetching } from 'calypso/state/sharing/services/selectors';

class QueryKeyringServices extends Component {
	UNSAFE_componentWillMount() {
		if ( ! this.props.isRequesting ) {
			this.props.requestKeyringServices();
		}
	}

	render() {
		return null;
	}
}

QueryKeyringServices.propTypes = {
	isRequesting: PropTypes.bool,
	requestKeyringServices: PropTypes.func,
};

export default connect(
	( state ) => ( {
		isRequesting: isKeyringServicesFetching( state ),
	} ),
	{ requestKeyringServices }
)( QueryKeyringServices );

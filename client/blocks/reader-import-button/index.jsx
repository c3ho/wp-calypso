import { Gridicon } from '@automattic/components';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import FilePicker from 'calypso/components/file-picker';
import wpcom from 'calypso/lib/wp';
import { successNotice, errorNotice } from 'calypso/state/notices/actions';

import './style.scss';

const noop = () => {};

class ReaderImportButton extends Component {
	static propTypes = {
		borderless: PropTypes.bool,
		onProgress: PropTypes.func,
	};

	static defaultProps = {
		borderless: true,
		onProgress: noop,
	};

	state = { disabled: false };

	onClick = ( event ) => {
		// Don't allow picking of a new file if there's an import in progress
		if ( this.state.disabled ) {
			event.preventDefault();
		}
	};

	onPick = ( files ) => {
		// We only care about the first file in the list
		const file = files[ 0 ];
		if ( ! file ) {
			return;
		}

		this.fileName = file.name;
		const req = wpcom.undocumented().importReaderFeed( file, this.onImport );
		req.upload.onprogress = this.onImportProgress;

		this.setState( {
			disabled: true,
		} );
	};

	onImport = ( err, data ) => {
		this.setState( {
			disabled: false,
		} );

		if ( err ) {
			this.onImportFailure( err );
		} else {
			// Tack on the file name since it will be displayed in the UI
			data.fileName = this.fileName;
			this.onImportSuccess( data );
		}
	};

	onImportProgress = ( event ) => {
		this.props.onProgress( event );
	};

	onImportSuccess = ( feedImport ) => {
		const message = this.props.translate(
			"{{em}}%(name)s{{/em}} has been received. You'll get an email when your import is complete.",
			{
				args: { name: feedImport.fileName },
				components: { em: <em /> },
			}
		);
		this.props.successNotice( message );
	};

	onImportFailure = ( error ) => {
		if ( ! error ) {
			return null;
		}

		const message = this.props.translate(
			'Whoops, something went wrong. %(message)s Please try again.',
			{
				args: { message: error.message ? error.message + '.' : null },
			}
		);
		this.props.errorNotice( message );
	};

	render() {
		return (
			// .button.is-borderless is from Button in '@automattic/components';
			<div
				className={ `reader-import-button button ${
					this.props.borderless ? 'is-borderless' : ''
				}` }
			>
				<FilePicker accept=".xml,.opml" onClick={ this.onClick } onPick={ this.onPick }>
					<Gridicon icon="cloud-upload" className="reader-import-button__icon" />
					<span className="reader-import-button__label">{ this.props.translate( 'Import' ) }</span>
				</FilePicker>
			</div>
		);
	}
}

export default connect( null, { successNotice, errorNotice } )( localize( ReaderImportButton ) );

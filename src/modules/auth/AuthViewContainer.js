// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../../redux/users/actions';

import AuthView from './AuthView';

function mapStateToProps(state, props) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(userActions, dispatch);
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(AuthView);

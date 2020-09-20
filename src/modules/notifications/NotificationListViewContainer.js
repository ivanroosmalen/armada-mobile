// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import NotificationListView from './NotificationListView';
import { list, create, update, remove } from '../../redux/notifications/actions.js'
import { getUserAcademies } from '../../redux/academies/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      notifications: state.notifications.notifications,
      userAcademies: state.academies.userAcademies
    })},
    dispatch => ({
      getNotifications: (params) => dispatch(list(params)),
      createNotification: (data) => dispatch(create(data)),
      updateNotification: (id, data) => dispatch(update(id, data)),
      deleteNotification: (id) => dispatch(remove(id)),
      getUserAcademies: (id, params) => dispatch(getUserAcademies(id, params))
    }),
  ))(NotificationListView);

import React from 'react'
import Alert from '@material-ui/lab/Alert'
import Zoom from '@material-ui/core/Zoom'
import styled from 'styled-components'
import Elements from '../shared-elements'
import { Booking, NotificationType, Vehicle } from '../types'

const NotificationsContaioner = styled.div`
  width: 25%;
  position: absolute;
  z-index: 30;
  bottom: 0;
  right: 0;
  margin: 2rem 2rem;

  & > * + * {
    margin-top: 2rem;
  }

  > div {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid grey;
  }
`

const BookingNotification: React.FC<{
  booking: Booking
  handleOnClose: (value: string) => void
}> = ({ booking, handleOnClose }) => (
  <Zoom in={Boolean(booking)}>
    <Alert
      onClose={() => handleOnClose(booking.id)}
      key={booking.id}
      severity="success"
    >
      En ny bokning har lags till
      <Elements.Links.RoundedLink
        margin="0 0.5rem"
        to={`/bookings/${booking.id}`}
      >
        {booking.id}
      </Elements.Links.RoundedLink>
    </Alert>
  </Zoom>
)

const VehicleNotification: React.FC<{
  vehicle: Vehicle
  handleOnClose: (value: string) => void
}> = ({ vehicle, handleOnClose }) => (
  <Zoom in={Boolean(vehicle)}>
    <Alert
      onClose={() => handleOnClose(vehicle.id)}
      key={vehicle.id}
      severity="success"
    >
      En ny transport har lags till
      <Elements.Links.RoundedLink
        margin="0 0.5rem"
        to={`/transports/${vehicle.id}`}
      >
        {vehicle.id}
      </Elements.Links.RoundedLink>
    </Alert>
  </Zoom>
)

const Notifications: React.FC<{
  notifications: NotificationType[]
  updateNotifications: (value: any) => void
}> = ({ notifications, updateNotifications }) => {
  React.useEffect(() => {
    if (notifications.length > 0) {
      setTimeout(() => {
        updateNotifications(() => notifications.slice(1))
      }, 10000)
    }
  }, [notifications])

  const notificationType = (notification: NotificationType) => {
    switch (true) {
      case notification.id.includes('pmv-'):
        return (
          <VehicleNotification
            key={notification.id}
            handleOnClose={handleOnClose}
            vehicle={notification}
          />
        )

      case notification.id.includes('pmb-'):
        return (
          <BookingNotification
            key={notification.id}
            handleOnClose={handleOnClose}
            booking={notification as Booking}
          />
        )

      default:
        return
    }
  }

  const handleOnClose = (itemId: string) => {
    updateNotifications((notifications: NotificationType[]) =>
      notifications.filter((notification) => notification.id !== itemId)
    )
  }

  return (
    <NotificationsContaioner>
      {notifications.length > 0 &&
        notifications
          .map((notification) => notificationType(notification))
          .reverse()}
    </NotificationsContaioner>
  )
}

export default Notifications

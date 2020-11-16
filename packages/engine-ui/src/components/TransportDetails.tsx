import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import * as Elements from '../shared-elements'
import RouteActivities from './RouteActivities'
import MainRouteLayout from './layout/MainRouteLayout'
import { useParams } from 'react-router-dom'
import * as Icons from '../assets/Icons'
import { FlyToInterpolator } from 'react-map-gl'
import * as stores from '../utils/state/stores'
import * as helpers from '../utils/helpers'
import { Transport } from '../types'

const Line = styled.div`
  border-top: 1px solid #dedede;
  margin: 1rem 0;
`

const Paragraph = styled.p`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

const RouteTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 10%;
  align-items: baseline;
  justify-items: flex-start;
  width: 100%;
  margin-bottom: 0.5rem;

  button {
    background: none;
    border: none;
    justify-self: end;
  }

  button:focus {
    outline: none;
  }
`

const TransportDetails: React.FC<{
  transports: Transport[]
  deleteTransport: (id: string) => void
  onUnmount: () => void
}> = ({ transports, deleteTransport, onUnmount }) => {
  const setMap = stores.map((state) => state.set)
  const history = useHistory()

  const [showInfo, setShowInfo] = React.useState({
    route: false,
    bookings: false,
    status: false,
  })

  React.useEffect(() => () => onUnmount(), [onUnmount])

  const { transportId } = useParams<{ transportId: string }>()
  const transport = transports.find((v) => v.id === transportId)

  if (!transports.length) return <p>Laddar...</p>

  if (!transport)
    return (
      <p>
        Kunde inte hitta transport med id: <b>{transportId}</b>
      </p>
    )

  const handleDeleteClick = (transportId: string) => {
    if (window.confirm('Är du säker på att du vill radera transporten?')) {
      deleteTransport(transportId)
      return history.push('/transports')
    }
  }

  const handleBookingClick = (bookingId: string) => {
    const activity = transport?.activities?.find(
      (activity) => activity.id === bookingId
    )

    return setMap({
      latitude: activity?.address.lat,
      longitude: activity?.address.lon,
      zoom: 14,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t: number) => t * (2 - t),
    })
  }

  return (
    <MainRouteLayout redirect={'/transports'}>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Transport</h3>
          <Elements.Typography.RoundedLabelDisplay
            margin="0 0.5rem"
            backgroundColor={transport.color}
          >
            {transport.metadata.profile?.toUpperCase() ||
              helpers.getLastFourChars(transportId).toUpperCase()}
          </Elements.Typography.RoundedLabelDisplay>
        </Elements.Layout.FlexRowWrapper>
        {transport.capacity && (
          <>
            <Elements.Typography.StrongParagraph>
              Kapacitet
            </Elements.Typography.StrongParagraph>
            <Paragraph>Maxvolym: {transport.capacity.volume}m3</Paragraph>
            <Paragraph>Maxvikt: {transport.capacity.weight}kg</Paragraph>
          </>
        )}
        <Elements.Typography.StrongParagraph>
          Körschema
        </Elements.Typography.StrongParagraph>
        <Elements.Layout.FlexRowWrapper>
          <Paragraph>
            {transport.earliest_start} - {transport.latest_end}
          </Paragraph>
        </Elements.Layout.FlexRowWrapper>
        {transport.end_address.name && (
          <>
            <Elements.Typography.StrongParagraph>
              Slutposition
            </Elements.Typography.StrongParagraph>
            <Paragraph>{transport.end_address.name}</Paragraph>
          </>
        )}
        <Line />

        {transport.activities && transport.activities.length > 0 ? (
          <>
            <Elements.Layout.MarginBottomContainer>
              <RouteTitleWrapper>
                <Elements.Typography.StrongParagraph>
                  Bokningar på fordon
                </Elements.Typography.StrongParagraph>
                <button
                  onClick={() => {
                    setShowInfo((showInfo) => ({
                      bookings: !showInfo.bookings,
                      route: false,
                      status: false,
                    }))
                  }}
                >
                  <Icons.Arrow active={showInfo.bookings} />
                </button>
              </RouteTitleWrapper>
              {showInfo.bookings && (
                <Elements.Layout.LinkListContainer>
                  {transport.booking_ids?.map((bookingId) => (
                    <Elements.Links.RoundedLink
                      to={`/bookings/${bookingId}`}
                      key={bookingId}
                      onClick={() => handleBookingClick(bookingId)}
                    >
                      {helpers.getLastFourChars(bookingId).toUpperCase()}
                    </Elements.Links.RoundedLink>
                  ))}
                </Elements.Layout.LinkListContainer>
              )}
            </Elements.Layout.MarginBottomContainer>
            <Elements.Layout.MarginBottomContainer>
              <RouteTitleWrapper>
                <Elements.Typography.StrongParagraph>
                  Rutt
                </Elements.Typography.StrongParagraph>
                <button
                  onClick={() => {
                    setShowInfo((showInfo) => ({
                      route: !showInfo.route,
                      bookings: false,
                      status: false,
                    }))
                  }}
                >
                  <Icons.Arrow active={showInfo.route} />
                </button>
              </RouteTitleWrapper>
              {showInfo.route && <RouteActivities route={transport} />}
            </Elements.Layout.MarginBottomContainer>
            <Elements.Layout.MarginBottomContainer>
              <RouteTitleWrapper>
                <Elements.Typography.StrongParagraph>
                  Status
                </Elements.Typography.StrongParagraph>
                <button
                  onClick={() => {
                    setShowInfo((showInfo) => ({
                      status: !showInfo.status,
                      bookings: false,
                      route: false,
                    }))
                  }}
                >
                  <Icons.Arrow active={showInfo.status} />
                </button>
              </RouteTitleWrapper>
              {showInfo.status && (
                <Elements.Typography.NoInfoParagraph>
                  Det finns ingen status för detta fordonet ännu...
                </Elements.Typography.NoInfoParagraph>
              )}
            </Elements.Layout.MarginBottomContainer>
          </>
        ) : (
          <>
            <Elements.Typography.StrongParagraph>
              Bokningar på fordon
            </Elements.Typography.StrongParagraph>
            <Elements.Typography.NoInfoParagraph>
              Inga bekräftade bokningar
            </Elements.Typography.NoInfoParagraph>
            <Line />
            <Elements.Typography.StrongParagraph>
              Rutt
            </Elements.Typography.StrongParagraph>
            <Elements.Typography.NoInfoParagraph>
              Ingen rutt planerad
            </Elements.Typography.NoInfoParagraph>
          </>
        )}
        <Elements.Layout.MarginTopContainer alignItems="center">
          <Elements.Buttons.CancelButton
            onClick={() => handleDeleteClick(transport.id)}
          >
            Radera transport
          </Elements.Buttons.CancelButton>
        </Elements.Layout.MarginTopContainer>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default TransportDetails

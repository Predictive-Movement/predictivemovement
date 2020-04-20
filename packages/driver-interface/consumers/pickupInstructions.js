const {
  open,
  queues: { PICKUP_INSTRUCTIONS },
} = require('../adapters/amqp')

//   .then((conn) => conn.createChannel())
//   .then((ch) =>
//     ch
//     .assertQueue(queues.DELIVERY_REQUESTS)
//     .then(() =>
//       ch.assertExchange(exchanges.DELIVERY_REQUESTS, 'fanout', {
//         durable: false,
//       })
//     )
//     .then(() =>
//       ch.bindQueue(queues.DELIVERY_REQUESTS, exchanges.DELIVERY_REQUESTS)
//     )
//   )

const pickupInstructions = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(PICKUP_INSTRUCTIONS, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange('booking_assignments', 'fanout', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(PICKUP_INSTRUCTIONS, 'booking_assignments'))
        .then(
          () =>
            new Promise((resolve) => {
              ch.consume(PICKUP_INSTRUCTIONS, (msg) => {
                const message = JSON.parse(msg.content.toString())
                ch.ack(msg)
                resolve(message)
              })
            })
        )
        .then((instructions) => {
          bot.telegram.sendMessage(
            instructions.id,
            `Bra du ska nu åka hit [Starta GPS](https://www.google.com/maps/dir/?api=1&&destination=${instructions.booking.departure.lat},${instructions.booking.departure.lon})`,
            {
              parse_mode: 'markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Hämtat',
                      callback_data: 'confirm',
                    },
                  ],
                ],
              },
            }
          )
        })
    )
}

module.exports = pickupInstructions

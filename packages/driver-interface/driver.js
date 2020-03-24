const { open } = require('./amqp')

const init = bot => {
  bot.on('message', ctx => {
    const msg = ctx.message
    onMessage(msg)
  })

  bot.on('edited_message', ctx => {
    const msg = ctx.update.edited_message
    onMessage(msg)
  })

  const onMessage = msg => {
    if (!msg.location) return

    const position = {
      lon: msg.location.longitude,
      lat: msg.location.latitude,
    }

    const username = msg.from.username
    const message = {
      username,
      id: msg.from.id,
      chatId: msg.chat.id,
      position,
      date: Date(msg.edit_date),
    }

    updateLocation(message)
  }

  const updateLocation = msg => {
    // Publisher
    open
      .then(conn => conn.createChannel())
      .then(ch =>
        ch
          .assertExchange('cars', 'fanout', { durable: false })
          .then(() => ch.publish('cars', '', Buffer.from(JSON.stringify(msg))))
      )
      .catch(console.warn)
  }

  const bookingsRequest = (msg, isAccepted) => {
    const exchange = 'bookings'
    return open
      .then(conn => conn.createChannel())
      .then(ch =>
        ch.assertExchange(exchange, 'headers', { durable: false }).then(() =>
          ch.publish(exchange, '', Buffer.from(JSON.stringify(msg)), {
            headers: { isAccepted },
          })
        )
      )
      .catch(console.warn)
  }

  bot.action('accept', (ctx, next) => {
    console.log('ctx from accept', ctx)
    return bookingsRequest(ctx, true).then(() =>
      ctx.reply('bokningen är din!').then(() => next())
    )
  })

  bot.action('denial', (ctx, next) => {
    return bookingsRequest(ctx, false).then(() =>
      ctx.reply('Okej! Vi letar vidare :)').then(() => next())
    )
  })
}

module.exports = {
  init,
}

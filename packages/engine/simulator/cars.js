/* eslint-disable no-undef */
const _ = require('highland')
const { randomize } = require('./address')
const Car = require('../lib/car')
//const positions = require('./positions')
const range = length => Array.from({ length }).map((value, i) => i)

function generateCar(nr) {
  return _(
    Promise.all([randomize(), randomize()])
      .then(fromTo => {
        const car = new Car(nr, fromTo[0])
        car.position = fromTo[0]
        car.navigateTo(fromTo[1])
        car.on('dropoff', () => {
          randomize().then(position => car.navigateTo(position))
        })
        return car
      })
      .catch(err => console.error('simulation error', err)),
  )
}

module.exports = _(range(50))
  .flatMap(generateCar)
  .errors(err => console.error('initialize error', err))
  .map(car => _('moved', car))
  .errors(err => console.error('move error', err))
  .merge()

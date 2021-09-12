var randomNumber = 0

module.exports = {
  getRandomNumber: function (minNum, maxNum) {
    randomNumber = Math.floor(Math.random() * maxNum)

    while (randomNumber < minNum) {
      randomNumber = Math.floor(Math.random() * maxNum)
    }
    return randomNumber
  }
}

exports.generateCode = function () {
  const number1 = Math.round(Math.random() * 36)
    .toString()
    .substr(0, 1);
  const number2 = Math.round(Math.random() * 36)
    .toString()
    .substr(0, 1);
  //prettier-ignore
  const letter1 = (Math.random() * 26)
    .toString(26)
    .replace(/[^a-z]+/g, '')
    .substr(0, 1)
    .toUpperCase();
  const letter2 = (Math.random() * 26)
    .toString(26)
    .replace(/[^a-z]+/g, '')
    .substr(0, 1)
    .toUpperCase();

  return `${letter1}${number1}${number2}${letter2}`;
};

exports.customInvestmentError = function (message) {
  const msg = message.substr(message.indexOf('O valor'), message.length);
  return msg;
};

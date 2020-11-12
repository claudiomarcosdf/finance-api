const restful = require('node-restful');
const mongoose = restful.mongoose;

const beautifyUnique = require('mongoose-beautiful-unique-validation');

function generateCode() {
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
}

const investmentSchema = new mongoose.Schema({
  date_input: { type: Date, required: true, default: Date.now },
  capital: { type: Number, required: true, min: 0.0 },
  months: { type: Number, required: true, enum: [6, 12, 18, 24] },
  rentability: { type: Number, required: true },
});

const residence = {
  address: { type: String },
  city: { type: String },
  uf: { type: String },
  cep: { type: String },
};

const contact = {
  cellphone1: { type: String },
  cellphone2: { type: String },
  phone: { type: String },
};

const checkingCopy = {
  cpf_img: { type: String },
  rg_img: { type: String },
  residence_img: { type: String },
};

const personalDataSchema = new mongoose.Schema({
  photo_name: { type: String }, //tipo_+code ex. ft_D48E.jpg
  cpf: { type: String, unique: true, required: true },
  rg: { type: String },
  gender: { type: String, enum: ['Masculino', 'Feminino'] },
  nationality: { type: String },
  civil_status: {
    type: String,
    enum: ['Solteiro', 'Casado', 'Viúvo', 'Divorciado'],
  },
  father_name: { type: String },
  mother_name: { type: String },
  residence: { type: residence },
  contacts: { type: contact },
  indicated: { type: String },
  checking_copy: { type: checkingCopy },
});

const bankDataSchema = new mongoose.Schema({
  agency: { type: String },
  account_number: { type: String },
  bank: { type: String },
});

const profileSchema = new mongoose.Schema({
  score: { type: Number },
});

const customerSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: generateCode(),
  },
  name: { type: String },
  email: { type: String },
  password: { type: String, required: true, min: 6, max: 12 },
  birthday: { type: Date },
  status: { type: String, enum: ['ATIVO', 'INATIVO'], default: 'ATIVO' },
  personal_data: { type: personalDataSchema },
  profile: { type: profileSchema },
  bank_data: { type: bankDataSchema },
  investments: { type: [investmentSchema] },
});

customerSchema.plugin(beautifyUnique);
module.exports = restful.model('customer', customerSchema);

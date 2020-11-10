const restful = require('node-restful');
const mongoose = restful.mongoose;

const beautifyUnique = require('mongoose-beautiful-unique-validation');

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

const personalDataSchema = new mongoose.Schema({
  cpf: { type: String, unique: true, required: true },
  rg: { type: String },
  gender: { type: String, enum: ['M', 'F'] },
  nationality: { type: String },
  civil_status: { type: String, enum: ['S', 'C', 'V', 'D'] },
  father_name: { type: String },
  mother_name: { type: String },
  residence: { type: residence },
  contacts: { type: contact },
});

const bankDataSchema = new mongoose.Schema({
  agency: { type: String },
  account_number: { type: String },
  bank: { type: String },
});

const profileSchema = new mongoose.Schema({
  note: { type: Number },
});

const customerSchema = new mongoose.Schema({
  code: { type: String, minlength: 4, maxlength: 4 },
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

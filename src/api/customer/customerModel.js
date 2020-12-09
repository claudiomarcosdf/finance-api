const restful = require('node-restful');
const mongoose = restful.mongoose;

const beautifyUnique = require('mongoose-beautiful-unique-validation');
const { generateCode } = require('../common/helpers');

const investmentSchema = new mongoose.Schema({
  date_input: { type: Date, required: true, default: Date.now },
  capital: { type: Number, required: true, min: 0.0 },
  months: {
    type: Number,
    required: true,
    enum: [6, 12, 18, 24],
  },
  interest: { type: Number },
  rentability: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      '',
      'Em análise',
      'Aguardando comprovante',
      'Depósito a confirmar',
      'Aprovado e aplicado',
      'Cancelado',
      'Resgate solicitado',
      'Finalizado',
      '',
    ],
    default: 'Aguardando comprovante',
  },
  voucher_url: { type: String },
  voucher_name: { type: String },
});

const residence = {
  address: { type: String },
  complement: { type: String },
  city: { type: String },
  uf: { type: String },
  cep: { type: String },
};

const contact = {
  cellphone1: { type: String },
  cellphone2: { type: String },
  phone: { type: String },
};

const docs = {
  cpf_url: { type: String },
  cpf_name: { type: String },
  rg_url: { type: String },
  rg_name: { type: String },
  residence_url: { type: String },
  residence_name: { type: String },
};

const personalDataSchema = new mongoose.Schema({
  photo_url: { type: String },
  photo_name: { type: String },
  cpf: { type: String, unique: true, required: true },
  rg: { type: String },
  gender: { type: String, enum: ['', 'Masculino', 'Feminino'] },
  nationality: { type: String },
  civil_status: {
    type: String,
    enum: ['', 'Solteiro(a)', 'Casado(a)', 'Viúvo(a)', 'Divorciado(a)'],
  },
  father_name: { type: String },
  mother_name: { type: String },
  residence: { type: residence },
  contacts: { type: contact },
  indicated: { type: String },
  documents: { type: docs },
});

const bankDataSchema = new mongoose.Schema({
  agency: { type: String },
  account_number: { type: String },
  bank: { type: String },
});

const profileSchema = new mongoose.Schema({
  score: { type: Number },
  date_at: { type: Date },
});

const customerSchema = new mongoose.Schema({
  code: {
    type: String,
    // default: generateCode(),
    unique: 'O código {VALUE} está sendo usado por outro cliente.',
  },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 6, max: 12 },
  birthday: { type: Date },
  status: { type: String, enum: ['ATIVO', 'INATIVO'], default: 'ATIVO' },
  personal_data: { type: personalDataSchema },
  profile: { type: profileSchema },
  bank_data: { type: bankDataSchema },
  investments: { type: [investmentSchema] },
  account_date: { type: Date, default: Date.now },
});

customerSchema.pre('save', function () {
  if (!this.code) this.code = generateCode();
});

customerSchema.plugin(beautifyUnique);
module.exports = restful.model('customer', customerSchema);

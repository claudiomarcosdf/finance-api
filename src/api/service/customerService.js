const Customer = require('../customer/customerModel');
const errorHandler = require('../common/errorHandler');
const multer = require('multer');
const multerConfig = require('../../config/multer');
const removeFile = require('./customerFileService');

const { customInvestmentError } = require('../common/helpers');

Customer.methods(['get', 'post', 'put', 'patch', 'delete']);
Customer.updateOptions({
  new: true,
  runValidators: true,
});
Customer.after('post', errorHandler).after('put', errorHandler);
Customer.before('photo', multer(multerConfig).single('file'));
Customer.before('document', multer(multerConfig).single('file'));
Customer.before('voucher', multer(multerConfig).single('file'));

Customer.route('investment', ['post'], (req, res, next) => {
  /*  [POST] /clientes/investment?id=xxx   */
  const id = req.query.id;
  const investment = req.body;

  //Funciona com async await e com callbacks
  Customer.findById(id, (error, customer) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      const newCustomer = customer;
      newCustomer.investments.push(investment);

      newCustomer.save((error, data) => {
        if (error) {
          const err = customInvestmentError(error.message);
          res.status(500).json({ errors: [err] });
        } else {
          res.status(200).json(data);
        }
      });
    }
  });
});

Customer.route('investment', ['delete'], (req, res, next) => {
  /* [DELETE]   /clientes/investment?id=xxx&investmentId=yyy   */
  const id = req.query.id;
  const investmentId = req.query.investmentId;

  Customer.findById(id, (error, customer) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      const newCustomer = customer;
      newCustomer.investments.pull(investmentId);

      newCustomer.save((error, data) => {
        if (error) {
          res.status(500).json({ errors: [err] });
        } else {
          res.status(200).json(data);
        }
      });
    }
  });
});

Customer.route('investment', ['put'], (req, res, next) => {
  /* [PUT]   /clientes/investment?id=xxx&investmentId=yyy   */
  const id = req.query.id;
  const investmentId = req.query.investmentId;
  const fieldsToUpdate = req.body; //{capital: xxx, status: 'test'}

  Customer.findById(id, (error, customer) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      const newCustomer = customer;

      const currentInvestment = newCustomer.investments.id(investmentId);
      const idx = newCustomer.investments.indexOf(currentInvestment);

      fieldsToUpdate._id = currentInvestment._id;
      newCustomer.investments[idx] = fieldsToUpdate;

      newCustomer.save((error, data) => {
        if (error) {
          res.status(500).json({ errors: ['Erro ao atualizar investimento'] });
        } else {
          res.status(200).json(data);
        }
      });
    }
  });
});

Customer.route('cancel-investment', ['put'], (req, res, next) => {
  /* [PUT]   /clientes/cancel-investment?id=xxx&investmentId=yyy   */
  // CHANGE STATUS TO CANCELADO ONLY
  const id = req.query.id;
  const investmentId = req.query.investmentId;
  const status = 'Cancelado';

  Customer.findById(id, (error, customer) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      const customerToSave = findInvestmentAndEditStatus(
        customer,
        investmentId,
        status
      );

      customerToSave.save((error, data) => {
        if (error) {
          res.status(500).json({ errors: ['Erro ao cancelar investimento'] });
        } else {
          res.status(200).json(data);
        }
      });
    }
  });
});

Customer.route('rescue-investment', ['put'], (req, res, next) => {
  /* [PUT]   /clientes/rescue-investment?id=xxx&investmentId=yyy   */
  // CHANGE STATUS TO Resgate solicitado ONLY
  const id = req.query.id;
  const investmentId = req.query.investmentId;
  const status = 'Resgate solicitado';

  Customer.findById(id, (error, customer) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      const customerToSave = findInvestmentAndEditStatus(
        customer,
        investmentId,
        status
      );

      customerToSave.save((error, data) => {
        if (error) {
          res.status(500).json({ errors: ['Erro ao solicitar resgate'] });
        } else {
          res.status(200).json(data);
        }
      });
    }
  });
});

const findInvestmentAndEditStatus = (customer, investmentId, status) => {
  const currentInvestment = customer.investments.id(investmentId);
  const idx = customer.investments.indexOf(currentInvestment);

  const fieldsToUpdate = {
    ...currentInvestment.toJSON(),
    status: status,
  };

  fieldsToUpdate._id = currentInvestment._id;
  customer.investments[idx] = fieldsToUpdate;

  return customer;
};

Customer.route('voucher', ['post'], (req, res, next) => {
  /* [POST]   /clientes/voucher?id=xxx&investmentId=yyy   */
  // EM DESENVOLVIMENTO
  const id = req.query.id;
  const investmentId = req.query.investmentId;
  const url = `${process.env.APP_URL}/files/`;
  const name = req.file.key;

  Customer.findById(id, (error, customer) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      const currentInvestment = customer.investments.id(investmentId);
      const idx = customer.investments.indexOf(currentInvestment);
      const fieldsToUpdate = {
        ...currentInvestment.toJSON(),
        status: 'Depósito a confirmar',
        voucher_url: url,
        voucher_name: name,
      };
      fieldsToUpdate._id = currentInvestment._id;
      customer.investments[idx] = fieldsToUpdate;

      customer.save((error, data) => {
        if (error) {
          res.status(500).json({ errors: ['Erro ao salvar comprovante'] });
        } else {
          res.status(200).json(data);
        }
      });
    }
  });
});

Customer.route('count', (req, res, next) => {
  Customer.countDocuments((error, value) => {
    if (error) {
      res.status(500).json({ errros: [error] });
    } else {
      res.status(200).json({ value });
    }
  });
});

//prettier-ignore (http://localhost:3003/api/clientes/photo?id=)
Customer.route('photo', ['post'], (req, res, next) => {
  const id = req.query.id;
  const url = `${process.env.APP_URL}/files/`;
  const name = req.file.key;

  (async () => {
    try {
      const personalData = await getPersonalData(id);

      const newPersonalData = {
        ...personalData.toJSON(),
        photo_url: url,
        photo_name: name,
      };

      if (personalData.photo_name) {
        if (personalData.photo_name !== '') {
          removeFile(personalData.photo_name);
        }
      }

      const customerUpdated = await Customer.findByIdAndUpdate(
        { _id: id },
        { personal_data: newPersonalData },
        { new: true }
      );

      if (!customerUpdated) {
        res.status(404).json({ errors: ['Erro ao adicionar foto.'] });
      } else {
        res.status(200).json(customerUpdated);
      }
    } catch (error) {
      res.status(404).json({ errors: [error] });
    }
  })();
});

//prettier-ignore (http://.../clientes/document?type=cpf&id=xxx)
Customer.route('document', ['post'], (req, res, next) => {
  const id = req.query.id;
  const type = req.query.type; //type document

  const url = `${process.env.APP_URL}/files/`;
  const name = req.file.key;

  (async () => {
    try {
      const personalData = await getPersonalData(id);
      const { documents } = personalData;
      const type_url = `${type}_url`;
      const type_name = `${type}_name`;

      const newDocuments = {
        ...documents,
        [type_url]: url,
        [type_name]: name,
      };

      if (documents) {
        if (documents[type_name] !== '') {
          removeFile(documents[type_name]);
        }
      }

      const newPersonalData = {
        ...personalData.toJSON(),
        documents: newDocuments,
      };

      const customerUpdated = await Customer.findByIdAndUpdate(
        { _id: id },
        { personal_data: newPersonalData },
        { new: true }
      );

      if (!customerUpdated) {
        res.status(404).json({ errors: [`Erro ao adicionar ${type}.`] });
      } else {
        res.status(200).json(customerUpdated);
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ errors: [error] });
    }
  })();
});

Customer.route('email', ['get'], (req, res, next) => {
  const email = req.query.email;

  Customer.findOne({ email }, (error, data) => {
    if (error) {
      res.status(500).json({ errros: [error] });
    } else {
      res.status(200).json(data);
    }
  });
});

const getPersonalData = async (id) => {
  const projections = { _id: 0, personal_data: 1 };
  const data = await Customer.findById(id, projections);

  return data.personal_data;
};

module.exports = Customer;

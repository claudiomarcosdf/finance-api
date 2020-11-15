const Customer = require('../customer/customerModel');
const errorHandler = require('../common/errorHandler');
const multer = require('multer');
const multerConfig = require('../../config/multer');
const removeFile = require('./customerFileService');

Customer.methods(['get', 'post', 'put', 'patch', 'delete']);
Customer.updateOptions({
  new: true,
  runValidators: true,
});
Customer.after('post', errorHandler).after('put', errorHandler);
Customer.before('photo', multer(multerConfig).single('file'));

//TESTAR A FUNÇÃO PUSH E PULL DO MONGOOSE PARA INSERIR E EXCLUIR UM DOCUMENTO
// NO SUBDOCUMENTO:doc.subdocs.push({ _id: 4815162342 })
//  doc.subdocs.pull({ _id: 4815162342 }) // removed

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
      console.log(error);
      res.status(404).json({ errors: [error] });
    }
  })();
});

const getPersonalData = async (id) => {
  const projections = { _id: 0, personal_data: 1 };
  const data = await Customer.findById(id, projections);

  return data.personal_data;
};

module.exports = Customer;

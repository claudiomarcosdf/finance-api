const Customer = require('../customer/customerModel');
const errorHandler = require('../common/errorHandler');

Customer.methods(['get', 'post', 'put', 'patch', 'delete']);
Customer.updateOptions({ new: true, runValidators: true });
Customer.after('post', errorHandler).after('put', errorHandler);

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

module.exports = Customer;

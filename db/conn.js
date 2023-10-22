const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('back_end_estudo', 'root', 'miguel123', {
    host: 'localhost',
    dialect: 'mysql'
})
// sequelize.authenticate().then(()=>{
//     console.log('Conexão deu certo')
// }).catch((error)=>{
//     console.log('Conexão deu erro'+ error)
// })

module.exports = sequelize 
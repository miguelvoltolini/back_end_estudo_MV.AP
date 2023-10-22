const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario')

const PORT = 3000
const hostname = 'localhost'
let log = false 

//-----------------------------------------------------config express
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
//-----------------------------------------------------express handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
//-----------------------------------------------------

app.post('/apagar', async (req,res)=>{
    const id = req.body.id
    const pesq = await Usuario.findOne({raw:true, where: {id:id}})
    console.log(pesq)
    const msg = "Usuário apagado"
    Usuario.destroy({raw:true, where: {id:id}})

    res.render('apagar', {log, msg})
})

app.get('/apagar', (req,res)=>{
    res.render('apagar', {log})
})

app.post('/atualizar', async (req,res)=>{
    const id = req.body.id
    const nome = req.body.nome
    let msg = "Usuário atualizado"

    const pesq = await Usuario.findOne({raw: true, where: {id: id}})
    console.log(pesq)

    const dados = {
        id: id,
        nome: nome
    }
    console.log(dados)
    
    if(pesq == null){
        let msg = "Código de usuário não encontrado"
        res.render('atualizar', {log, msg})
    }else{
        await Usuario.update(dados,{where: {id: pesq.id}})
        res.render('atualizar', {log, msg})
    }
})

app.get('/atualizar', async (req,res)=>{
    res.render('atualizar', {log})
})

app.get('/listar', async (req,res)=>{
    const dados = await Usuario.findAll({raw:true})
    console.log(dados)
    res.render('listar', {log, tabela:dados})
})

app.post('/cadastro', async (req,res)=>{
    const id = req.body.id 
    const nome = req.body.nome 
    const email = req.body.email 
    const senha = req.body.senha 
    const msg = 'Usuário cadastrado com sucesso'

    await Usuario.create({id, nome, email, senha})
    res.render('cadastro',{log, msg})
    console.log(msg)
})

app.get('/cadastro', (req,res)=>{
    res.render('cadastro', {log})
})

app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha

    console.log(email,senha)
    
    const pesq = await Usuario.findOne({raw:true, where: {email: email, senha: senha}})
    console.log(pesq)
    if(pesq == null){
        res.render('login', {log})
    }else{
        log = true
        res.render('sistema', {log, nome: pesq.nome})
    }
})

app.get('/', (req,res)=>{
    log = false
    res.render('login', {log})
})

//-----------------------------------------------------
conn.sync().then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`O servidor está rodando ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o banco de dados'+error)
})
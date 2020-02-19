//Configurando o servidor
const express = require('express');
const server = express();

//Configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public')); 

//Habiliar body do formulario
server.use(express.urlencoded({extended:true}));

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool({ 
  user: 'postgres',
  password: 'comando',
  host: 'localhost',
  port: 5432,
  database:'doe',
});


//Configurando template engine
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express:server,
  noCache:true
});



//Configurar a apresentação da página
server.get('/', function(req, res) {
   db.query("SELECT * FROM donors", function(err, result) {
     if(err) return res.send('Erro no banco de dados');
     
     const donors = result.rows;
     return res.render('index.html', {donors});
   });
   
});

server.post('/', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;
  
  if(name == '' || email == '' || blood == '') {
    return res.send('Todos os campos são obrigatórios');
  }

  const query = `INSERT INTO donors ("name", "email", "blood") VALUES ('$1, $2, $3')`;
  
  const values = [name, email, blood];

  db.query(query, values, function(err) {
     if(err) return res.send('erro no banco de dados.');

     return res.redirect('/');
  });
});

//Ligar o servidor e permitir o acesso a porta 3000
server.listen(3000);
var express = require('express');
var bodyParser = require('body-parser');

const port = 3200;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const router = express.Router();

// move to db
let data = [];

// move to user controller file
router.get('/list', (req, res) => {
  res.json(data);
});

router.post('/add', (req, res) => {
  data.push(req.body);
  res.json(data);
});

router.get('/', function(req, res) {
  res.json({ message: 'hooray! we can build APIs!' });
});

app.use('/api', router);

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

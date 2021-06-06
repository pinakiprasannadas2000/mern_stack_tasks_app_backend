const mongoose = require('mongoose')

mongoose.connect(
  'mongodb+srv://pinakidas:QvyOT0s56p7u0A60@cluster0.qhrfu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
)

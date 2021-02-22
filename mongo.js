const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2] //process.env.MONGO_PASSWORD//

//const url = `mongodb+srv://danielloi:${password}@cluster0.hbnrt.mongodb.net/notes-app?retryWrites=true&w=majority`
const url = `mongodb+srv://danielloi:${password}@cluster0.hbnrt.mongodb.net/persons-app?retryWrites=true&w=majority`


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person)  
      })
      mongoose.connection.close()
      //console.log(person.name+" "+person.number)
    })
} else if (process.argv.length === 5){  
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person
    .save()
    .then(result => {
      console.log('person saved!')
      mongoose.connection.close()
    })

} else {
  console.log("Missing certain inputs. Try again.")
  process.exit(1)
}




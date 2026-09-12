const bcrypt = require('bcryptjs');
const hash = '$2b$10$s86qH2XALxHxHt7Wxs9d3ezBVgX0MzbL5dWWktQoNAQ4PYGeeB9s6';
async function test() {
  console.log("Is it 'password'? ", await bcrypt.compare('password', hash));
  console.log("Is it 'AltenerSolutions2023'? ", await bcrypt.compare('AltenerSolutions2023', hash));
  console.log("Is it 'AltenerSolutions2023@gmail.com'? ", await bcrypt.compare('AltenerSolutions2023@gmail.com', hash));
}
test();

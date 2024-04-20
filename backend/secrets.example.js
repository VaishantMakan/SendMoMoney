// this is a template file for creating secrets.js file which will store all your secrets.
// this is done to keep all your sensitive info safe from commiting online
// So, create a ./backend/secrets.js file and add the following with your info

const dbString = "<Add your db connection string here>";

const JWT_SECRET = "<Add your jsonwebtoken secret here>";

export { dbString, JWT_SECRET };

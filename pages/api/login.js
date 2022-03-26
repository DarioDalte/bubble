const msg = (success, message) => ({
  success: success,
  message: message,
});

export default async function handler(req, res) {
  console.log(req.body);
  //res.status(201).json(msg(1, "Dati corretti.")); //response dati corretti
  res.status(422).json(msg(0, "Email o password errata.")); //Response dati errati
}

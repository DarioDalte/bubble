const msg = (success, message, extra) => ({
  success: success,
  message: message,
  extra: extra ? extra : {}
});

export default async function handler(req, res) {
  console.log(req.body);
  res.status(201).json(msg(1, "Dati corretti.", {name: 'Dario'})); //response dati corretti
  //res.status(422).json(msg(0, "Email o password errata.")); //Response dati errati
}

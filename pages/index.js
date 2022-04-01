import {useSession, signOut} from 'next-auth/client'

import BottomNav from "../components/BottomNav/BottomNav";
import Header from "../components/Header/Header";
import Main from "../components/Main/Main";

import useMediaQuery from '@mui/material/useMediaQuery';

export default function Home(props) {
  const isMobile = useMediaQuery('(max-width:47rem)');
  const [session, loading] = useSession();

  const logoutHandler = () =>{
    signOut();
  }

  return (
    <>
      <Header />
      {session && <button onClick={logoutHandler}>Logout</button>}
      <Main bestSeller={props.bestSeller} randomElements={props.randomElements}/>
      {isMobile && <BottomNav />}
    </>
  );
}




export async function getStaticProps() {
  const databaseConnection = require("./api/middlewares/database.js");
  const client = await databaseConnection(); //Mi connetto al db
  const cart = [];
  try {
    await client.connect(); //istanza mongo client

    const db = client.db(); //db

    var prova = await db.collection("orders").find().toArray(); //prende i record della collezione orders e le mette nella variabile prova
    const contatore = await db.collection("orders").countDocuments(); //conta quanti record ci sono nella collection orders

    var i = 0; //dichiaro e inizializo la varibile i
    var array = []; //dichiaro e inizializzo l'array

    while (i < contatore) {
      var prova_1 = prova[i]["cod_prodotti"]; //prendo il campo cod_prodotti(che è un array) e lo metto nella variabile prova_1
      for (var d = 0; d < prova_1.length; d++) {
        //
        array.push(prova_1[d]); //aggiunge all'array ogni elemento dell'array prova_1
      }
      i++;
    }

    function count_duplicate(a) {
      // crea un dizionario
      let counts = {};

      for (let i = 0; i < a.length; i++) {
        if (counts[a[i]]) {
          counts[a[i]] += 1;
        } else {
          counts[a[i]] = 1;
        }
      }
      for (let prop in counts) {
        if (counts[prop] >= 2) {
          //console.log(prop + " counted: " + counts[prop] + " times.");
        }
      }
      return counts;
    }

    var best_seller = count_duplicate(array); //richiama la funzione passando l'array

    const sortable = Object.entries(best_seller) // ordina il dizionario per le keys
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    var array_5_bestseller = [];
    for (var i = 1; i < 6; i++) {
      var last = Object.keys(sortable)[Object.keys(sortable).length - i]; // Inserisce nell'array gli ultimi 5 elementi di best seller
      array_5_bestseller.push(last);
    }

    //console.log("best seller: " + array_5_bestseller);

    var prodotti = await db.collection("products").find().toArray(); //prende i record della collezione orders e le mette nella variabile prova
    var recensioni = await db.collection("reviews").find().toArray();
    var array_recensioni = [];
    var oggetto_recensioni = {};
    for(var i = 0; i < recensioni.length; i++){
        let id = recensioni[i]["id_product"]
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
        oggetto_recensioni = {
          id_prodotti: id,
          value: recensioni[i]["value"]
        }
        array_recensioni.push(oggetto_recensioni);
    }

    //console.log(array_recensioni);

    let oggetto = {};


    for (i = 0; i < array_5_bestseller.length; i++) {
      //console.log("best seller n" + i + " " + array_5_bestseller[i] + "\n");
      for (var x = 0; x < prodotti.length; x++) {
        let id = prodotti[x]["_id"]
          .toString()
          .replace(/ObjectId\("(.*)"\)/, "$1");

        var somma = 0;
        var cont = 0;
        for(var b = 0; b < array_recensioni.length; b++)
        {
            var ogg = array_recensioni[b];
            var prova_2 = ogg["id_prodotti"];
            //console.log(prova_2);
            if(id == prova_2){
              somma = somma + ogg["value"];
              cont++;
            }
            
        }
        var media = somma/cont;
        //console.log("id: " + id);
        if (id == array_5_bestseller[i]) {
          oggetto = {
            brand: prodotti[x]["brand"],
            name: prodotti[x]["name"],
            price: prodotti[x]["price"],
            star: (media ? media : 0)
          };
          cart.push(oggetto);
          break;
        }
      }
     
      
    }


    //! START ELEMENT RANDOMS
    //! START ELEMENT RANDOMS
    //! START ELEMENT RANDOMS

    var array_categorie = await db.collection("categories").find().toArray(); // inserisce nell'array le categorie
    const contatore_categorie = await db.collection("categories").countDocuments(); //conta quanti record ci sono nella collection categorie

    function getRandomInt(max) { // genera numero random
      return Math.floor(Math.random() * max);
    }

    var temp = getRandomInt(contatore_categorie);//primo numero random

    var array_numeri_random = [temp];//aggiunge il primo numero random all'array
    var a = 0;
    for (var i = 0; i < 2; i++) {
      temp = getRandomInt(contatore_categorie); // genera numero random e lo mette nella variabile temp
      for (var x = 0; x < array_numeri_random.length; x++) {
        if (temp == array_numeri_random[x]) { //confronta il numero generato con i numeri dell'array
          i = i - 1; // se è uguale decrementa
          a = 1; // e assegna 1 alla variabile a
        }
      }

      if (a == 0) { // se la variabile è 0 significa che non è presente il numero nell'array e lo aggiunge
        array_numeri_random.push(temp);
      } else { // altrimenti non lo aggiunge e assegna 0 alla variabile a
        a = 0;
      }
    }
    console.log("Ecco i numeri random generati: ");
    console.log(array_numeri_random); // printa i numeri random
    console.log("\n");

    var array_con_id_categoria = []; //dichiaro l'array che conterra gli id delle categorie che verranno visualizzate nella home page
    for (var i = 0; i < array_categorie.length; i++) { //scorre l'array_categorie che contiene tutte le categorie prese dal db
      var var_id = array_categorie[i]["_id"]; // prende solo l'id e lo mette nella variabile var_id

      for (var z = 0; z < array_numeri_random.length; z++) { //scorre l'array con i numeri random e lo mette nell'array con categoria id
        if (i == array_numeri_random[z]) {
          array_con_id_categoria.push(var_id);
        }
      }
    }
    console.log("Ecco l'array con gli id delle categorie: ");
    console.log(array_con_id_categoria); // printa l'array con le categorie
    console.log("\n");

    var prodotti = await db.collection("products").find().toArray(); //prende i record della collezione orders e le mette nella variabile prova
    const contatore2 = await db.collection("products").countDocuments(); //conta quanti record ci sono nella collection orders 
    //console.log(prodotti); //printa i prodotti presi dal db
    console.log("\n\n");

    var array = []; //dichiaro e inizializzo l'array
    let oggetto2 = {}; //dichiaro due oggetti e due array e una variabile prova_3
    var oggetto_da_mandare = {}; 
    var array_da_mandare = [];
    var cart2 = [];
    
    var prova_3 = 0;
    for (var d = 0; d < array_con_id_categoria.length; d++) { //scansiono l'array con gli id delle categorie
     
      var prova_1 = array_con_id_categoria[d]; // inserisco un id alla volta nella variabile prova_1
      var nome_categoria = await db.collection("categories").find({"_id":prova_1}).toArray();// inserisce nell'array le categorie
      console.log("nome: ");
      nome_categoria = nome_categoria[0]["category"];
      prova_1 = String(array_con_id_categoria[d]); // e la trasformo in stringa 
      var i = 0; //dichiaro e inizializo la varibile i
       console.log("NUOVO ID!!!!" + prova_1);
      while (i < contatore2) { //scorre l'array che contiene i prodotti
        var prova_2 = prodotti[i]["category"]; //prendo il campo category e lo metto nella variabile prova_2
        console.log(prodotti[i]); //printo il prodotto
        console.log("id categoria del prodotto è: " + prova_2); //printo l'id della categoria del prodotto
        console.log("id categoria confrontato è: " + prova_1); //printo l'id della categoria con cui verra confrontata la variabile prova_2
        if (prova_2 == prova_1) { //la confronto e solo se è uguale, quindi gli id sono identici entra nell'if
              console.log("sono dentro");
              oggetto2 = {
                brand: prodotti[i]["brand"],
                name: prodotti[i]["name"],
                price: prodotti[i]["price"],
              }; //aggiunge all'oggetto oggetto, dichiarato precedentemente, le informazioni del prodotto
              console.log("Ecco l'oggetto che aggiungero all'array")
              console.log(oggetto2)
              cart2.push(oggetto2); // e aggiunge le info del prodotto all'array cart
              prova_3 = 1; //e assegna alla variabile prova_3 il valore 1, in questo modo posso sapere se è passato per questo if
              console.log("ecco l'array");
              console.log(cart2);
              if(cart2.length == 5)
              {
                console.log("adesso esco");
                break;
              }
              
            }else{
              console.log("non è uguale e quindi sto fuori");
          }
          i++;
          
        }

        if (prova_3 == 1) // se è entrato assegan 0 alla variabile prova_3 e aggiunge l'array all'oggetto oggetto da mandare che lo pusha nell'array definitivo che verra inivato al frontend
        {
 
          prova_3 = 0;
          oggetto_da_mandare = {
            categoria : nome_categoria,
            prodotti: cart2
          }
          console.log("loggetto che aggiungo all'array è questo: ");
          console.log(oggetto_da_mandare);
          array_da_mandare.push(oggetto_da_mandare);
          console.log("ecco l'array: ");
          console.log(array_da_mandare);

       }
       console.log("svuotiamo il cart: ");
       cart2 = [];
       console.log(cart2);

       console.log("\n\n\n");
    }

    console.log(array_da_mandare); //printa l'array


  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }

  //console.log(cart);

  return {
    props: {
      bestSeller: cart,
      randomElements: array_da_mandare,
    }, // will be passed to the page component as props
  };
}

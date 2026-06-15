import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    onSnapshot
}


from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBwJctACQlbyCS8Ilmt4xAPSMJPimoe9Z0",
    authDomain: "arraia-das-sapatao.firebaseapp.com",
    projectId: "arraia-das-sapatao",
    storageBucket: "arraia-das-sapatao.firebasestorage.app",
    messagingSenderId: "650103869699",
    appId: "1:650103869699:web:d2abe3932a4ee358bd5936",
    measurementId: "G-RHK1RYCYBH"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const comidasDiv = document.getElementById("comidas");
const bebidasDiv = document.getElementById("bebidas");

function renderItem(id,item,tipo){

    const card=document.createElement("div");

    card.className=
    item.responsavel
    ? "card ocupado"
    : "card";

    const nomeAtual =
        document.getElementById("nome").value;

    card.innerHTML=`
        <h3>${item.nome}</h3>

        ${
           item.responsavel
            ? `
                <p>❤️ Reservado por ${item.responsavel}</p>

                ${
                    item.responsavel === nomeAtual
                     ? `
                        <button onclick="desistir('${tipo}','${id}')">
                            ❌ Desistir
                        </button>
                     `
                    : ""
                }
            `
            : `
                <button onclick="levar('${tipo}','${id}')">
                    🔥 Eu levo
                </button>
            `
        }
    `;

    if(tipo === "comida"){
        comidasDiv.appendChild(card);
    }else{
        bebidasDiv.appendChild(card);
    }
}

window.levar = async(tipo,id)=>{

    const nome =
    document.getElementById("nome").value;

    if(!nome){
        alert("Digite seu nome");
        return;
    }

    const ref =
    doc(db,tipo,id);

    await updateDoc(ref,{
        responsavel:nome
    });
}

window.desistir = async(tipo,id)=>{

    const confirmar =
    confirm(
        "Tem certeza que quer desistir deste item?"
    );

    if(!confirmar) return;

    const ref = doc(db,tipo,id);

    await updateDoc(ref,{
        responsavel:""
    });
}

window.adicionarItem = async()=>{

    const nome =
    document.getElementById("novoItem").value;

    const tipo =
    document.getElementById("tipo").value;

    if(!nome)return;

    await addDoc(collection(db,tipo),{
        nome:nome,
        responsavel:""
    });
}

function atualizarContador() {

    Promise.all([
        getDocs(collection(db, "comida")),
        getDocs(collection(db, "bebida"))
    ]).then(([comidas, bebidas]) => {

        const comidasReservadas =
            comidas.docs.filter(doc =>
                doc.data().responsavel
            ).length;

        const bebidasReservadas =
            bebidas.docs.filter(doc =>
                doc.data().responsavel
            ).length;

        const hoje = new Date();
        const arraia = new Date("2026-06-20");

        const dias =
            Math.ceil(
                (arraia - hoje)
                / (1000 * 60 * 60 * 24)
            );

        document.getElementById("contador").innerHTML = `
            🔥 Faltam ${dias} dias para o Arraiá<br>
            🌽 ${comidasReservadas} comidas reservadas<br>
            🥤 ${bebidasReservadas} bebidas reservadas
        `;
    });
}

function carregar(){

    onSnapshot(
        collection(db,"comida"),
        snapshot=>{

            comidasDiv.innerHTML="";

            snapshot.forEach(docSnap=>{

                renderItem(
                    docSnap.id,
                    docSnap.data(),
                    "comida"
                );
            });
        }
    );
    atualizarContador();
    onSnapshot(
        collection(db,"bebida"),
        snapshot=>{

            bebidasDiv.innerHTML="";

            snapshot.forEach(docSnap=>{

                renderItem(
                    docSnap.id,
                    docSnap.data(),
                    "bebida"
                );
            });
        }
    );
    atualizarContador();
}
 

carregar();

let db=JSON.parse(localStorage.perfumes||`{
"produtos":[
{"nome":"Essencial","custo":100,"preco":150,"qtd":35},
{"nome":"Homem Identidade","custo":113,"preco":170,"qtd":15}
],
"lucro":0,
"divida":0,
"logs":[]
}`);

function save(){
localStorage.perfumes=JSON.stringify(db);
render();
}

function log(x){
db.logs.unshift(new Date().toLocaleDateString()+" - "+x);
}

function abrir(x){
document.querySelectorAll("section").forEach(e=>e.style.display="none");
document.getElementById(x).style.display="block";
}

function novoProduto(){
db.produtos.push({
nome:nome.value,
custo:+custo.value,
preco:+preco.value,
qtd:+qtd.value
});
log("Produto criado: "+nome.value);
save();
}

function vender(){
let p=db.produtos[vProd.value];
let q=+vQtd.value;
let taxa=tipoVenda.value=="terceiro"?0.24:0.12;
let lucro=((p.preco-(p.preco*taxa)-4)-p.custo)*q;
p.qtd-=q;
db.lucro+=lucro;
log("Venda "+q+"x "+p.nome+" lucro R$"+lucro.toFixed(2));
save();
}

function trocar(){
let a=db.produtos[tSai.value];
let b=db.produtos[tEnt.value];
a.qtd-=+tSaiQtd.value;
b.qtd+=+tEntQtd.value;
let dif=(b.custo*tEntQtd.value)-(a.custo*tSaiQtd.value);
log("Troca "+a.nome+" por "+b.nome+" diferença R$"+dif);
alert("Diferença fornecedor: R$"+dif);
save();
}

function novaDivida(){
db.divida+=+valorDivida.value;
let parc=(+valorDivida.value)/(+parcelas.value);
log("Dívida criada. Parcela R$"+parc.toFixed(2));
save();
}

function backup(){
let a=document.createElement("a");
a.href=URL.createObjectURL(new Blob([JSON.stringify(db)]));
a.download="backup-perfumes.json";
a.click();
}

function restaurar(e){
let r=new FileReader();
r.onload=()=>{db=JSON.parse(r.result);save()};
r.readAsText(e.target.files[0]);
}

function render(){
let estoque=0, valor=0, previsto=0;
db.produtos.forEach(p=>{
estoque+=p.qtd;
valor+=p.qtd*p.custo;
previsto+=p.qtd*((p.preco-(p.preco*.12)-4)-p.custo);
});

resumo.innerHTML="Estoque R$"+valor.toFixed(2)+" | Lucro R$"+db.lucro.toFixed(2);

dash.innerHTML=
`📦 Produtos: ${estoque}<br>
💰 Estoque: R$${valor.toFixed(2)}<br>
🔥 Lucro previsto: R$${previsto.toFixed(2)}<br>
💳 Deve fornecedor: R$${db.divida.toFixed(2)}`;

produtos.innerHTML="";
[vProd,tSai,tEnt].forEach(x=>x.innerHTML="");

db.produtos.forEach((p,i)=>{
produtos.innerHTML+=`<div class='card'>${p.nome}<br>${p.qtd} unidades</div>`;
[vProd,tSai,tEnt].forEach(x=>x.innerHTML+=`<option value="${i}">${p.nome}</option>`);
});

logs.innerHTML=db.logs.map(x=>"<div class='card'>"+x+"</div>").join("");
}

render();
abrir("dash");

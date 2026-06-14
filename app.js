
let edit=null;

let db=JSON.parse(localStorage.dbPerfumeV2||`{
"produtos":[
{"nome":"Essencial","custo":100,"preco":150,"qtd":35},
{"nome":"Homem Identidade","custo":113,"preco":170,"qtd":15}
],
"taxas":{"comissao":6,"frete":6,"fixa":4,"terceiro":12},
"lucro":0,
"logs":[]
}`);

const moeda=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

function save(){
localStorage.dbPerfumeV2=JSON.stringify(db);
render();
}

function abrir(x){
document.querySelectorAll("section").forEach(e=>e.style.display="none");
document.getElementById(x).style.display="block";
}

function salvarProduto(){
let obj={
nome:nome.value,
custo:+custo.value,
preco:+preco.value,
qtd:+qtd.value
};
if(edit!==null){db.produtos[edit]=obj;edit=null}
else db.produtos.push(obj);
save();
}

function editarProduto(i){
let p=db.produtos[i];
nome.value=p.nome;custo.value=p.custo;preco.value=p.preco;qtd.value=p.qtd;
edit=i;
}

function excluirProduto(i){
if(confirm("Excluir produto?")){
db.produtos.splice(i,1);
save();
}
}

function vender(){
let p=db.produtos[produtoVenda.value];
let taxa=(db.taxas.comissao+db.taxas.frete+(quem.value=="outro"?db.taxas.terceiro:0))/100;
let lucro=((p.preco-(p.preco*taxa)-db.taxas.fixa)-p.custo)*qtdVenda.value;
p.qtd-=qtdVenda.value;
db.lucro+=lucro;
db.logs.unshift("Venda "+p.nome+" lucro "+moeda(lucro));
save();
}

function trocar(){
let a=db.produtos[produtoSai.value];
let b=db.produtos[produtoEnt.value];
a.qtd-=qtdSai.value;
b.qtd=Number(b.qtd)+Number(qtdEnt.value);
let dif=(b.custo*qtdEnt.value)-(a.custo*qtdSai.value);
db.logs.unshift("Troca diferença "+moeda(dif));
alert(moeda(dif));
save();
}

function salvarTaxas(){
db.taxas={
comissao:+comissao.value,
frete:+frete.value,
fixa:+fixa.value,
terceiro:+terceiro.value
};
save();
}

function exportar(){
let a=document.createElement("a");
a.href=URL.createObjectURL(new Blob([JSON.stringify(db)]));
a.download="backup.json";
a.click();
}

function importar(e){
let r=new FileReader();
r.onload=()=>{db=JSON.parse(r.result);save()};
r.readAsText(e.target.files[0]);
}

function render(){
let estoque=0,valor=0;
db.produtos.forEach(p=>{
estoque+=Number(p.qtd);
valor+=p.qtd*p.custo;
});

topo.innerHTML="Estoque "+moeda(valor)+"<br>Lucro "+moeda(db.lucro);

home.innerHTML=
`<div class='card'>📦 Produtos ${estoque}</div>
<div class='card'>💰 Estoque ${moeda(valor)}</div>
<div class='card'>🔥 Lucro ${moeda(db.lucro)}</div>`;

lista.innerHTML="";
[produtoVenda,produtoSai,produtoEnt].forEach(s=>s.innerHTML="");

db.produtos.forEach((p,i)=>{
lista.innerHTML+=`
<div class='card'>
<b>${p.nome}</b><br>
Qtd ${p.qtd}<br>
Custo ${moeda(p.custo)}<br>
Venda ${moeda(p.preco)}
<button onclick="editarProduto(${i})">Editar</button>
<button onclick="excluirProduto(${i})">Excluir</button>
</div>`;
[produtoVenda,produtoSai,produtoEnt].forEach(s=>s.innerHTML+=`<option value="${i}">${p.nome}</option>`);
});

logs.innerHTML=db.logs.map(x=>"<div class='card'>"+x+"</div>").join("");

comissao.value=db.taxas.comissao;
frete.value=db.taxas.frete;
fixa.value=db.taxas.fixa;
terceiro.value=db.taxas.terceiro;
}

render();
abrir("home");

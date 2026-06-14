let db=JSON.parse(localStorage.db||'{"prod":[{"n":"Essencial","q":35,"c":100},{"n":"Homem Identidade","q":15,"c":113}],"par":[]}');
let br=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function save(){localStorage.db=JSON.stringify(db);render()}
function produto(){db.prod.push({n:n.value,q:+q.value,c:+c.value});save()}
function edit(i){let p=db.prod[i];p.n=prompt('Nome',p.n);p.q=+prompt('Qtd',p.q);p.c=+prompt('Custo',p.c);save()}
function troca(){let a=db.prod[sai.value],b=db.prod[ent.value];a.q-=+sq.value;b.q+=+eq.value;alert('Diferença '+br((b.c*eq.value)-(a.c*sq.value)));save()}
function parcelar(){for(let i=1;i<=np.value;i++)db.par.push({v:vc.value/np.value,p:0});save()}
function pagar(i){db.par[i].p+=+prompt('Valor pago');save()}
function backup(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(db)]));a.download='backup.json';a.click()}
function importar(e){let r=new FileReader();r.onload=()=>{db=JSON.parse(r.result);save()};r.readAsText(e.target.files[0])}
function render(){let t=0,qt=0;lista.innerHTML='';sai.innerHTML='';ent.innerHTML='';db.prod.map((p,i)=>{t+=p.q*p.c;qt+=p.q;lista.innerHTML+=`<div class=item>${p.n}<br>${p.q} un<br>${br(p.c)}<button onclick=edit(${i})>Editar</button></div>`;sai.innerHTML+=ent.innerHTML+=`<option value=${i}>${p.n}</option>`});valor.innerHTML=br(t);qtd.innerHTML=qt;let d=0;pars.innerHTML='';db.par.map((p,i)=>{d+=p.v-p.p;pars.innerHTML+=`<div class=item>${br(p.v)} pago ${br(p.p)} falta ${br(p.v-p.p)}<button onclick=pagar(${i})>Pagar</button></div>`});deve.innerHTML=br(d)}
render()
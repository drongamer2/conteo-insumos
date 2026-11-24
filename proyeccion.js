/* ---------- Pedidos: proyección de consumo y sugerencia de pedido ----------
   Base: el reporte "Inventory Item Usage Analysis" (uso real por insumo). El uso diario es
   la suma de todos los reportes guardados entre el total de días que cubren.
   Guardado en Firestore: tiendas/<id>/config/proyeccion
   {rep:{clave:{f,t,g,i:[[nombre,unidad,uso]]}}, del:[claves], link:{nombre:idCatalogo},
    dias:[3,6], leche:[3], seg:1, adj:0}  (días: 0=domingo … 3=miércoles … 6=sábado) */
const PX_BASE={f:"2026-11-16",t:"2026-11-16",g:80,i:[["16086-Frapuccino Base Local Coff","BTL: Bt 1.89Lt",3.09],["16191 Bebida De Avena Cj/6 Li","LT: lt",9.98],["301427 Leche Entera Cj/6 Pzas/2L","LT: 2 Litros",30.3],["30179 Bt Topping Caramel Suga","BTE: Bte 6 oz",0.79],["306035 Leche Light 1 LT","LT: lt",23.36],["306036 Leche Deslacto Light 1LT","LT: lt",15.02],["306517 Leche Deslact Suprema 1LT","LT: lt",89.16],["306577 YogurtNaturalSinAzu900gr","BTE: Bte 900 g",0.78],["55802 C5B Raspberry Flavoured Pe","BOL: Bol 907 Gr",0.98],["57334 C6P Base Summer Berry 4x 1","PZA: Pza 1 LT",0.35],["72763 C4B CAFEBLONDE ESPR 2.27KG","BOL: Bol 5Lb",0.06],["74136 C8B LECHE COCONUT 1.89LT","BTL: Bt 1.89Lt",3.75],["7991 Topping de calabaza2","BTE: Bte 453.6g",0.0],["Aderezo Chipotle Heinz 390 gr","BTE: Bote 390g",0.31],["Bagel Tradicional","PZA:",2.0],["Base de MangoDragonFruit 1litro","BTE: Bote 1 L",1.12],["Base Frappuccino Creme Syrup 3.0","BTL: Bt 1.89Lt",1.74],["Bearista Choco","PZA:",6.0],["BearMandil","PZA:",1.0],["BIS GALLETA CHISPAS/CHOCO CJ","PZA:",3.0],["BIS GALLETA RED VELVET CJ","PZA:",5.0],["Bis Nal Cheesecake Roulet Maxi C","PZA:",27.0],["BIS NAL SUPER CROISSANT CJ40PZAS","PZA:",71.0],["Bis Pan De Chocolate Margarina C","PZA:",11.0],["Blister Chipotle","PZA:",87.0],["C16B DAIRY PROTEIN POWDER 200GRS","BOL: Bol 200g",1.96],["Cafe 250g 12/cs Chiapas","BOL: Bolsa 250g",1.0],["Cafe Chiapas 5 Lb","BOL: Bol 5Lb",0.16],["Cafe Christmas Blend 5 LB","BOL: Bol 5Lb",0.05],["Cafe Cold Brew 5 Lb","BOL: Bol 5Lb",0.05],["Cafe Decaf Espresso Roast 5 Lb","BOL: Bol 5Lb",0.28],["Cafe Espresso Roast 5 Lb","BOL: Bol 5Lb",3.77],["Cafe1971 5 LB","BOL: Bol 5Lb",0.06],["Cake Pop Bearista CJ/36 Pzas","BLI: Blis 3pz",10.0],["Cake Pop Chocolate Cja/12 Bliste","BLI: Blis 3pz",5.67],["Cake Pop Erizo CJ/36 Pzas","BLI: Blis 3pz",4.67],["Cake Pop Vainilla Cumpleanos Cja","BLI: Blis 3pz",7.67],["CheeseCake Brulee Framb","PZA:",2.0],["Chocolate Abuela 1 kg","BOL: Bolsa 1Kg",1.34],["Chorizo Pamplona 500 gr","PAQ: Paq 500g",0.12],["Chunks Chocolate Bolsa 500 g","BOL: Bolsa 500g",0.94],["Concentrado zarzamora Bte 1lt","LT: lt",0.31],["Cookie Straw CJ/6 LTA/25 pzas","PZA:",1.0],["Crema Para Batir Cja/12 Pzas/950","LT: lt",6.25],["Croissant Pinos Crema CJ/30 Pzas","PZA:",2.0],["Crossant Pinos Choco CJ/30Pzas","PZA:",2.0],["Dona Doble Chocolate","PZA:",1.0],["Dona G&G","PZA:",13.0],["Dulces Tejas Almendras","PZA:",4.0],["Envuelto Poblano","PZA:",1.0],["Fl26Tu20DDM","PZA:",1.0],["Focaccia Roast Beef","PZA:",1.0],["Freeze Dried Strawberry 12/50g","BOL: Bolsa 50g",1.76],["Fruta Mixta 2","PZA:",2.0],["Galleta Oreo troceada Bol/500gr","BOL: Bolsa 500g",0.1],["Grilled Cheese Sandwich","PZA:",6.0],["Inclusion Dragon Fruit Liof C/12","BTE: Bte 75 grs",0.75],["Jarabe Avellana 1 Lt","LT: lt",0.07],["Jarabe Brown Sugar 1 Lt","LT: lt",0.07],["Jarabe Caramelo 1 Lt","LT: lt",0.94],["Jarabe Cinnamon Dolce 1 Lt","LT: lt",0.72],["Jarabe Classic 1 Lt","LT: lt",0.71],["Jarabe Coco 1 Lt","LT: lt",0.01],["Jarabe Frambuesa 1 Lt","LT: lt",0.13],["Jarabe Peppermint 1 Lt","LT: lt",0.1],["Jarabe S Free Vainilla 1 Lt","LT: lt",0.78],["Jarabe Toffee Nut 1 lt","BTE: Bote 1 L",0.59],["Jarabe Vainilla 1 Lt","LT: lt",6.71],["Jarabe White Mocha 750 ml","BOL: Bol 750ml",5.15],["Leche de Almendras CJ/12PZAS","BTE: Bte 946ml",6.37],["Leche Half & Half Borden","LT: lt",2.22],["Leche Soya","LT: lt",1.03],["Mango Picosito","PZA:",1.0],["Matcha sin Azucar","BOL: Bolsa 100g",1.5],["Media Baguette","PZA:",10.0],["Mermelada Fresa St Dalfour Cja/7","PZA:",2.0],["Mocha Powder","BOL: Bol 3.9 Lb",1.15],["Muffin Chocochip Nuevo","PZA:",9.0],["NuecesChoco","PZA:",2.0],["Panini 3 Quesos","PZA:",3.0],["Panini Pavo y Panela","PZA:",21.0],["PanMuertoTrad","PZA:",4.0],["Panque Limon","REB: Reb",11.0],["Pastel Classic Chocolate","PZA:",10.0],["Pastel de Zanahoria Nuevo","PZA:",2.0],["Pastel Red Velvet","PZA:",3.0],["Pechuga de Pavo 500grs","PAQ: Paq 500g",6.45],["Piadini de Claras y Espinacas","PZA:",1.0],["Polvo SCBB 24/56.7","PZA:",3.3],["PREP P/BEBIDA LIMON CJ12PZAS1LT","LT: lt",5.26],["Queso Crema","PZA:",2.0],["Queso Manchego 500grs","PAQ: Paq 500g",2.47],["Rol De Canela Cj/10 Pzas/130Gr S","PZA:",2.0],["Rosca de Reyes","PZA:",5.0],["Salsa Caramel Brulee 1.86lt","BTE: Bote1.86 L",1.3],["Salsa de calabaza","BTE: Bte 63oz",0.23],["Salsa De Caramelo Para Bebida Cj","BOL: Bolsa 1Kg",1.89],["Salsa de Dulce Leche 46 oz","BTL: Btl 46oz",0.23],["Salsa De Fresa Cj/12 Pzas/1 Lt S","LT: lt",0.73],["Salsa Panettone 1.86lt","BTE: Bote1.86 L",0.17],["Serv Dist Panque De Naranja Cj/1","PZA:",1.0],["Sp26CC24Or","PZA:",1.0],["Sp26SS20Orange","PZA:",1.0],["Strawberry Acai Juice 6/1LT","BTE: Bote 1 L",3.23],["SVETIA CJ/2000 PZAS SBX","PZA:",14.0],["Tarta de chocolate y almendra CJ","PZA:",1.0],["Tarta Moras c/chocolatebco","PZA:",1.0],["Te Mint Blend C/100","PZA:",1.0],["Te Tazo Chai Concentrado","LT: lt",1.47],["Te Teavana Green Iced CJ/24","PZA:",0.08],["Toffee Nut Sprinkles Topping 11o","PZA: 11 oz",0.11],["Topping Cranberry Azucar1bt 141g","PZA: 141g",0.14],["Topping Panettone 90gr","BTE: Bte 90g",0.05],["Topping Salsa Cranberry1bte 12","PZA: 12 oz",0.2],["Toronja en Gajos","PZA:",1.0],["Waffle Belga","PZA:",1.0],["WC26Tu16Flower","PZA:",1.0],["Xm26GlassBear","PZA:",11.0],["Xm26Tu20Card","PZA:",1.0]]};
/* Nombres del reporte que no se parecen lo suficiente a los del catálogo. */
const PX_LINK0={'301427 Leche Entera Cj/6 Pzas/2L':260,'306517 Leche Deslact Suprema 1LT':261,'306036 Leche Deslacto Light 1LT':262,
  '306035 Leche Light 1 LT':263,'306577 YogurtNaturalSinAzu900gr':265,'Media Baguette':231,'Salsa Panettone 1.86lt':215,
  'Toffee Nut Sprinkles Topping 11o':102,'Topping Cranberry Azucar1bt 141g':105,'Topping Salsa Cranberry1bte 12':103};
const PX_DIA=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],PX_DIAL=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
let PX={},pxH=7,pxDel=null,pxUp=null,pxErr='',pxMsg='',pxLinkOpen=false,pxLinkRow=null,pxSet=false,pxFil='todo',pxDelRep=null;
const pxDoc=()=>root.collection('config').doc('proyeccion');
function proySub(){pxDoc().onSnapshot(d=>{PX=d.data()||{};if(view==='pedidos')softRender()},writeErr)}
const pxDias=()=>Array.isArray(PX.dias)&&PX.dias.length?PX.dias:[3,6];
const pxLeche=()=>Array.isArray(PX.leche)&&PX.leche.length?PX.leche:[3];
const pxSeg=()=>has(PX.seg)?+PX.seg:1;
const pxAdj=()=>has(PX.adj)?+PX.adj:0;
const pxDay0=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const pxAdd=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const pxDiff=(a,b)=>Math.round((b-a)/864e5);
const pxD=d=>`${PX_DIA[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`;
const pxKey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const pxUnit=u=>{const p=String(u||'').split(':');return (p[1]||'').trim()||p[0].trim().toLowerCase()||'pza'};
const pxCeil=x=>Math.ceil(x-1e-9);
/* Leche que llega aparte (Lala): solo las leches de vaca del catálogo. */
const pxIsMilk=it=>!!it&&it.c===9&&/^leche (entera|deslactosada|light|lala)/i.test(it.n||'');
function pxReports(){
  const r=Object.assign({},(PX.del||[]).includes('base')?{}:{base:PX_BASE},PX.rep||{});
  return Object.entries(r).map(([k,v])=>Object.assign({k},v)).filter(v=>v&&Array.isArray(v.i)).sort((a,b)=>a.f<b.f?1:-1);
}
const pxDaysOf=r=>Math.max(1,pxDiff(new Date(r.f+'T00:00'),new Date(r.t+'T00:00'))+1);
/* Parecido entre nombres: trigramas de letras sin espacios. */
function pxGrams(s){s=norm(s).replace(/ /g,'');const g=new Set();for(let i=0;i<s.length-2;i++)g.add(s.slice(i,i+3));return g}
function pxScore(a,b){let n=0;a.forEach(x=>{if(b.has(x))n++});if(!a.size||!b.size)return 0;
  return Math.max(2*n/(a.size+b.size),b.size>=8?.9*n/b.size:0)}
let pxMatchCache={sig:'',m:{}};
function pxMatch(names){
  const all=items(),byId={};all.forEach(it=>byId[it.id]=it);
  const sig=names.join('|')+'#'+all.length+'#'+JSON.stringify(PX.link||{});
  if(pxMatchCache.sig===sig)return pxMatchCache.m;
  const m={},used=new Set(),man=Object.assign({},PX_LINK0,PX.link||{});
  names.forEach(n=>{if(n in man){const id=man[n];if(id!==null&&id>=0&&byId[id]){m[n]=id;used.add(id)}else m[n]=null}});
  const cand=all.filter(it=>it.n&&![0,1,13,14].includes(it.c)&&!used.has(it.id)).map(it=>({it,g:pxGrams(it.n)}));
  const pairs=[];names.filter(n=>!(n in m)).forEach(n=>{const g=pxGrams(n);cand.forEach(c=>{const s=pxScore(g,c.g);if(s>=.6)pairs.push([s,n,c.it.id])})});
  pairs.sort((a,b)=>b[0]-a[0]);
  pairs.forEach(([s,n,id])=>{if(!(n in m)&&!used.has(id)){m[n]=id;used.add(id)}});
  names.forEach(n=>{if(!(n in m))m[n]=null});
  pxMatchCache={sig,m};return m;
}
/* Fechas de entrega a partir de mañana, hasta n días. */
function pxDeliveries(days,n){const t=pxDay0(),out=[];for(let i=1;i<=n;i++){const d=pxAdd(t,i);if(days.includes(d.getDay()))out.push(d)}return out}
function pxModel(){
  const reps=pxReports(),tot={},unit={};let ndays=0;
  reps.forEach(r=>{ndays+=pxDaysOf(r);r.i.forEach(([n,u,q])=>{tot[n]=(tot[n]||0)+(+q||0);if(!unit[n])unit[n]=u})});
  const names=Object.keys(tot),m=pxMatch(names),byId={};items().forEach(it=>byId[it.id]=it);
  const f=1+pxAdj()/100,t0=pxDay0(),seg=pxSeg();
  const rows=names.map(n=>{
    const it=m[n]!==null?byId[m[n]]:null,r=ndays?tot[n]/ndays*f:0;
    const s=it&&has(st.count[it.id])?+st.count[it.id]:null,milk=pxIsMilk(it);
    const sched=milk?pxLeche():pxDias(),dels=pxDeliveries(sched,pxH+14);
    const safe=Math.max(it&&has(st.min[it.id])?+st.min[it.id]:0,r*seg);
    /* Simula el inventario: baja con el uso diario (sin pasar de 0, lo que falta es venta perdida) y sube con cada pedido. */
    const plan={};let lvl=s||0,prev=t0;
    dels.forEach((d,k)=>{if(pxDiff(t0,d)>pxH||!dels[k+1])return;
      lvl=Math.max(0,lvl-r*pxDiff(prev,d));const o=Math.max(0,pxCeil(r*pxDiff(d,dels[k+1])+safe-lvl));plan[pxKey(d)]=o;lvl+=o;prev=d});
    const cover=r>0&&s!==null?s/r:null,first=dels[0];
    const short=r>0&&first&&(s===null?false:s<r*pxDiff(t0,first));
    return{n,it,u:pxUnit(unit[n]),r,s,milk,plan,cover,short,proj:r*pxH,first};
  }).filter(x=>x.r>0);
  rows.sort((a,b)=>(a.it?a.it.c:99)-(b.it?b.it.c:99)||(a.it?a.it.n:a.n).localeCompare(b.it?b.it.n:b.n));
  const cols=[...new Set([...pxDeliveries(pxDias(),pxH),...pxDeliveries(pxLeche(),pxH)].map(pxKey))].sort();
  return{rows,ndays,reps,cols};
}
const pxF=v=>fmtN(v>=10?Math.round(v):Math.round(v*10)/10);
const pxName=x=>x.it?(x.it.n||'Sin nombre'):x.n;
function pedidos(){
  const M=pxModel(),t0=pxDay0();
  const nextAll=pxDeliveries([...new Set(pxDias().concat(pxLeche()))],14).slice(0,4);
  let h=pxUploadHTML()+`<div class="seg" style="margin-top:12px" role="group" aria-label="Proyección">${[[3,'3 días'],[7,'1 semana'],[14,'2 semanas']].map(([d,l])=>`<button class="chip" data-h="${d}" aria-pressed="${pxH===d}">${l}</button>`).join('')}</div>`;
  const short=M.rows.filter(x=>x.short),nocount=M.rows.filter(x=>x.s===null);
  h+=`<div class="sum"><div class="tile"><b>${M.rows.length}</b><span>insumos con base</span></div>
  <div class="tile"><b style="color:${short.length?'var(--crit)':'var(--ok)'}">${short.length}</b><span>se acaban antes de su entrega</span></div>
  <div class="tile"><b style="color:${nocount.length?'var(--warn)':'var(--ok)'}">${nocount.length}</b><span>sin conteo</span></div></div>`;
  h+=`<p class="note">Próximas entregas: ${nextAll.map(d=>`<b>${pxD(d)}</b>${pxLeche().includes(d.getDay())?' (con leche)':''}`).join(' · ')}. Uso diario sacado de ${M.reps.length} reporte${M.reps.length===1?'':'s'} (${M.ndays} día${M.ndays===1?'':'s'})${pxAdj()?`, ajustado ${pxAdj()>0?'+':''}${pxAdj()}%`:''}.</p>`;
  if(!M.rows.length)return h+`<p class="note">No hay reportes de uso. Sube tu PDF arriba.</p>`+pxReportsHTML(M);
  h+=`<div class="seg" style="margin-top:12px" role="group" aria-label="Filtro">${[['todo','Todo'],['pedir','Hay que pedir'],['falta','Se acaba antes']].map(([k,l])=>`<button class="chip" data-f="${k}" aria-pressed="${pxFil===k}">${l}</button>`).join('')}</div>`;
  const vis=M.rows.filter(x=>pxFil==='todo'||(pxFil==='falta'?x.short:M.cols.some(c=>x.plan[c]>0)));
  /* Pedido sugerido por entrega */
  h+=`<div class="cat">Pedido sugerido · próximos ${pxH===14?'14 días':pxH===7?'7 días':'3 días'}</div>`;
  if(!M.cols.length)h+='<p class="note">No hay entregas en este periodo.</p>';
  else if(!vis.length)h+='<p class="note">Nada con este filtro.</p>';
  else{let last=-2;
    h+=`<div class="tbl"><table class="px"><thead><tr><th>Insumo</th>${M.cols.map(c=>{const d=new Date(c+'T00:00');return `<th class="r">${pxD(d)}</th>`}).join('')}</tr></thead><tbody>`;
    vis.forEach(x=>{const c=x.it?x.it.c:-1;if(c!==last){last=c;h+=`<tr class="grp"><td colspan="${M.cols.length+1}">${c<0?'Sin vincular al catálogo':esc(DATA.cats[c])}</td></tr>`}
      h+=`<tr><td>${esc(pxName(x))}<div class="meta">${x.it&&x.it.sap?x.it.sap+' · ':''}${esc(x.u)}${x.s===null?' · <span class="tag">sin conteo</span>':''}</div></td>${M.cols.map(c=>{
        if(!(c in x.plan))return '<td class="n mute">—</td>';const o=x.plan[c];return `<td class="n${o?'':' mute'}">${o?fmtN(o):'0'}</td>`}).join('')}</tr>`});
    h+='</tbody></table></div>';
    h+=`<p class="note">Cantidad para pedir en cada entrega, en la unidad del reporte. Cubre el uso entre esa entrega y la siguiente más ${fmtN(pxSeg())} día${pxSeg()===1?'':'s'} de reserva (o el mínimo del catálogo si es mayor), descontando lo que se calcula que quedará ese día según el conteo actual. "—" = ese día no llega (la leche llega solo ${pxLeche().map(d=>PX_DIAL[d]).join(' y ')}). Sin conteo se calcula como si hubiera 0.</p>`;
    h+=`<div class="actions"><select id="pxPdfD" class="per" aria-label="Entrega para el PDF">${M.cols.map(c=>`<option value="${c}">${pxD(new Date(c+'T00:00'))}</option>`).join('')}</select><button class="btn pri" id="pxPdf">Descargar pedido (PDF)</button></div><p class="note" id="pdfMsg" hidden></p>`;
  }
  /* Proyección */
  h+=`<div class="cat">Proyección de consumo · ${pxH} días</div>`;
  if(vis.length){let last=-2;
    h+=`<div class="tbl"><table class="px"><thead><tr><th>Insumo</th><th class="r">Uso/día</th><th class="r">${pxH} días</th><th class="r">Hay</th><th class="r">Dura</th></tr></thead><tbody>`;
    vis.forEach(x=>{const c=x.it?x.it.c:-1;if(c!==last){last=c;h+=`<tr class="grp"><td colspan="5">${c<0?'Sin vincular al catálogo':esc(DATA.cats[c])}</td></tr>`}
      const cov=x.cover===null?'—':x.cover>=60?'60+ días':`${fmtN(Math.floor(x.cover*10)/10)} d<div class="meta" style="justify-content:flex-end">${pxD(pxAdd(t0,Math.floor(x.cover)))}</div>`;
      h+=`<tr><td>${esc(pxName(x))}<div class="meta">${esc(x.u)}</div></td><td class="n">${pxF(x.r)}</td><td class="n">${pxF(x.proj)}</td><td class="n">${x.s===null?'—':fmtN(x.s)}</td><td class="n" style="${x.short?'color:var(--crit)':''}">${cov}</td></tr>`});
    h+='</tbody></table></div><p class="note">Dura = días que dura lo contado al ritmo de uso diario. En rojo, lo que se acaba antes de que llegue su próxima entrega.</p>';
  }
  return h+pxLinkHTML(M)+pxSettingsHTML()+pxReportsHTML(M);
}
function pxLinkHTML(M){
  const un=M.rows.filter(x=>!x.it);
  let h=`<div class="cat">Vínculo con el catálogo</div><p class="note" style="margin-top:0">${M.rows.length-un.length} de ${M.rows.length} insumos del reporte están unidos a un producto del catálogo (de ahí sale lo que "hay"). ${un.length?`<b>${un.length} sin vincular.</b>`:''} <button class="lnk" id="pxLinkT">${pxLinkOpen?'Ocultar':'Revisar vínculos'}</button></p>`;
  if(!pxLinkOpen)return h;
  const opts=sel=>'<option value="-1">— Sin vincular —</option>'+items().filter(it=>it.n).slice().sort((a,b)=>a.n.localeCompare(b.n)).map(it=>`<option value="${it.id}"${it.id===sel?' selected':''}>${esc(it.n)}${it.sap?' · '+it.sap:''}</option>`).join('');
  const list=M.rows.slice().sort((a,b)=>(!!a.it)-(!!b.it)||a.n.localeCompare(b.n));
  h+=`<div class="tbl"><table><thead><tr><th>En el reporte</th><th>En el catálogo</th></tr></thead><tbody>${list.map((x,i)=>`<tr><td>${esc(x.n)}</td><td>${pxLinkRow===x.n?`<select class="per" data-ln="${esc(x.n)}" aria-label="Producto del catálogo para ${esc(x.n)}">${opts(x.it?x.it.id:-1)}</select>`:`${x.it?esc(x.it.n):'<span class="mute">Sin vincular</span>'} <button class="lnk" data-lr="${i}">Cambiar</button>`}</td></tr>`).join('')}</tbody></table></div>`;
  pxLinkHTML.list=list;
  return h;
}
function pxSettingsHTML(){
  let h=`<div class="cat">Ajustes de pedido</div><p class="note" style="margin-top:0">Entregas ${pxDias().map(d=>PX_DIAL[d]).join(' y ')} · leche ${pxLeche().map(d=>PX_DIAL[d]).join(' y ')} · ${fmtN(pxSeg())} día${pxSeg()===1?'':'s'} de reserva${pxAdj()?` · demanda ${pxAdj()>0?'+':''}${pxAdj()}%`:''}. <button class="lnk" id="pxSetT">${pxSet?'Ocultar':'Cambiar'}</button></p>`;
  if(!pxSet)return h;
  const days=(k,sel)=>`<div class="seg">${[1,2,3,4,5,6,0].map(d=>`<button class="chip" data-wd="${k}:${d}" aria-pressed="${sel.includes(d)}">${PX_DIA[d]}</button>`).join('')}</div>`;
  return h+`<div class="addf" style="border-color:var(--line)">
    <label>Días que llega el pedido</label>${days('dias',pxDias())}
    <label>Días que llega la leche (entera, deslactosada, light)</label>${days('leche',pxLeche())}
    <label for="pxSeg">Días de reserva (colchón por si sube la venta o se atrasa la entrega)</label><input id="pxSeg" inputmode="decimal" value="${pxSeg()}">
    <label for="pxAdj">Ajuste de demanda en % (ej. 15 para temporada alta, -10 si baja)</label><input id="pxAdj" inputmode="decimal" value="${pxAdj()}">
    <p class="note" style="margin:0">Se guardan para toda la tienda.</p></div>`;
}
/* Caja para subir el PDF: va arriba de todo en Pedidos para que se vea de inmediato. */
function pxUploadHTML(){
  let h=`<div class="cat" style="margin-top:0">Base para el pedido: tu reporte en PDF</div>`;
  if(!pxUp)h+=`<div class="addf"><input class="vh" type="file" id="pxFile" accept=".pdf,application/pdf">
    <label class="drop" for="pxFile">${UPLOAD}<b>Subir PDF del reporte de uso</b><span>"Inventory Item Usage Analysis". La app lo lee y con eso calcula qué pedir para 3 días, 1 semana y 2 semanas.</span></label>
    ${pxErr?`<p class="note err">${esc(pxErr)}</p>`:''}${pxMsg?`<p class="note" style="color:var(--ok)">${esc(pxMsg)}</p>`:''}
    <p class="note" style="margin:0">Entre más días subas (por ejemplo una semana completa), más real sale el uso diario: un solo día no ve la diferencia entre semana y fin de semana.</p></div>`;
  else h+=`<div class="addf"><div class="meta">${esc(pxUp.name)}</div>
    <p style="margin:0">Del <b>${fmtDate(pxUp.f)}</b> al <b>${fmtDate(pxUp.t)}</b> (${pxDaysOf(pxUp)} día${pxDaysOf(pxUp)===1?'':'s'}) · ${pxUp.i.length} insumos${pxUp.g?` · ${pxUp.g} clientes`:''}</p>
    <div class="tbl" style="margin-top:0"><table><tbody>${pxUp.i.slice(0,5).map(([n,u,q])=>`<tr><td>${esc(n)}</td><td class="n">${fmtN(q)} <span class="mute">${esc(pxUnit(u))}</span></td></tr>`).join('')}</tbody></table></div>
    <div class="actions" style="margin-top:6px"><button class="btn pri" id="pxSave">Guardar reporte</button><button class="btn" id="pxCancel">Cancelar</button></div></div>`;
  return h;
}
function pxReportsHTML(M){
  let h=`<div class="cat">Reportes de uso guardados</div><p class="note" style="margin-top:0">El uso diario sale del promedio de todos estos. Quita los que ya no quieras usar.</p>`;
  h+=`<div class="tbl"><table><tbody>${M.reps.map(r=>`<tr><td>${r.f===r.t?fmtDate(r.f):fmtDate(r.f)+' al '+fmtDate(r.t)}<div class="meta">${r.i.length} insumos${r.g?' · '+r.g+' clientes':''}${r.k==='base'?' · el que mandaste para empezar':''}</div></td><td class="n">${pxDelRep===r.k?`¿Quitar? <button class="lnk" data-rk="${r.k}" data-ra="yes">Sí</button> <button class="lnk" data-ra="no">No</button>`:`<button class="lnk" data-rk="${r.k}" data-ra="ask">Quitar</button>`}</td></tr>`).join('')||'<tr><td>Sin reportes.</td></tr>'}</tbody></table></div>`;
  return h;
}
/* Lee el PDF del reporte con pdf.js: arma renglones por posición y saca nombre, unidad y uso. */
let pxPdfLib=null;
function pxLoadPdfJs(){
  if(pxPdfLib)return pxPdfLib;
  pxPdfLib=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload=()=>{pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';ok(pdfjsLib)};
    s.onerror=()=>{pxPdfLib=null;no(new Error('lib'))};document.head.appendChild(s)});
  return pxPdfLib;
}
function pxParseLines(lines){
  const rx=/^\s*(.+?)\s+([A-Z]{2,4}):(.*?)\s+(-?[\d,]+\.\d+)\s+(-?[\d,]+\.\d+)\s+(-?[\d,]+\.\d+)\s+(-?[\d,]+\.\d+)\s+(-?[\d,]+\.\d+)/;
  const num=s=>parseFloat(s.replace(/,/g,''));const out=[];let f=null,t=null,g=null;
  lines.forEach(l=>{
    const d=l.match(/(\d{2})\/(\d{2})\/(\d{4})\s+to\s+(\d{2})\/(\d{2})\/(\d{4})/);if(d&&!f){f=`${d[3]}-${d[2]}-${d[1]}`;t=`${d[6]}-${d[5]}-${d[4]}`}
    const gc=l.match(/Guest Count:\s*([\d,]+)/);if(gc)g=num(gc[1]);
    const m=l.match(rx);if(m&&!/Item Name|Report Date/.test(l))out.push([m[1].trim(),(m[2]+': '+m[3].trim()).trim(),num(m[5])]);
  });
  return{f,t,g,i:out};
}
async function pxReadPdf(file){
  pxErr='';pxMsg='';
  try{
    const lib=await pxLoadPdfJs();
    const pdf=await lib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const lines=[];
    for(let p=1;p<=pdf.numPages;p++){
      const tc=await (await pdf.getPage(p)).getTextContent(),rows=[];
      tc.items.forEach(it=>{if(!it.str||!it.str.trim())return;const y=it.transform[5],x=it.transform[4];
        let r=rows.find(r=>Math.abs(r.y-y)<2.5);if(!r){r={y,c:[]};rows.push(r)}r.c.push({x,s:it.str})});
      rows.sort((a,b)=>b.y-a.y).forEach(r=>lines.push(r.c.sort((a,b)=>a.x-b.x).map(c=>c.s.trim()).join('   ')));
    }
    const r=pxParseLines(lines);
    if(!r.i.length)throw new Error('vacio');
    if(!r.f){r.f=r.t=today()}
    pxUp=Object.assign({name:file.name},r);
  }catch(e){pxUp=null;pxErr=e.message==='lib'?'No se pudo cargar el lector de PDF. Revisa tu conexión y vuelve a intentar.':'No encontré insumos en ese PDF. Debe ser el reporte "Inventory Item Usage Analysis".'}
  render();
}
async function pxMakePdf(key){
  const m=$('pdfMsg');const say=t=>{m.textContent=t;m.hidden=false};
  if(!window.jspdf)return say('No se pudo cargar el generador de PDF. Revisa tu conexión y vuelve a intentar.');
  const M=pxModel(),rows=M.rows.filter(x=>x.plan[key]>0);
  if(!rows.length)return say('No hay nada que pedir para esa entrega.');
  const d=new Date(key+'T00:00'),{jsPDF}=window.jspdf,doc=new jsPDF({unit:'pt',format:'letter'});
  doc.setFont('helvetica','bold');doc.setFontSize(15);doc.text('Pedido sugerido',40,46);
  doc.setFont('helvetica','normal');doc.setFontSize(10);doc.text(`Entrega del ${PX_DIAL[d.getDay()]} ${d.toLocaleDateString('es-MX')} · ${rows.length} insumos · hecho el ${new Date().toLocaleDateString('es-MX')}`,40,63);
  doc.autoTable({startY:76,head:[['SAP','INSUMO','UNIDAD','HAY','PEDIR']],body:rows.map(x=>[x.it&&x.it.sap||'',pxName(x),x.u,x.s===null?'—':fmtN(x.s),fmtN(x.plan[key])]),
    styles:{font:'helvetica',fontSize:9.5,cellPadding:4},headStyles:{fillColor:[31,95,191],textColor:255},
    columnStyles:{0:{cellWidth:60},2:{cellWidth:80},3:{cellWidth:50,halign:'right'},4:{cellWidth:55,halign:'right'}},margin:{left:40,right:40}});
  const name=`pedido-${key}.pdf`;
  try{doc.save(name);say('Listo, PDF descargado.')}catch(e){say('Este navegador no dejó descargar el PDF.')}
}
function pxSave(o){pxDoc().set(o,{merge:true}).catch(writeErr)}
function bindPedidos(){
  document.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{pxH=+b.dataset.h;render()});
  document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{pxFil=b.dataset.f;render()});
  const pb=$('pxPdf');if(pb)pb.onclick=()=>pxMakePdf($('pxPdfD').value);
  const lt=$('pxLinkT');if(lt)lt.onclick=()=>{pxLinkOpen=!pxLinkOpen;pxLinkRow=null;render()};
  document.querySelectorAll('[data-lr]').forEach(b=>b.onclick=()=>{pxLinkRow=pxLinkHTML.list[+b.dataset.lr].n;render()});
  document.querySelectorAll('[data-ln]').forEach(s=>{s.focus();s.onchange=()=>{const v=+s.value;pxSave({link:{[s.dataset.ln]:v<0?-1:v}});
    PX.link=Object.assign({},PX.link,{[s.dataset.ln]:v<0?-1:v});pxLinkRow=null;render()}});
  const stt=$('pxSetT');if(stt)stt.onclick=()=>{pxSet=!pxSet;render()};
  document.querySelectorAll('[data-wd]').forEach(b=>b.onclick=()=>{const[k,d]=b.dataset.wd.split(':');const cur=(k==='dias'?pxDias():pxLeche()).slice(),n=+d;
    const i=cur.indexOf(n);if(i>=0){if(cur.length===1)return;cur.splice(i,1)}else cur.push(n);cur.sort();PX[k]=cur;pxSave({[k]:cur});render()});
  [['pxSeg','seg',0,30],['pxAdj','adj',-90,300]].forEach(([id,k,lo,hi])=>{const e=$(id);if(e)e.onchange=()=>{const v=parseFloat(String(e.value).replace(',','.'));
    if(isNaN(v)||v<lo||v>hi){e.value=k==='seg'?pxSeg():pxAdj();return}PX[k]=v;pxSave({[k]:v});render()}});
  const f=$('pxFile');if(f)f.onchange=()=>f.files[0]&&pxReadPdf(f.files[0]);
  if(pxUp){$('pxCancel').onclick=()=>{pxUp=null;render()};
    $('pxSave').onclick=()=>{const k=pxUp.f+'_'+pxUp.t,o={f:pxUp.f,t:pxUp.t,g:pxUp.g||null,i:pxUp.i};
      const del=(PX.del||[]).filter(x=>x!==k);
      if(k===PX_BASE.f+'_'+PX_BASE.t&&!del.includes('base'))del.push('base'); /* el mismo día que el incluido: lo reemplaza */
      pxSave({rep:{[k]:o},del});PX.rep=Object.assign({},PX.rep,{[k]:o});PX.del=del;
      pxMsg=`Reporte del ${fmtDate(pxUp.f)}${pxUp.f!==pxUp.t?' al '+fmtDate(pxUp.t):''} guardado.`;pxUp=null;render()}}
  document.querySelectorAll('[data-ra]').forEach(b=>b.onclick=()=>{const a=b.dataset.ra;
    if(a==='ask')pxDelRep=b.dataset.rk;else if(a==='no')pxDelRep=null;
    else{const k=b.dataset.rk;if(k==='base'){const del=(PX.del||[]).concat('base');PX.del=del;pxSave({del})}
      else{pxSave({rep:{[k]:FV.delete()}});if(PX.rep)delete PX.rep[k]}pxDelRep=null}
    render()});
}

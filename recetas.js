/* Recetas estándar de bebidas (tomadas de los PDF "Bebidas Calientes", "Bebidas Heladas" y "Frappuccino").

   Cada bebida:
     n   nombre                       g  grupo: cal | hel | fra | prep
     s   subgrupo (para agrupar)      c  código del vaso (CM, L, MB…)
     d   descripción corta            z  tamaños (si no se pone: Alto, Grande, Venti)
     tapa  tipo de tapa: hot | nitro | domo | plana | short   (vaso y tapa se descuentan solos según el grupo)
     p   pasos, en orden. Cada paso:
           t  título del paso         x  instrucciones (lista)
           q  cantidad por tamaño     u  unidad (shot, pump, scoop, medida, bolsita, ml, pza, toque)
           i  id del insumo del catálogo que se descuenta (null = no está en el catálogo)
           l  la cantidad sale de "Leche por tamaño" (lc caliente, lh helada, lf frappuccino) y f es la proporción
           o  opcional (solo si el cliente lo pide): se muestra pero no se descuenta
     nota  aviso extra de la receta

   Si un paso trae insumo pero no cantidad (ej. "hasta la línea del vaso"), se muestra en la receta pero no
   se descuenta hasta que se le ponga una medida. */
(function(){
const ESP=86,VAIN=130,CLAS=124,CARS=140,MOCHA=136,MBCO=131,CHAI=145,CREMA=118,CANELA=15,
  ENTERA=260,LIGHT=263,AVENA=108,COCO=111,BCOF=107,BCRE=113,ROAST=137,LIMON=138,FRESA=142;
const leche=(l,f,x,i)=>({t:'Vierte la leche',i:i||ENTERA,l,f:f||1,u:'ml',x});
const vapor=(x,f)=>({t:'Vaporiza la leche',i:ENTERA,l:'lc',f:f||1,u:'ml',x});
const shots=(q,t)=>({t:t||'Agrega shots de espresso en fila',q,u:'shot',i:ESP});
const crema=x=>({t:'Crema batida',i:CREMA,x:[x||'Cubre con crema batida.']});
/* Frappuccino: pasos comunes */
const FRL={t:'Vierte la leche',i:ENTERA,l:'lf',f:1,u:'ml',x:['Vierte hasta la línea inferior del vaso.']};
const FRV={t:'Vierte el contenido del vaso',x:['En el vaso de la licuadora.']};
const FRH={t:'Agrega hielo',x:['Usa la medida volumétrica apropiada.']};
const FRM={t:'Mezcla',x:['Presiona el botón n.º 1.']};
const FRR={t:'Agrega Frappuccino Roast',q:[2,3,4],u:'pump',i:ROAST,x:['Dosificador metal Frappuccino Roast.']};
const BC={t:'Agrega base coffee para Frappuccino',q:[2,3,4],u:'pump',i:BCOF};
const BR={t:'Agrega base cream para Frappuccino',q:[2,3,4],u:'pump',i:BCRE};
const FIN1='Vierte 1 cm por debajo del borde del vaso.',DOMO='Coloca tapa domo, entrega con popote y conecta.';
const NITRO='Coloca tapa nitro y conecta.',TAPA='Coloca tapa, entrega y conecta.';
const SHAKE=['Llena con hielo hasta la línea apropiada del shaker.','Coloca la tapa en el shaker.','Agita 10 veces, con fuerza y lentamente.','Vierte el contenido en el vaso.'];
const shaken=(n,c,d,sab)=>({n,g:'hel',s:'Shaken espresso',c,d,tapa:'nitro',p:[
  shots([2,3,4],'Pon en fila los shots'),sab,
  {t:'Agrega hielo',x:['Agrega el hielo en el shaker, hasta la línea del hielo.']},
  {t:'Agrega shots de espresso',x:['Agrega los shots sobre el hielo.','Coloca la tapa en el shaker.','Agita 10 veces, con fuerza y lentamente.','Vierte el contenido en el vaso.']},
  leche('lh',.5,['Agrega bebida de avena alrededor de las paredes del vaso hasta 6 mm por debajo del borde.',NITRO],AVENA)]});
const refresher=(n,c,d,base,baseI,liq,liqI,inc,incI)=>({n,g:'hel',s:'Refreshers y tés',c,d,tapa:'nitro',p:[
  {t:'Agrega base '+base,i:baseI,x:['Llena el vaso shaker hasta el número 1 de la línea naranja, según el tamaño.']},
  {t:'Agrega '+liq,i:liqI,x:['Llena el vaso shaker hasta el número 3 de la línea naranja, según el tamaño.']},
  {t:'Agrega inclusión de '+inc,q:[1,1,1],u:'scoop',i:incI},
  {t:'Termina',x:SHAKE.concat(NITRO)}]});
const lemonTea=(n,c,te,teI)=>({n,g:'hel',s:'Refreshers y tés',c,d:'Bebida helada a base de té '+te+' con limonada, ligeramente endulzada.',tapa:'nitro',p:[
  {t:'Agrega el té '+te,i:teI,x:['Llena el vaso shaker hasta el número 1 de la línea naranja, según el tamaño.']},
  {t:'Agrega limonada',i:LIMON,x:['Agrega limonada hasta el número 3 de la línea naranja.']},
  {t:'Agrega jarabe clásico',q:[2,3,4],u:'pump',i:CLAS,x:['Pump plástico de CBS.']},
  {t:'Termina',x:SHAKE.concat(NITRO)}]});
const frozenRef=(n,base,baseI,inc,incI,d)=>({n,g:'fra',s:'Frozen',d,tapa:'plana',p:[
  {t:'Vierte base '+base,i:baseI,x:['Llena el vaso shaker hasta el número 1 de la línea naranja, según el tamaño.']},
  {t:'Vierte limonada',i:LIMON,x:['Llena el vaso shaker hasta el número 2 de la línea naranja, según el tamaño.']},
  {t:'Vierte el contenido del shaker',x:['En el vaso de la licuadora.']},FRH,BR,FRM,
  {t:'Prepara shakerato de limonada',q:[1,1,1],u:'scoop',i:incI,x:['Vierte limonada hasta el número 1 de la línea naranja del shaker.','Agrega 1 cucharada de inclusión de '+inc+'.','Coloca la tapa y agita 10 veces, con fuerza y lentamente.']},
  {t:'Termina',x:['Vierte la bebida en el vaso a 1 cm por debajo del borde.','Llena con el shakerato de limonada.','Coloca tapa plana, entrega con popote y conecta.']}]});
const frozenLem=(n,inc,incI,d)=>({n,g:'fra',s:'Frozen',d,tapa:'plana',p:[
  {t:'Agrega limonada',i:LIMON,x:['Llena el vaso hasta la segunda línea, según el tamaño.']},
  FRV,{t:'Agrega inclusión de '+inc,q:[1,1,1],u:'scoop',i:incI},
  {t:'Agrega hielo',x:['Llena con hielo hasta la línea apropiada del shaker.']},BR,FRM,
  {t:'Salsa de fresa',i:FRESA,x:['Agrega salsa de fresa de la mamila al fondo del vaso, solo hasta el ring inferior (primer borde del vaso).']},
  {t:'Termina',x:[FIN1,'Coloca tapa plana, entrega con popote y conecta.']}]});

window.RECETAS=[
/* ---------------- BEBIDAS CALIENTES ---------------- */
{n:'Café Misto',g:'cal',s:'Con café',c:'MIS',d:'Café filtrado recién colado y leche vaporizada (Café au Lait).',tapa:'hot',p:[
  vapor(['Vierte leche hasta la línea de la jarra (Alto: línea vaso corto; Grande y Venti: línea vaso alto).','Airea de 1 a 3 segundos.'],.5),
  {t:'Agrega café filtrado',x:['Llena el vaso hasta la mitad con café filtrado.']},
  {t:'Termina',x:['Llena el resto con leche vaporizada hasta 6 mm debajo del borde.',TAPA]}]},
{n:'Cajeta Latte',g:'cal',s:'Con café',c:'K',d:'Leche vaporizada con cajeta, crema batida y espiral de caramelo.',tapa:'hot',p:[
  vapor(['Vacía la leche hasta la línea apropiada de la jarra.','Vaporiza EXTRA HOT de 1 a 3 segundos.']),shots([1,2,2]),
  {t:'Agrega salsa de cajeta',q:[3,4,5],u:'pump',i:141,x:['Dosificador metal espresso.']},
  {t:'Termina',i:CARS,x:['Llena con leche al vapor hasta 12 mm por debajo del borde.','Cubre con crema batida y termina con 5 espirales de caramelo.',TAPA]},crema()]},
{n:'Cappuccino',g:'cal',s:'Con café',c:'C',d:'Espresso con leche vaporizada, cubierto con una capa profunda de espuma.',tapa:'hot',p:[
  vapor(['Vacía la leche hasta por debajo de la línea de la jarra.','Airea de 6 a 8 segundos.'],.75),shots([1,2,2]),
  {t:'Agrega jarabe saborizante',q:[3,4,5],u:'pump',o:1,x:['Solo si el cliente lo solicita (pump plástico espresso).']},
  {t:'Termina',x:['Vierte libremente la leche con espuma hasta 6 mm por debajo del borde.',TAPA]}],
  nota:'Dry cappuccino: menos leche y más espuma. Wet cappuccino: más leche y menos espuma.'},
{n:'Caramel Macchiato',g:'cal',s:'Con café',c:'CM',d:'Vainilla y leche vaporizada, con espresso y rejilla de caramelo.',tapa:'hot',p:[
  vapor(['Vierte leche hasta la línea de la jarra.','Airea de 1 a 3 segundos.']),
  {t:'Agrega jarabe de vainilla',q:[2,3,4],u:'pump',i:VAIN,x:['Pump plástico espresso. Lleva un pump menos que las bebidas estándar.']},
  shots([1,2,2]),
  {t:'Termina',i:CARS,x:['Llena ¾ del vaso con leche vaporizada y cubre con espuma hasta 12 mm por debajo del borde.','Vierte los shots sobre la parte central del vaso.','Cubre con caramelo: 7 y 7 líneas entrecruzadas y 2 círculos.',TAPA]}]},
{n:'Cinnamon Dolce Latte',g:'cal',s:'Con café',c:'CDL',d:'Espresso, leche vaporizada y jarabe de canela dulce, con crema batida y canela.',tapa:'hot',p:[
  vapor(['Vacía la leche hasta la línea apropiada de la jarra.','Vaporiza EXTRA HOT de 1 a 3 segundos.']),shots([1,2,2]),
  {t:'Agrega jarabe Cinnamon Dolce',q:[3,4,5],u:'pump',i:123},
  {t:'Termina',x:['Llena con leche al vapor hasta 12 mm por debajo del borde.',TAPA]},crema(),
  {t:'Canela en polvo',q:[2,2,2],u:'toque',i:CANELA,x:['Espolvorea 2 veces el salero de canela sobre la crema batida.']}]},
{n:'Espresso Americano',g:'cal',s:'Con café',c:'EA',d:'Espresso con agua caliente al estilo europeo.',tapa:'hot',p:[
  shots([2,3,4]),{t:'Termina',x:['Vierte los shots en el vaso.','Llena con agua caliente de la BUNN hasta 6 mm por debajo del borde.','Coloca la tapa y conecta.']}]},
{n:'Espresso con Panna',g:'cal',s:'Con café',c:'EP',d:'Espresso cubierto con crema batida.',z:['Solo','Doppio'],tapa:'short',p:[
  shots([1,2],'Agrega shots de espresso'),{t:'Termina',x:['Vierte directo en un vaso short.',TAPA]},crema()]},
{n:'Espresso Macchiato',g:'cal',s:'Con café',c:'EM',d:'Espresso cubierto con espuma.',z:['Solo','Doppio'],tapa:'short',p:[
  {t:'Vaporiza la leche',x:['Vierte la leche por debajo de la línea para vaso corto en la jarra.','Airea de 6 a 8 segundos.']},
  shots([1,2],'Agrega shots de espresso'),{t:'Termina',x:['Vierte directo en un vaso short.','Cubre con una cuchara llena de espuma.',TAPA]}]},
{n:'Espresso',g:'cal',s:'Con café',c:'E',d:'Espresso sencillo o doppio.',z:['Solo','Doppio'],tapa:'espresso',p:[
  shots([1,2],'Agrega shots de espresso'),
  {t:'Termina',x:['Solo: vaso de 4 oz. Doppio: vaso short.','Coloca el número de shots que pide el cliente (sencillo 1, doble 2, triple 3…).','Para Drive Thru sirve siempre en vaso de 8 oz.',TAPA]}]},
{n:'Flat White',g:'cal',s:'Con café',c:'FW',d:'Shots ristretto con un shot adicional, leche cremosa y punto de espuma.',tapa:'hot',p:[
  vapor(['Vacía la leche hasta la línea apropiada de la jarra.','Airea de 1 a 3 segundos.']),
  shots([2,3,3],'Agrega shots de espresso ristretto'),
  {t:'Termina',x:['Vierte los shots directamente en el vaso.','Vierte la leche lenta y constante al centro del vaso inclinado a 45° hasta llenar 2/3.','Acerca la jarra a la superficie para hacer un punto de espuma hasta 6 mm por debajo del borde.',TAPA]}]},
{n:'Latte Macchiato',g:'cal',s:'Con café',c:'LM',d:'Leche vaporizada con extra shot de espresso, sabor más intenso.',tapa:'hot',p:[
  vapor(['Vacía la leche hasta la línea apropiada de la jarra.','Airea de 1 a 3 segundos.']),shots([2,3,3]),
  {t:'Termina',x:['Vierte los shots en una jarra de 148 ml.','Llena con leche al vapor hasta 12 mm por debajo del borde.','Vierte los shots sobre la parte central del vaso.','Coloca la tapa y conecta.']}]},
{n:'Latte',g:'cal',s:'Con café',c:'L',d:'Espresso con leche vaporizada, ligeramente cubierto con espuma.',tapa:'hot',p:[
  vapor(['Vacía la leche hasta la línea apropiada de la jarra.','Airea de 1 a 3 segundos.']),shots([1,2,2]),
  {t:'Agrega jarabe saborizante',q:[3,4,5],u:'pump',o:1,x:['Solo si el cliente lo solicita (pump plástico espresso).']},
  {t:'Termina',x:['Llena con leche vaporizada y 6 mm de espuma hasta 6 mm debajo del borde.',TAPA]}]},
{n:'Mocha',g:'cal',s:'Con café',c:'M',d:'Espresso con leche vaporizada y mocha, con crema batida.',tapa:'hot',p:[
  vapor(['Vierte la leche; en Grande y Venti, una línea por debajo de la correspondiente.','Airea de 1 a 3 segundos en EXTRA HOT (arriba de 77 °C / 170 °F).'],.9),shots([1,2,2]),
  {t:'Agrega salsa de mocha',q:[3,4,5],u:'pump',i:MOCHA,x:['Dosificador metal mocha espresso.']},
  {t:'Termina',x:['Mezcla el espresso y el mocha.','Llena con leche vaporizada hasta 12 mm por debajo del borde.',TAPA]},crema()]},
{n:'Mocha Blanco',g:'cal',s:'Con café',c:'MB',d:'Espresso con leche vaporizada y mocha blanco, con crema batida.',tapa:'hot',p:[
  vapor(['Vierte la leche; en Grande y Venti, una línea por debajo de la correspondiente.','Airea de 1 a 3 segundos en EXTRA HOT (arriba de 77 °C / 170 °F).'],.9),shots([1,2,2]),
  {t:'Agrega salsa de mocha blanco',q:[3,4,5],u:'pump',i:MBCO,x:['Dosificador metal mocha blanco.']},
  {t:'Termina',x:['Mezcla el espresso y el mocha blanco.','Llena con leche vaporizada hasta 12 mm por debajo del borde.',TAPA]},crema()]},
{n:'Té Caliente Teavana',g:'cal',s:'Con café',c:'T',d:'Surtido de tés de hoja entera.',tapa:'hot',p:[
  {t:'Incorpora las bolsitas',q:[1,1,2],u:'bolsita',x:['Abre el sobre y saca la bolsita con pinzas.','Deja la etiqueta dentro de la manga del vaso.','Se descuenta del té que se use (Chamomile, Hibiscus, Mint…).']},
  {t:'Termina',x:['Llena con agua caliente hasta 6 mm por debajo del borde.','Infusiona y retira: 3 min tés blancos y verdes; 5 min tés negros y herbales.','Coloca tapa, entrega con manga y conecta.']}]},
{n:'Chai Latte',g:'cal',s:'Sin café',c:'CHAI',d:'Concentrado de chai con agua caliente, leche vaporizada y espuma.',tapa:'hot',p:[
  vapor(['Alto: línea vaso corto. Grande y Venti: línea vaso alto.'],.5),
  {t:'Agrega concentrado de chai',q:[3,4,5],u:'pump',i:CHAI,x:['Dosificador metal chai.']},
  {t:'Termina',x:['Llena la mitad del vaso con agua caliente.','Llena el resto con leche vaporizada hasta 12 mm del borde y espuma hasta 6 mm.',TAPA]}]},
{n:'Chocolate',g:'cal',s:'Sin café',c:'CH',d:'Leche vaporizada con salsa de chocolate y vainilla, crema batida y mocha.',tapa:'hot',p:[
  vapor(['Vierte leche hasta la línea; en Grande y Venti, una línea por debajo.','Airea de 1 a 3 segundos.','Adulto: 66–77 °C. Niño: 54 °C.']),
  {t:'Agrega salsa de mocha',q:[3,4,5],u:'pump',i:MOCHA,x:['Dosificador metal espresso.']},
  {t:'Agrega jarabe de vainilla',q:[1,1,2],u:'pump',i:VAIN,x:['Pump plástico espresso.']},
  {t:'Termina',x:['Llena con leche vaporizada hasta 12 mm por debajo del borde.','Cubre con crema batida y 5 espirales de mocha.',TAPA]},crema()]},
{n:'Chocolate Blanco',g:'cal',s:'Sin café',c:'CHB',d:'Leche vaporizada con salsa de chocolate blanco y crema batida.',tapa:'hot',p:[
  vapor(['Vierte leche hasta la línea; en Grande y Venti, una línea por debajo.','Airea de 1 a 3 segundos.','Adulto: 66–77 °C. Niño: 54 °C.']),
  {t:'Agrega salsa de mocha blanco',q:[3,4,5],u:'pump',i:MBCO,x:['Dosificador metal espresso.']},
  {t:'Termina',x:['Llena con leche vaporizada hasta 12 mm por debajo del borde.',TAPA]},crema()]},
{n:'Chocolate Mexicano',g:'cal',s:'Sin café',c:'CHMX',d:'Chocolate con notas de canela y salsa de mocha.',tapa:'hot',p:[
  {t:'Agrega salsa de mocha',q:[1,1,2],u:'pump',i:MOCHA,x:['Directo en la jarra para vaporizar (dosificador metal espresso).']},
  {t:'Agrega chocolate mexicano en polvo',q:[3,4,5],u:'medida',i:114,x:['Medidas rasas, directo en la jarra.']},
  vapor(['Vierte leche hasta la línea de la jarra.','Vaporiza la leche, el mocha y el chocolate al mismo tiempo; airea de 1 a 3 segundos.']),
  {t:'Termina',x:['Llena hasta 6 mm por debajo del borde.',TAPA]}]},
{n:'Leche al Vapor',g:'cal',s:'Sin café',c:'LV',d:'Leche vaporizada con espuma aterciopelada.',tapa:'hot',p:[
  vapor(['Vierte leche hasta la línea de la jarra.','Airea de 1 a 3 segundos. Niño: 54 °C.']),
  {t:'Termina',x:['Llena con leche hasta 12 mm por debajo del borde y espuma hasta 6 mm.',TAPA]}]},
{n:'Matcha Green Tea Latte',g:'cal',s:'Sin café',c:'MATL',d:'Té verde matcha vaporizado con leche y jarabe clásico.',tapa:'hot',p:[
  vapor(['Vierte leche hasta la línea de la jarra vaporizadora.']),
  {t:'Agrega té matcha en polvo',q:[2,3,4],u:'medida',i:135,x:['Medidas rasas, directo en la jarra. Vaporiza leche y té juntos; airea de 1 a 3 segundos.']},
  {t:'Agrega jarabe clásico',q:[3,4,5],u:'pump',i:CLAS,x:['Pump plástico espresso.']},
  {t:'Termina',x:['Llena hasta 12 mm del borde y cubre con espuma hasta 6 mm.',TAPA]}]},

/* ---------------- BEBIDAS HELADAS ---------------- */
shaken('Avellana Shaken Espresso Helado','AV SE','Shots de espresso con jarabe de avellana, agitados y cubiertos con bebida de avena.',
  {t:'Agrega jarabe de avellana',q:[3,4,5],u:'pump',i:120,x:['Pump CBS.']}),
(r=>{r.p.splice(3,0,{t:'Agrega canela en polvo',q:[2,2,2],u:'toque',i:CANELA,x:['Espolvorea encima del hielo.']});return r})(
  shaken('Brown Sugar Shaken Espresso Helado','BS AV SE','Shots de espresso con jarabe Brown Sugar y canela, agitados y cubiertos con bebida de avena.',
  {t:'Agrega jarabe Brown Sugar',q:[3,4,5],u:'pump',i:121,x:['Pump plástico de CBS.']})),
{n:'Caramel Macchiato Helado',g:'hel',s:'Espresso',c:'CM',d:'Vainilla con leche y hielo, shot de espresso y rejilla de caramelo.',tapa:'nitro',p:[
  shots([1,2,2],'Pon en fila los shots'),
  {t:'Agrega jarabe de vainilla',q:[2,3,4],u:'pump',i:VAIN,x:['Pump plástico de espresso. Lleva un pump menos que las bebidas estándar.']},
  leche('lh',1,['Agrega leche fría hasta la línea superior del vaso.']),
  {t:'Agrega hielo y shots',x:['Agrega hielo hasta 12 mm por debajo del borde.','Vierte los shots sobre el hielo.']},
  {t:'Termina',i:CARS,x:['Cubre con caramelo: 7 y 7 líneas entrecruzadas y 2 círculos.',NITRO]}]},
{n:'Chocolate Cream Cold Brew',g:'hel',s:'Cold brew',c:'CHC CB',d:'Cold brew con vainilla y cold foam de vainilla sweet cream con chocolate.',tapa:'nitro',p:[
  {t:'Licua el cold foam',q:[100,100,100],u:'ml',x:['En la jarra de cold foam: vainilla sweet cream hasta la línea de 100 ml y 2 cucharadas de malta de chocolate en polvo (cuchara metálica Frap Chip, código 965).','Licua: botón n.º 3.','La sweet cream se prepara aparte (ver Vainilla Sweet Cream).']},
  {t:'Agrega jarabe de vainilla',q:[3,4,5],u:'pump',i:VAIN,x:['Pump CBS.']},
  {t:'Agrega cold brew',i:84,x:['Vierte el concentrado de cold brew hasta la línea inferior del vaso.']},
  {t:'Agrega agua',x:['Agrega agua hasta la línea superior del vaso.']},
  {t:'Termina',x:['Agrega hielo hasta 2 cm por debajo del borde.','Agrega el cold foam hasta 6 mm del borde (desde donde inicia la parte superior del logo).',NITRO]}]},
{n:'Cold Brew',g:'hel',s:'Cold brew',c:'CB',d:'Café infusionado en frío durante 20 horas.',tapa:'nitro',p:[
  {t:'Agrega jarabe clásico',q:[3,4,5],u:'pump',i:CLAS,x:['Pump plástico de CBS.']},
  {t:'Agrega cold brew',i:84,x:['Vierte el concentrado de cold brew hasta la línea inferior del vaso.']},
  {t:'Agrega agua',x:['Agrega agua hasta la línea superior del vaso.']},
  {t:'Termina',x:['Agrega hielo hasta 6 mm por debajo del borde.',NITRO]}]},
{n:'Vainilla Sweet Cream Cold Brew',g:'hel',s:'Cold brew',c:'VSC CB',d:'Cold brew con un toque de vainilla y sweet cream.',tapa:'nitro',p:[
  {t:'Agrega jarabe de vainilla',q:[1,2,2],u:'pump',i:VAIN,x:['Pump plástico de espresso.']},
  {t:'Agrega cold brew',i:84,x:['Vierte el concentrado de cold brew hasta la línea inferior del vaso.']},
  {t:'Agrega agua',x:['Agrega agua hasta la línea superior del vaso.']},
  {t:'Termina',x:['Agrega hielo hasta 12 mm por debajo del borde.','Agrega sweet cream hasta 6 mm por debajo del borde.',NITRO]}]},
{n:'Cold Foam Cappuccino Helado',g:'hel',s:'Espresso',c:'CFC',d:'Cappuccino helado con espuma de leche fría.',tapa:'nitro',p:[
  {t:'Licua el cold foam',q:[100,100,100],u:'ml',i:LIGHT,x:['En la jarra de cold foam: leche light fría hasta la línea de 100 ml.','Licua: botón n.º 3.','Con otra leche la consistencia puede variar.']},
  shots([1,2,2],'Pon en fila los shots'),
  {t:'Agrega hielo al vaso',x:['Llena con hielo hasta 2 cm por debajo del borde.','Vierte los shots sobre el hielo.']},
  leche('lh',1,['Llena con leche fría por arriba de la línea superior del vaso.']),
  {t:'Termina',x:['Cubre con cold foam hasta el borde (desde donde inicia la parte superior del logo).',NITRO]}]},
{n:'Espresso Americano Helado',g:'hel',s:'Espresso',c:'EA',d:'Shots de espresso con agua y hielo.',tapa:'nitro',p:[
  shots([2,3,4],'Pon en fila los shots'),
  {t:'Agrega agua',x:['Agrega agua fría hasta la línea superior del vaso.','Para "poca agua", hasta la línea inferior o intermedia.']},
  {t:'Termina',x:['Llena con hielo hasta 6 mm por debajo del borde.',NITRO]}]},
{n:'Latte Helado',g:'hel',s:'Espresso',c:'L',d:'Espresso con leche y hielo.',tapa:'nitro',p:[
  shots([1,2,2],'Agrega shots de espresso'),
  {t:'Agrega jarabe saborizante',q:[3,4,5],u:'pump',o:1,x:['Solo si el cliente lo solicita (pump plástico espresso).']},
  leche('lh',1,['Agrega leche fría a la línea superior del vaso.']),
  {t:'Termina',x:['Llena con hielo hasta 6 mm por debajo del borde.',NITRO]}]},
{n:'Latte Macchiato Helado',g:'hel',s:'Espresso',c:'LM',d:'Leche con extra shot de espresso y hielo.',tapa:'nitro',p:[
  shots([2,3,3]),{t:'Prepara los shots',x:['Vierte los shots en una jarra de 148 ml.']},
  leche('lh',1,['Agrega leche fría a la línea superior del vaso.']),
  {t:'Termina',x:['Llena con hielo hasta 1 cm por debajo del borde.','Vierte lentamente los shots sobre la parte central del vaso.',NITRO]}]},
{n:'Mocha Blanco Helado',g:'hel',s:'Espresso',c:'MB',d:'Chocolate blanco, espresso, hielo y leche, con crema batida.',tapa:'domo',p:[
  shots([1,2,2]),{t:'Agrega salsa de mocha blanco',q:[3,4,5],u:'pump',i:MBCO,x:['Dosificador metal mocha blanco.']},
  leche('lh',1,['Mezcla el espresso con la salsa.','Agrega leche fría a la línea superior del vaso.']),
  {t:'Termina',x:['Llena con hielo hasta 1 cm por debajo del borde.','Cubre con tapa domo, entrega con popote y conecta.']},crema('Agrega crema batida.')]},
shaken('Mocha Blanco Shaken Espresso Helado','MB AV SE','Shots de espresso con salsa de mocha blanco, agitados y cubiertos con bebida de avena.',
  {t:'Agrega salsa de mocha blanco',q:[3,4,5],u:'pump',i:MBCO,x:['Pump CBS.']}),
{n:'Mocha Helado',g:'hel',s:'Espresso',c:'M',d:'Chocolate, espresso, hielo y leche, con crema batida.',tapa:'domo',p:[
  shots([1,2,2]),{t:'Agrega salsa de mocha',q:[3,4,5],u:'pump',i:MOCHA,x:['Dosificador de metal espresso.']},
  leche('lh',1,['Mezcla el espresso con la salsa de mocha.','Agrega leche fría a la línea superior del vaso.']),
  {t:'Termina',x:['Llena con hielo hasta 1 cm por debajo del borde.','Cubre con tapa domo, entrega con popote y conecta.']},crema('Agrega crema batida.')]},
shaken('Mocha Shaken Espresso Helado','M AV SE','Shots de espresso con salsa de mocha, agitados y cubiertos con bebida de avena.',
  {t:'Agrega salsa de mocha',q:[1,2,2],u:'pump',i:MOCHA,x:['Dosificador de metal espresso.']}),
{n:'Chai Latte Helado',g:'hel',s:'Sin café',c:'CHAI',d:'Concentrado de chai con leche, servido sobre hielo.',tapa:'nitro',p:[
  {t:'Agrega concentrado de chai',q:[3,4,5],u:'pump',i:CHAI,x:['Dosificador metal chai.']},
  leche('lh',1,['Agrega leche fría hasta la línea superior del vaso.','En el chai latte helado no se agrega agua.']),
  {t:'Termina',x:['Llena con hielo hasta 6 mm por debajo del borde.',NITRO]}]},
{n:'Chocolate Helado',g:'hel',s:'Sin café',c:'CH',d:'Chocolate con leche fría, hielo y salsa de chocolate.',tapa:'nitro',p:[
  {t:'Agrega salsa de mocha',q:[3,4,5],u:'pump',i:MOCHA,x:['Surtidor de metal espresso.']},
  {t:'Agrega jarabe de vainilla',q:[1,1,2],u:'pump',i:VAIN,x:['Pump plástico de espresso.']},
  leche('lh',1,['Agrega leche fría hasta la línea superior del vaso y revuelve.']),
  {t:'Termina',x:['Agrega hielo hasta 1 cm por debajo del borde.',NITRO]}]},
{n:'Chocolate Mexicano Helado',g:'hel',s:'Sin café',c:'CHMX',d:'Dos chocolates incorporados con leche y hielo.',tapa:'nitro',p:[
  leche('lh',1,['Vierte la leche hasta la última línea del vaso helado.','Vacía el contenido en el shaker.']),
  {t:'Agrega salsa de mocha',q:[2,2,4],u:'pump',i:MOCHA,x:['Surtidor de metal CBS.']},
  {t:'Agrega chocolate mexicano en polvo',q:[3,4,5],u:'medida',i:114,x:['Medidas rasas.']},
  {t:'Termina',x:['Agrega hielo hasta 1 cm por debajo del borde.',NITRO]}]},
{n:'Matcha Green Tea Helado',g:'hel',s:'Sin café',c:'MATL',d:'Matcha con jarabe clásico, agua y hielo, cubierto con leche.',tapa:'nitro',p:[
  {t:'Agrega agua al shaker',x:['En todos los tamaños, hasta la línea para té del vaso alto.']},
  {t:'Agrega jarabe clásico',q:[3,4,5],u:'pump',i:CLAS,x:['Pump plástico de CBS.']},
  {t:'Agrega té matcha en polvo',q:[2,3,4],u:'medida',i:135,x:['Medidas rasas.']},
  {t:'Agrega hielo, agita y vierte',x:['Llena hasta la línea para el hielo, tapa el shaker y agita 10 veces.']},
  leche('lh',.5,['Llena el vaso con leche hasta 6 mm por debajo del borde.',NITRO])]},
{n:'Matcha Lemonade Helado',g:'hel',s:'Refreshers y tés',c:'MATLE',d:'Matcha con limonada, ligeramente endulzado, sobre hielo.',tapa:'nitro',p:[
  {t:'Agrega agua al shaker',x:['Hasta el número 1 de la línea naranja, según el tamaño.']},
  {t:'Agrega limonada',i:LIMON,x:['Hasta el número 3 de la línea naranja, según el tamaño.']},
  {t:'Agrega jarabe clásico',q:[2,3,4],u:'pump',i:CLAS,x:['Pump plástico de CBS.']},
  {t:'Agrega té matcha en polvo',q:[2,3,4],u:'medida',i:135,x:['Medidas rasas.']},
  {t:'Termina',x:['Llena hasta la línea para el hielo, tapa el shaker y agita 10 veces.',NITRO]}]},
refresher('Dragon Drink Refresher','DD','Extracto de café verde con concentrado de frutas, dragon fruit y leche de coco.','Mango Dragon Fruit',112,'leche de coco',COCO,'dragon fruit',119),
refresher('Mango Dragon Lemonade Refresher','MDLR','Extracto de café verde con concentrado de frutas, dragon fruit y limonada.','Mango Dragon Fruit',112,'limonada',LIMON,'dragon fruit',119),
refresher('Mango Dragon Refresher','MDR','Extracto de café verde con concentrado de frutas, dragon fruit y agua.','Mango Dragon Fruit',112,'agua',null,'dragon fruit',119),
refresher('Pink Drink Refresher','PD','Extracto de café verde con concentrado de fresa y acaí, inclusiones de fresa y leche de coco.','Strawberry Acaí',144,'leche de coco',COCO,'fresa',93),
refresher('Strawberry Acaí Lemonade Refresher','SALR','Extracto de café verde con concentrado de fresa y acaí, inclusiones de fresa y limonada.','Strawberry Acaí',144,'limonada',LIMON,'fresa',93),
refresher('Strawberry Acaí Refresher','SAR','Extracto de café verde con concentrado de fresa y acaí, inclusiones de fresa y agua fría.','Strawberry Acaí',144,'agua fría',null,'fresa',93),
lemonTea('Shaken Lemon Black Tea','SHLBT','negro',99),
lemonTea('Shaken Lemon Green Tea','SHLGT','verde',100),
lemonTea('Shaken Lemon Hibiscus Tea','SHLHT','hibiscus',101),
{n:'Té Helado Teavana',g:'hel',s:'Refreshers y tés',c:'T',d:'Té de hoja entera a elección, servido sobre hielo.',tapa:'nitro',p:[
  {t:'Incorpora las bolsitas en una taza',q:[1,1,2],u:'bolsita',x:['Pon el té en una taza del tamaño adecuado y llénala a la mitad con agua caliente.','Infusiona y retira: 3 min tés blancos y verdes; 5 min tés negros o herbales.','Se descuenta del té que se use.']},
  {t:'Agrega jarabe clásico',q:[2,3,4],u:'pump',i:CLAS,x:['Pump plástico de CBS.']},
  {t:'Termina',x:['Llena el vaso con hielo.','Vierte el té caliente filtrado sobre el hielo y el jarabe.',NITRO]}]},

/* ---------------- FRAPPUCCINOS ---------------- */
{n:'Café Frappuccino',g:'fra',s:'Base coffee',c:'CF',d:'Café con leche y hielo, una de las bebidas Frappuccino más originales.',tapa:'plana',p:[
  FRR,FRL,FRV,FRH,BC,FRM,{t:'Termina',x:['Vierte hasta 6 mm por debajo del borde.','Coloca tapa plana, entrega con popote y conecta.']}]},
{n:'Cajeta Frappuccino',g:'fra',s:'Base coffee',d:'Salsa de cajeta con leche y hielo, crema batida y caramelo.',tapa:'domo',p:[
  Object.assign({},FRR,{x:['Dosificador metal Frappuccino Roast.','Omite este paso para la versión Cream.']}),FRL,FRV,
  {t:'Agrega salsa de cajeta',q:[1,2,2],u:'pump',i:141,x:['Dosificador metal espresso.']},FRH,
  Object.assign({},BC,{t:'Agrega base coffee (o cream) para Frappuccino'}),FRM,
  {t:'Termina',i:CARS,x:[FIN1,'Cubre con crema batida y 5 vueltas de espiral de caramelo.',DOMO]},crema()]},
{n:'Caramel Frappuccino',g:'fra',s:'Base coffee',d:'Café con leche, endulzado con caramelo, crema batida y caramelo.',tapa:'domo',p:[
  FRR,FRL,FRV,{t:'Agrega jarabe de caramelo',q:[2,3,4],u:'pump',i:122,x:['Pump plástico de CBS.']},FRH,BC,FRM,
  {t:'Termina',i:CARS,x:[FIN1,'Cubre con crema batida y 5 vueltas de espiral de caramelo.',DOMO]},crema()]},
{n:'Cinnamon Dolce Frappuccino',g:'fra',s:'Base coffee',d:'Café, leche y jarabe cinnamon dolce con hielo, crema batida y canela.',tapa:'domo',p:[
  FRR,FRL,FRV,{t:'Agrega jarabe Cinnamon Dolce',q:[1,2,2],u:'pump',i:123,x:['Dosificador plástico.']},FRH,BC,FRM,
  {t:'Termina',x:[FIN1,DOMO]},crema(),
  {t:'Canela en polvo',q:[2,2,2],u:'toque',i:CANELA,x:['Espolvorea 2 veces el salero de canela sobre la crema batida.']}]},
{n:'Espresso Frappuccino',g:'fra',s:'Base coffee',d:'Leche y hielo con shot de espresso para más intensidad.',tapa:'domo',p:[
  FRR,shots([1,1,1],'Agrega shots de espresso'),FRL,FRV,FRH,BC,FRM,{t:'Termina',x:['Vierte hasta 6 mm por debajo del borde.',DOMO]}]},
{n:'Frappuccino Chip',g:'fra',s:'Base coffee',d:'Café, leche, chips de chocolate y mocha con hielo, crema batida y mocha.',tapa:'domo',p:[
  FRR,FRL,FRV,{t:'Agrega salsa de mocha',q:[2,3,4],u:'pump',i:MOCHA,x:['Dosificador metal mocha CBS.']},
  {t:'Agrega Frappuccino chips',q:[2,3,4],u:'scoop',i:115},FRH,BC,FRM,
  {t:'Termina',x:[FIN1,'Cubre con crema batida y 5 vueltas de espiral de mocha.',DOMO]},crema()]},
{n:'Mocha Blanco Frappuccino',g:'fra',s:'Base coffee',d:'Café, leche y chocolate blanco con hielo y crema batida.',tapa:'domo',p:[
  FRR,FRL,FRV,{t:'Agrega salsa de mocha blanco',q:[1,2,2],u:'pump',i:MBCO,x:['Dosificador metal mocha blanco.']},FRH,BC,FRM,
  {t:'Termina',x:[FIN1,DOMO]},crema()]},
{n:'Mocha Frappuccino',g:'fra',s:'Base coffee',d:'Café, leche y mocha con hielo y crema batida.',tapa:'domo',p:[
  FRR,FRL,FRV,{t:'Agrega salsa de mocha',q:[1,2,2],u:'pump',i:MOCHA,x:['Dosificador metal mocha.']},FRH,BC,FRM,
  {t:'Termina',x:[FIN1,DOMO]},crema()]},
{n:'Berry Yogurt Frappuccino',g:'fra',s:'Base cream',d:'Yogurt natural con salsa de moras y hielo.',tapa:'plana',p:[
  {t:'Vierte el yogurt',i:265,x:['Vierte hasta la línea inferior del vaso.']},
  {t:'Vierte el concentrado de berry',i:117,x:['Vierte el concentrado hasta la segunda línea.']},
  FRV,FRH,BR,FRM,{t:'Termina',x:['Vierte el contenido en el vaso.','Coloca tapa plana, entrega con popote y conecta.']}]},
{n:'Chai Cream Frappuccino',g:'fra',s:'Base cream',d:'Concentrado de chai con leche y hielo, crema batida y canela.',tapa:'domo',p:[
  FRL,FRV,{t:'Agrega concentrado de chai',q:[1,2,2],u:'pump',i:CHAI,x:['Dosificador metal chai.']},FRH,BR,FRM,
  {t:'Termina',x:[DOMO]},crema(),
  {t:'Canela en polvo',q:[2,2,2],u:'toque',i:CANELA,x:['Espolvorea 2 veces el salero de canela sobre la crema batida.']}]},
{n:'Chocolate Blanco Cream Frappuccino',g:'fra',s:'Base cream',d:'Base de leche con salsa de chocolate blanco, hielo y crema batida.',tapa:'domo',p:[
  FRL,FRV,{t:'Agrega salsa de mocha blanco',q:[1,2,3],u:'pump',i:MBCO,x:['Dosificador metal mocha blanco.']},FRH,BR,FRM,
  {t:'Termina',x:[FIN1,DOMO]},crema()]},
{n:'Chocolate Cream Frappuccino',g:'fra',s:'Base cream',d:'Base de leche con chocolate y hielo, crema batida y espiral de mocha.',tapa:'domo',p:[
  FRL,FRV,{t:'Agrega salsa de mocha',q:[2,3,4],u:'pump',i:MOCHA,x:['Dosificador metal mocha CBS.']},FRH,BR,FRM,
  {t:'Termina',x:[FIN1,'Agrega crema batida y 5 espirales de mocha.',DOMO]},crema()]},
{n:'Chocolate Mexicano Frappuccino',g:'fra',s:'Base cream',d:'Base de leche con dos chocolates, molido con hielo.',tapa:'domo',p:[
  FRL,FRV,{t:'Agrega salsa de mocha',q:[2,3,4],u:'pump',i:MOCHA,x:['Dosificador metal mocha CBS.']},
  {t:'Agrega chocolate mexicano en polvo',q:[3,4,5],u:'medida',i:114,x:['Medidas rasas.']},FRH,BR,FRM,
  {t:'Termina',x:[FIN1,DOMO]}]},
{n:'Cookies & Cream Frappuccino',g:'fra',s:'Base cream',d:'Base de leche con chocolate blanco y chips, crema batida y galleta.',tapa:'domo',p:[
  FRL,FRV,{t:'Agrega salsa de mocha blanco',q:[1,2,2],u:'pump',i:MBCO,x:['Dosificador metal mocha blanco.']},
  {t:'Agrega Frappuccino chips',q:[2,3,4],u:'scoop',i:115},FRH,BR,FRM,
  {t:'Termina',x:[FIN1,DOMO]},crema(),{t:'Galleta',q:[2,2,2],u:'scoop',i:94,x:['Agrega 2 scoops de galleta sobre la crema batida.']}]},
{n:'Fresa Cream Frappuccino',g:'fra',s:'Base cream',d:'Base de leche con fresa, molido con hielo y crema batida.',tapa:'domo',p:[
  FRL,{t:'Vierte la salsa de fresa',i:FRESA,x:['Vierte la salsa hasta la segunda línea.']},FRV,FRH,BR,FRM,
  {t:'Termina',x:[FIN1,DOMO]},crema()]},
{n:'Matcha Green Tea Cream Frappuccino',g:'fra',s:'Base cream',d:'Base de leche con té matcha, un toque dulce y hielo.',tapa:'domo',p:[
  FRL,FRV,{t:'Agrega jarabe clásico',q:[1,2,2],u:'pump',i:CLAS,x:['Dosificador plástico CBS.']},
  {t:'Agrega té verde matcha en polvo',q:[2,3,4],u:'medida',i:135,x:['Medidas rasas.']},FRH,BR,FRM,
  {t:'Termina',x:[DOMO]},crema()]},
{n:'Piñacoco Yogurt Frappuccino',g:'fra',s:'Base cream',d:'Yogurt natural con salsa de piñacoco y hielo.',tapa:'plana',p:[
  {t:'Vierte el yogurt',i:265,x:['Vierte hasta la línea inferior del vaso.']},
  {t:'Vierte el concentrado de piñacoco',i:116,x:['Vierte el concentrado hasta la segunda línea.']},
  FRV,FRH,BR,FRM,{t:'Termina',x:['Vierte el contenido en el vaso.','Coloca tapa plana, entrega con popote y conecta.']}]},
{n:'Vainilla Cream Frappuccino',g:'fra',s:'Base cream',d:'Base de leche con jarabe de vainilla, hielo y crema batida.',tapa:'domo',p:[
  FRL,FRV,{t:'Agrega jarabe de vainilla',q:[2,3,4],u:'pump',i:VAIN,x:['Dosificador plástico CBS.']},FRH,BR,FRM,
  {t:'Termina',x:[FIN1,DOMO]},crema()]},
frozenLem('Dragon Fruit Frozen Lemonade','dragon fruit',119,'Limonada con inclusiones de dragon fruit y hielo, sobre salsa de fresa.'),
frozenRef('Mango Dragon Fruit Frozen Refresher','Mango Dragon Fruit',112,'dragon fruit',119,'Jugo de mango y fruta del dragón con extracto de café verde y limonada.'),
frozenRef('Strawberry Acaí Frozen Refresher','Strawberry Acaí',144,'fresa',93,'Jugo de fresa y acaí con extracto de café verde, limonada y hielo.'),
frozenLem('Strawberry Frozen Lemonade','fresa',93,'Limonada con inclusiones de fresa y hielo, sobre salsa de fresa.'),

/* ---------------- PREPARACIONES ---------------- */
{n:'Vainilla Sweet Cream',g:'prep',s:'Preparaciones',c:'VSC',d:'Crema dulce de vainilla para las bebidas de cold brew. Vida útil 24 h, refrigerada de 0 a 7 °C.',
 z:['Bajo (5 oz)','Medio (11 oz)','Alto (18 oz)'],p:[
  {t:'Agrega jarabe de vainilla',q:[4,8,13],u:'pump',i:VAIN,x:['Pump plástico de espresso.','Bajo: en vaso helado alto. Medio y Alto: en jarra de espresso.']},
  {t:'Agrega crema para batir',i:CREMA,x:['Bajo: hasta la línea inferior del vaso. Medio: hasta la línea GRANDE. Alto: hasta la línea MAX.']},
  {t:'Agrega leche light',i:LIGHT,x:['Bajo: hasta la línea media del vaso. Medio: hasta la línea SHORT. Alto: hasta la línea ALTO.']},
  {t:'Termina',x:['Vierte en una jarra de plástico y revuelve bien.','Identifica la jarra y coloca day card con vida útil de 24 h.','Mantén siempre refrigerada (0 a 7 °C).']}]}
];

/* Vaso y tapa por tamaño (ids del catálogo). Se suman solos a cada bebida. */
window.RECETAS_VASOS={
  cal:{n:'Vaso de papel',i:[202,203,204]}, fria:{n:'Vaso de plástico',i:[206,207,208]},
  short:{n:'Vaso de papel 8 oz',i:[205,205]}, espresso:{n:'Vaso',i:[223,205]}
};
window.RECETAS_TAPAS={
  hot:{n:'Tapa hot',i:[194,194,194]}, short:{n:'Tapa 8 oz hot',i:[195,195]}, espresso:{n:'Tapa 8 oz hot',i:[null,195]},
  nitro:{n:'Tapa nitro',i:[198,199,198]}, domo:{n:'Tapa domo',i:[196,197,196]}, plana:{n:'Tapa plana',i:[200,201,200]}
};
/* Leche por tamaño (ml), estimada. La tienda la ajusta en la app midiendo cada línea con una probeta. */
window.RECETAS_LECHE={
  lc:{n:'Caliente (vaporizada)',v:[250,330,420]},
  lh:{n:'Helada (línea superior)',v:[150,210,270]},
  lf:{n:'Frappuccino (línea inferior)',v:[90,120,160]}
};
})();

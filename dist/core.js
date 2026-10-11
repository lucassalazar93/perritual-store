'use strict';
const Catalog=[
{id:'torta',name:'Torta Mi Gran Día',category:'Tortas',price:65000,tag:'SU NOMBRE, SU TORTA',desc:'Una torta con su nombre y todos tus buenos deseos.',detail:'El centro de su celebración. Elige los detalles y descubre una vista previa ilustrativa.',bg:'#eedbc6',type:'cake',custom:true},
{id:'kit',name:'Kit Cumpleaños Feliz',category:'Kits',price:99000,old:110000,tag:'LA CELEBRACIÓN COMPLETA',desc:'Torta + galletas + gorrito. Felicidad en una caja.',detail:'Incluye una torta pequeña personalizada, seis galletas y un gorrito. Puedes añadir un juguete para completar su regalo.',bg:'#e9c5af',type:'kit',custom:true},
{id:'cupcakes',name:'Cupcakes de Cariño',category:'Cupcakes',price:32000,tag:'CUATRO PEQUEÑAS ALEGRÍAS',desc:'Una cajita de 4 para compartir el momento.',detail:'Cuatro cupcakes de celebración con decoración a elección. Sabores de demostración, sujetos a validación de la receta.',bg:'#e2e4d2',type:'cupcake',custom:true},
{id:'galletas',name:'Galletas Huellitas',category:'Galletas',price:18000,tag:'EL DETALLE PERFECTO',desc:'6 pequeños bocados para un gran día.',detail:'Un paquete conceptual de seis galletas en forma de huesito. La receta y las porciones se definirán antes del lanzamiento.',bg:'#ecdcc1',type:'biscuit',custom:false},
{id:'juguete',name:'Su Nuevo Cómplice',category:'Juguetes',price:25000,tag:'QUE SIGA EL JUEGO',desc:'Un huesito de tela para acompañar su regalo.',detail:'Juguete ilustrativo de tela. Materiales, dimensiones y recomendaciones de uso pendientes de confirmar con el proveedor.',bg:'#d8dfd1',type:'toy',custom:false},
{id:'regalo',name:'Caja Un Mimo Más',category:'Regalos',price:45000,tag:'PORQUE SÍ TAMBIÉN SE CELEBRA',desc:'Galletas, juguete y una dedicatoria especial.',detail:'Una caja de regalo conceptual con seis galletas, un juguete y tu mensaje. No necesitas esperar a su cumpleaños.',bg:'#e6cfbf',type:'gift',custom:true}
];
const Money=n=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const Regions={Medellín:10000,Envigado:12000,Itagüí:12000,Sabaneta:14000,Bello:14000,'La Estrella':16000,Caldas:18000,Copacabana:18000,Girardota:20000,Barbosa:22000};
const Rules={
unit(item){const p=Catalog.find(p=>p.id===item.id);return p.price+(['torta','kit'].includes(item.id)?({Pequeña:0,Mediana:18000,Grande:32000}[item.options.size]||0):0)+(item.options.toy?25000:0)+(item.options.decoration==='Flores'?5000:0)},
totals(cart,delivery){const subtotal=cart.reduce((s,i)=>s+this.unit(i)*i.qty,0);const discount=subtotal>=150000?Math.round(subtotal*.1):0;const net=subtotal-discount;const shipping=!delivery?null:delivery.mode==='pickup'?0:net>=180000?0:(Regions[delivery.city]??null);return{subtotal,discount,net,shipping,total:net+(shipping||0),toFree:Math.max(0,180000-net),toAddForFree:Math.max(0,Math.ceil(180000/.9)-subtotal)}} ,
recommendations(cart){
 if(!cart.length||this.totals(cart).toFree===0)return [];
 const anchor=cart.find(i=>i.options.name&&Catalog.find(p=>p.id===i.id)?.custom);
 const copied=anchor?{name:anchor.options.name,age:anchor.options.age||'1',size:'Pequeña',flavor:anchor.options.flavor||'Pollo y zanahoria',color:anchor.options.color||'Durazno',decoration:'Huesitos',message:'',toy:false}:null;
 const hasToy=cart.some(i=>i.id==='juguete'||i.id==='regalo'||i.options.toy);
 const candidates=[{id:'galletas',options:{}},{id:'juguete',options:{}},...(copied?[{id:'cupcakes',options:copied}]:[])];
 const combos=[];
 const explore=(index,lines)=>{
  if(index===candidates.length){
   const units=lines.reduce((n,i)=>n+i.qty,0);if(!units||units>3)return;
   if(lines.some(l=>cart.filter(i=>i.id===l.id).reduce((n,i)=>n+i.qty,0)+l.qty>20)||cart.length+lines.length>40)return;
   const added=lines.reduce((n,i)=>n+this.unit(i)*i.qty,0),after=this.totals([...cart,...lines]);
   const repeats=lines.reduce((n,l)=>n+Math.max(0,l.qty-1),0);
   const score=added+(hasToy&&lines.some(l=>l.id==='juguete')?10000:0)+repeats*1000;
   combos.push({lines:lines.map(l=>({...l,options:{...l.options}})),added,after,unlocks:after.toFree===0,score});return;
  }
  explore(index+1,lines);
  for(let qty=1;qty<=2;qty++)explore(index+1,[...lines,{...candidates[index],qty}]);
 };
 explore(0,[]);
 const winners=combos.filter(c=>c.unlocks).sort((a,b)=>a.score-b.score||a.added-b.added);
 if(winners.length)return winners.slice(0,2);
 return combos.filter(c=>c.lines.length===1&&c.lines[0].qty===1).sort((a,b)=>a.score-b.score).slice(0,2);
},
validSlot(date,time,now=Date.now()){const t=new Date(date+'T'+time+':00-05:00').getTime();return Number.isFinite(t)&&t>=now+86400000},
minDate(now=Date.now()){return new Date(now+86400000-5*3600000).toISOString().slice(0,10)}
};
if(typeof module!=='undefined')module.exports={Catalog,Money,Regions,Rules};

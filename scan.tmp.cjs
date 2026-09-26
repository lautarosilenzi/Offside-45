const fs=require('fs');
for (const y of process.argv.slice(2)) {
  const f=`lib/data/seasons/generated/${y}.json`; if(!fs.existsSync(f)){console.log(y,'(sin archivo)');continue;}
  const s=JSON.parse(fs.readFileSync(f,'utf8'));
  const c={};for(const m of s.matches){const k=`${m.phase}|${m.status||''}|${(m.stage||'').replace(/ · Fecha \d+| \d+$|Fecha \d+/,'·F')}`;c[k]=(c[k]||0)+1;}
  const played={};for(const m of s.matches.filter(m=>m.phase==='league'&&m.status!=='annulled'))for(const t of [m.homeId,m.awayId])played[t]=(played[t]||0)+1;
  const pj=[...new Set(Object.values(played))].join('/');
  console.log(`${y}: ${s.matches.length} partidos · PJ por equipo en la fase de liga: ${pj} ·`, JSON.stringify(c));
  for(const m of s.matches.filter(m=>m.status||m.awardedTo||m.walkover||/Suspend|Empez|penales/.test(m.note||''))) console.log('   ',m.date,m.stage,m.homeId,m.homeGoals+'-'+m.awayGoals,m.awayId,m.status||'',m.awardedTo?'→'+m.awardedTo:'',(m.note||'').slice(0,110));
}

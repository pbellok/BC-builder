import React, { useState, useMemo } from 'react';

const f4 = (n) => Number(Number(n || 0).toFixed(4));

// Reverted to explicitly display 2 decimals at all times
const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
});

const gid = (p) => `${p}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

const Num = ({ value, onChange, w = '100%', step = 1, disabled = false }) => (
  <div style={{ display: 'flex', width: w, flexShrink: 0, border: '1px solid #cbd5e1', borderRadius: '3px', backgroundColor: disabled ? '#f1f5f9' : '#fff', overflow: 'hidden', opacity: disabled ? 0.45 : 1 }}>
    <input
      type="number"
      value={value}
      disabled={disabled}
      onChange={onChange}
      className="hide-arrows"
      style={{ width: '100%', minWidth: 0, border: 'none', outline: 'none', padding: '4px 6px', textAlign: 'right', background: 'transparent', color: '#0f172a', fontSize: '0.82em' }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' }}>
      <button
        type="button"
        tabIndex="-1"
        onClick={() => !disabled && onChange({ target: { value: Number(value) + step } })}
        style={{ border: 'none', background: '#f8fafc', cursor: 'pointer', fontSize: '7px', padding: '0 4px', color: '#64748b', flex: 1 }}
      >
        ▲
      </button>
      <button
        type="button"
        tabIndex="-1"
        onClick={() => !disabled && onChange({ target: { value: Math.max(0, Number(value) - step) } })}
        style={{ border: 'none', borderTop: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '7px', padding: '0 4px', color: '#64748b', flex: 1 }}
      >
        ▼
      </button>
    </div>
  </div>
);

const PLANTS = [
  { code: 'MEC', description: 'Impianto meccanico' },
  { code: 'IDR', description: 'Idraulica' },
  { code: 'ELE', description: 'Impianto elettrico' },
  { code: 'FTV', description: 'Impianto fotovoltaico' },
  { code: 'EDI', description: 'Edilizia' },
  { code: 'GLO', description: 'Global' }
];

const ACTIVITIES = [
  { code: 'S-001', description: 'Rilievi' },
  { code: 'S-002', description: 'Consulenza ingegneristica' },
  { code: 'S-003', description: 'Consulenza ingegneristica VVF' },
  { code: 'S-004', description: 'Studio di fattibilita\' meccanico' },
  { code: 'S-005', description: 'Studio di fattibilita\' elettrico' },
  { code: 'S-006', description: 'Studio di fattibilita\' edile' },
  { code: 'S-007', description: 'Studio di fattibilita\' idraulico' },
  { code: 'S-008', description: 'Studio di fattibilita\' VVF' },
  { code: 'S-009', description: 'PFTE meccanico' },
  { code: 'S-010', description: 'PFTE elettrico' },
  { code: 'S-011', description: 'PFTE edile' },
  { code: 'S-012', description: 'PFTE idraulico' },
  { code: 'S-013', description: 'Progettazione esecutivo meccanico' },
  { code: 'S-014', description: 'Progettazione esecutivo elettrico' },
  { code: 'S-015', description: 'Progettazione esecutivo edile' },
  { code: 'S-016', description: 'Progettazione esecutivo idraulico' },
  { code: 'S-017', description: 'Progettazione as built meccanico' },
  { code: 'S-018', description: 'Progettazione as built elettrico' },
  { code: 'S-019', description: 'Progettazione as built edile' },
  { code: 'S-020', description: 'Progettazione as built idraulico' },
  { code: 'S-021', description: 'Direzione lavori meccanico' },
  { code: 'S-022', description: 'Direzione lavori elettrico' },
  { code: 'S-023', description: 'Direzione lavori edile' },
  { code: 'S-024', description: 'Direzione lavori idraulico' },
  { code: 'S-025', description: 'Direzione lavori VVF' },
  { code: 'S-026', description: 'Direzione lavori GENERALE' },
  { code: 'S-027', description: 'Assistenza al collaudo meccanico' },
  { code: 'S-028', description: 'Assistenza al collaudo elettrico' },
  { code: 'S-029', description: 'Assistenza al collaudo edile' },
  { code: 'S-030', description: 'Assistenza al collaudo idraulico' },
  { code: 'S-031', description: 'Collaudo tecnico amministrativo' },
  { code: 'S-032', description: 'Valutazione progetto VVF' },
  { code: 'S-033', description: 'Requisiti acustici passivi' },
  { code: 'S-034', description: 'Clima acustico' },
  { code: 'S-035', description: 'Diagnosi energetica' },
  { code: 'S-036', description: 'Accesso agli atti VVF' },
  { code: 'S-037', description: 'Valutazione rischio VVF' },
  { code: 'S-038', description: 'Piani evacuazione VVF' },
  { code: 'S-039', description: 'CSP' },
  { code: 'S-040', description: 'CSE' },
  { code: 'S-041', description: 'Relazione invarianza idraulica' },
  { code: 'S-042', description: 'Studio fattibilita\' strutture' },
  { code: 'S-043', description: 'PFTE strutture' },
  { code: 'S-044', description: 'Progettazione esecutivo strutture' },
  { code: 'S-045', description: 'As built strutture' },
  { code: 'S-046', description: 'Direzione lavori strutture' },
  { code: 'S-047', description: 'Collaudo strutture' },
  { code: 'S-048', description: 'Responsabile lavori' },
  { code: 'P-001', description: 'SCIA VVF' },
  { code: 'P-002', description: 'Cert rei - dich. prod' },
  { code: 'P-003', description: 'Pratica inail' },
  { code: 'P-004', description: 'Attestato di rinnovo periodico VVF' },
  { code: 'P-005', description: 'Pratica detrazione fiscale' },
  { code: 'P-006', description: 'Pratica conto termico' },
  { code: 'P-007', description: 'Pratica incentivi diversi' },
  { code: 'P-008', description: 'Legge 10 PFTE' },
  { code: 'P-009', description: 'Legge 10 in corso d\'opera' },
  { code: 'P-010', description: 'Legge 10 as built' },
  { code: 'P-011', description: 'APE convenzionale' },
  { code: 'P-012', description: 'APE' },
  { code: 'P-013', description: 'Pratica Paesaggistica' },
  { code: 'P-014', description: 'Pratica comunale' },
  { code: 'P-015', description: 'Pratica autorizzativa' },
  { code: 'P-016', description: 'Relazione geologica - geotecnica' },
  { code: 'G-001', description: 'Consulenza tecnica (no cassa)' },
  { code: 'T-001', description: 'Attribuzione codice ditta' },
  { code: 'T-002', description: 'Pratica officina elettrica' },
  { code: 'T-003', description: 'Pratica attivazione RID' },
  { code: 'T-004', description: 'Pratica gaudì' },
  { code: 'T-005', description: 'Taratura interfaccia 786 ARERA' },
  { code: 'T-006', description: 'Taratura contatore di produzione' },
  { code: 'T-007', description: 'Pratica di connessione completa' },
  { code: 'T-008', description: 'Pratica Antimafia' },
  { code: 'T-009', description: 'Pratica SIAD' },
  { code: 'T-010', description: 'Pratica 786 distributore' },
  { code: 'T-011', description: 'Pratica ARERA' },
  { code: 'T-012', description: 'Cambio titolarità' },
  { code: 'T-013', description: 'Cambio dati GSE' },
  { code: 'T-014', description: 'Dichiarazione annuale di consumo' },
  { code: 'T-015', description: 'Taratura SPG' },
  { code: 'T-016', description: 'Verifica misure di resistenza di terra' },
  { code: 'T-017', description: 'Pratica CURIT' },
  { code: 'T-018', description: 'Pratica FGAS' },
  { code: 'T-019', description: 'Pratica autoconsumo a distanza' },
  { code: 'R-001', description: 'Realizzazione meccanico' },
  { code: 'R-002', description: 'Realizzazione elettrico' },
  { code: 'R-003', description: 'Realizzazione idraulico' },
  { code: 'R-004', description: 'Realizzazione edile' },
  { code: 'R-005', description: 'Avviamento meccanico' },
  { code: 'R-006', description: 'Avviamento elettrico' },
  { code: 'R-007', description: 'Gestione cantiere' },
  { code: 'R-008', description: 'Sicurezza cantiere' }
];

const COST_ITEMS = [
  { code: 'H-001', description: 'ORE IMPIEGATI - JUNIOR', um: 'H', cu: 28 },
  { code: 'H-002', description: 'ORE IMPIEGATI - SENIOR', um: 'H', cu: 35 },
  { code: 'H-003', description: 'ORE IMPIEGATI - CAPOCOMMESSA', um: 'H', cu: 65 },
  { code: 'H-004', description: 'ORE OPERAI - JUNIOR', um: 'H', cu: 28 },
  { code: 'H-005', description: 'ORE OPERAI - SENIOR', um: 'H', cu: 35 },
  { code: 'Q-001', description: 'TRASFERTA - SOGGIORNO', um: 'N', cu: 0 },
  { code: 'Q-002', description: 'TRASFERTA - SPOSTAMENTI', um: 'N', cu: 0 },
  { code: 'Q-003', description: 'TRASFERTA - PASTI', um: 'N', cu: 20 },
  { code: 'Q-004', description: 'TRASFERTA - KM', um: 'KM', cu: 0.6 },
  { code: 'Q-005', description: 'TRASFERTA - PEDAGGI', um: 'N', cu: 0 },
  { code: 'Q-006', description: 'TRASFERTA - PARCHEGGI', um: 'N', cu: 0 },
  { code: 'Q-007', description: 'TRASFERTA - NOLEGGIO', um: 'N', cu: 0 },
  { code: 'Q-008', description: 'TRASFERTA - ALTRO', um: 'N', cu: 0 },
  { code: 'Y-001', description: 'MATERIALI PRINCIPALI', um: 'N', cu: 0 },
  { code: 'Y-002', description: 'MATERIALI ACCESSORI', um: 'N', cu: 0 },
  { code: 'Y-003', description: 'MATERIALI DI CONSUMO', um: 'N', cu: 0 },
  { code: 'W-001', description: 'TRASPORTO', um: 'N', cu: 0 },
  { code: 'W-002', description: 'SMALTIMENTO', um: 'N', cu: 0 },
  { code: 'W-003', description: 'ADDEBITO RAEE', um: 'N', cu: 0 },
  { code: 'W-004', description: 'NOLEGGIO MEZZI DA LAVORO', um: 'N', cu: 0 },
  { code: 'Y-009', description: 'MANODOPERA ESTERNA', um: 'N', cu: 0 },
  { code: 'Y-007', description: 'CONSULENZA ESTERNA', um: 'N', cu: 0 },
  { code: 'Y-010', description: 'FORNITURA E POSA', um: 'N', cu: 0 },
  { code: 'L-001', description: 'RIMBORSO SPESE ANTICIPATE', um: 'N', cu: 0 }
];

export default function BCBuilder() {
  const [bc, setBc] = useState({
    id: 'bc_001',
    jobs: [{ id: gid('job'), description: 'Descrizione non fissa', pm: '', jobcode: '', generalCostPct: 0.2, plants: [] }]
  });

  const tree = useMemo(() => {
    let bC = 0, bR = 0, bD = 0;
    const jobs = bc.jobs.map(job => {
      let jC = 0, jR = 0, jD = 0;
      const jobGenPct = job.generalCostPct || 0;
      
      const plants = job.plants.map(plant => {
        let pC = 0, pR = 0, pD = 0;
        const activities = plant.activities.map(act => {
          let aC = 0;
          const costItems = act.costItems.map(ci => {
            const base = ci.quantity * ci.baseUnitCost;
            aC += base * (1 + jobGenPct);
            return { ...ci, calc: base };
          });

          const cost = f4(aC);
          const baseRevenue = act.pricingMode === 'fixed'
            ? f4(act.fixedAmount || 0)
            : f4(cost * (1 + (act.userMarkup || 0)));

          const correction = Math.min(Math.max(0, Number(act.correction || 0)), baseRevenue);
          const discount = f4(correction);
          const rev = f4(baseRevenue - discount);
          const m = f4(rev - cost);

          pC += cost;
          pR += rev;
          pD += discount;

          return {
            ...act,
            correction: discount,
            discount,
            costItems,
            totalCost: cost,
            totalRevenue: rev,
            margin: m,
            marginPct: rev > 0 ? f4((m / rev) * 100) : 0
          };
        });
        const c = f4(pC), r = f4(pR), d = f4(pD);
        jC += c;
        jR += r;
        jD += d;
        return { ...plant, activities, totalCost: c, totalRevenue: r, totalDiscount: d, margin: f4(r - c), marginPct: r > 0 ? f4(((r - c) / r) * 100) : 0 };
      });
      const c = f4(jC), r = f4(jR), d = f4(jD);
      bC += c;
      bR += r;
      bD += d;
      return { ...job, plants, totalCost: c, totalRevenue: r, totalDiscount: d, margin: f4(r - c), marginPct: r > 0 ? f4(((r - c) / r) * 100) : 0 };
    });
    const c = f4(bC), r = f4(bR), d = f4(bD);
    return { ...bc, jobs, totalCost: c, totalRevenue: r, totalDiscount: d, margin: f4(r - c), marginPct: r > 0 ? f4(((r - c) / r) * 100) : 0 };
  }, [bc]);

  const mapJobs = (fn) => setBc(p => ({ ...p, jobs: p.jobs.map(fn) }));
  const setJob = (jid, f, v) => mapJobs(j => j.id === jid ? { ...j, [f]: v } : j);
  const addJob = () => setBc(p => ({ ...p, jobs: [...p.jobs, { id: gid('job'), description: 'Descrizione non fissa', pm: '', jobcode: '', generalCostPct: 0.2, plants: [] }] }));
  const delJob = (jid) => setBc(p => ({ ...p, jobs: p.jobs.filter(j => j.id !== jid) }));

  const mapPl = (jid, fn) => mapJobs(j => j.id === jid ? { ...j, plants: j.plants.map(fn) } : j);
  const addPlant = (jid) => mapJobs(j => j.id === jid ? { ...j, plants: [...j.plants, { id: gid('pl'), code: '', name: '', note: '', activities: [] }] } : j);
  const delPlant = (jid, pid) => mapJobs(j => j.id === jid ? { ...j, plants: j.plants.filter(p => p.id !== pid) } : j);
  const setPlantNote = (jid, pid, v) => mapPl(jid, p => p.id === pid ? { ...p, note: v } : p);
  const selPlant = (jid, pid, s) => {
    const x = PLANTS.find(p => `${p.code} - ${p.description}` === s);
    mapPl(jid, p => p.id === pid ? { ...p, code: x ? x.code : '', name: x ? x.description : s } : p);
  };

  const mapAct = (jid, pid, fn) => mapPl(jid, p => p.id === pid ? { ...p, activities: p.activities.map(fn) } : p);
  const addAct = (jid, pid) => mapPl(jid, p => p.id === pid ? {
    ...p,
    activities: [
      ...p.activities,
      {
        id: gid('a'),
        code: '',
        description: '',
        note: '',
        pricingMode: 'markup',
        userMarkup: 0,
        fixedAmount: 0,
        correction: 0,
        costItems: []
      }
    ]
  } : p);
  const delAct = (jid, pid, aid) => mapPl(jid, p => p.id === pid ? { ...p, activities: p.activities.filter(a => a.id !== aid) } : p);
  const setActNote = (jid, pid, aid, v) => mapAct(jid, pid, a => a.id === aid ? { ...a, note: v } : a);
  const selAct = (jid, pid, aid, s) => {
    const x = ACTIVITIES.find(a => `${a.code} - ${a.description}` === s);
    mapAct(jid, pid, a => a.id === aid ? { ...a, code: x ? x.code : '', description: x ? x.description : s } : a);
  };

  const setMode = (jid, pid, aid, m) => mapAct(jid, pid, a => a.id === aid ? { ...a, pricingMode: m, correction: 0 } : a);
  const setMarkup = (jid, pid, aid, v) => mapAct(jid, pid, a => a.id === aid ? { ...a, userMarkup: Math.max(0, Number(v) / 100), correction: 0 } : a);
  const setFixed = (jid, pid, aid, v) => mapAct(jid, pid, a => a.id === aid ? { ...a, fixedAmount: Math.max(0, Number(v)), correction: 0 } : a);
  const setCorrection = (jid, pid, aid, maxRevenue, v) => mapAct(jid, pid, a => a.id === aid ? { ...a, correction: Math.min(Math.max(0, Number(v)), Math.max(0, Number(maxRevenue || 0))) } : a);

  const mapCi = (jid, pid, aid, fn) => mapAct(jid, pid, a => a.id === aid ? { ...a, costItems: a.costItems.map(fn) } : a);
  const addCi = (jid, pid, aid) => mapAct(jid, pid, a => a.id === aid ? { ...a, costItems: [...a.costItems, { id: gid('c'), code: '', description: '', um: '', baseUnitCost: 0, quantity: 0 }] } : a);
  const delCi = (jid, pid, aid, cid) => mapAct(jid, pid, a => a.id === aid ? { ...a, costItems: a.costItems.filter(c => c.id !== cid) } : a);
  const selCi = (jid, pid, aid, cid, s) => {
    const x = COST_ITEMS.find(c => c.description === s);
    mapCi(jid, pid, aid, c => c.id === cid ? {
      ...c,
      code: x ? x.code : '',
      description: x ? x.description : s,
      um: x ? x.um : c.um,
      baseUnitCost: x ? x.cu : c.baseUnitCost
    } : c);
  };
  const setCiNum = (jid, pid, aid, cid, f, v) => mapCi(jid, pid, aid, c => c.id === cid ? { ...c, [f]: Math.max(0, Number(v)) } : c);

  const exportExcel = () => {
    const rows = [];
    tree.jobs.forEach((job, ji) => job.plants.forEach((pl, pi) => pl.activities.forEach((a, ai) => a.costItems.forEach(ci => {
      rows.push({
        Job: `J${ji + 1}`,
        'Job Desc': job.description,
        PM: job.pm,
        JOBCODE: job.jobcode,
        Plant: `P${ji + 1}.${pi + 1}`,
        'Plant Code': pl.code,
        'Plant Note': pl.note,
        Activity: `A${ji + 1}.${pi + 1}.${ai + 1}`,
        'Act Desc': a.description,
        'Act Note': a.note,
        Mode: a.pricingMode === 'fixed' ? 'FIXED' : 'MARKUP',
        Fixed: a.pricingMode === 'fixed' ? a.fixedAmount : '',
        'Markup %': a.pricingMode === 'markup' ? a.userMarkup * 100 : '',
        Correction: a.correction || 0,
        'Cost Item': ci.description,
        UM: ci.um,
        'Base Cost': ci.baseUnitCost,
        'Gen %': (job.generalCostPct || 0) * 100,
        Qty: ci.quantity
      });
    }))));

    import('xlsx')
      .then(X => {
        const ws = X.utils.json_to_sheet(rows);
        const wb = X.utils.book_new();
        X.utils.book_append_sheet(wb, ws, 'BC');
        X.writeFile(wb, `BC_${new Date().toISOString().split('T')[0]}.xlsx`);
      })
      .catch(() => alert("Export needs the 'xlsx' package (available in your real project)."));
  };

  const cell = { border: '1px solid #94a3b8', padding: '3px 6px', fontSize: '0.8em', verticalAlign: 'middle', background: '#fff' };
  const inp = { width: '100%', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '4px 5px', fontSize: '0.95em', background: '#fff', color: '#0f172a' };
  const badge = (bg) => ({ ...cell, background: bg, textAlign: 'center', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', padding: 0 });
  const gap = { borderLeft: '10px solid #f1f5f9' };
  const squareBadgeInner = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', width: '64px', minWidth: '64px', height: '64px', margin: '0 auto', padding: '4px 2px', boxSizing: 'border-box' };
  const squareBadgeLabel = { lineHeight: 1, fontWeight: 800 };

  const actSelectBaseStyle = { ...inp };
  const actSelectActiveStyle = {
    ...inp,
    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    color: '#fff',
    fontWeight: 800,
    textShadow: '0 1px 1px rgba(0,0,0,0.3)',
    border: 'none',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)'
  };
  
  const plantSelectBaseStyle = { ...inp };
  const plantSelectActiveStyle = {
    ...inp,
    background: 'linear-gradient(135deg,#0d9488,#14b8a6)',
    color: '#fff',
    fontWeight: 800,
    textShadow: '0 1px 1px rgba(0,0,0,0.3)',
    border: 'none',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)'
  };

  const blank = (key, span = 1) => <td key={key} colSpan={span} style={{ border: 'none', background: '#f1f5f9', padding: 0 }}></td>;
  const plantBadge = { ...cell, background: 'linear-gradient(135deg,#0d9488,#14b8a6)', color: '#fff', textAlign: 'center', fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '0.5px', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3)', textShadow: '0 1px 1px rgba(0,0,0,0.3)', padding: 0 };
  const actBadge = { ...cell, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', textAlign: 'center', fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '0.5px', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3)', textShadow: '0 1px 1px rgba(0,0,0,0.3)', padding: 0 };
  const xbtn = (fn, compact = false) => <button onClick={fn} style={{ border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '3px', cursor: 'pointer', fontSize: compact ? '0.62em' : '0.7em', padding: compact ? '1px 4px' : '1px 5px', marginLeft: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>✕</button>;
  const addbtn = (label, fn, bg, col, compact = false) => <button onClick={fn} style={{ border: 'none', background: bg, color: col, borderRadius: '3px', cursor: 'pointer', fontSize: compact ? '0.62em' : '0.7em', padding: compact ? '2px 4px' : '2px 6px', marginTop: 0, display: 'block', width: compact ? 'auto' : '100%', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</button>;

  // --- Rendering functions for split rows ---
  const sumCellTop = (val, first = false) => {
    const isBig = Math.abs(val) >= 1000000;
    return (
      <td style={{ ...cell, ...(first ? gap : {}), borderBottom: 'none', paddingBottom: '2px', textAlign: 'right', fontWeight: 700, color: '#0f172a', background: '#f8fafc', whiteSpace: 'nowrap', fontSize: isBig ? '0.73em' : '0.8em', letterSpacing: isBig ? '-0.4px' : 'normal' }}>
        {fmt(val)}
      </td>
    );
  };

  const sumCellBottom = (first = false) => (
    <td style={{ ...cell, ...(first ? gap : {}), borderTop: 'none', paddingTop: '2px', background: '#f8fafc' }}></td>
  );

  const marginCellTop = (val, pct, isBc = false) => {
    let bg = '#f8fafc';
    let tc = '#0f172a';
    if (isBc) {
      if (pct >= 20) { bg = '#16a34a'; tc = '#fff'; }
      else if (pct > 0) { bg = '#eab308'; tc = '#fff'; }
      else { bg = '#dc2626'; tc = '#fff'; }
    }
    const isBig = Math.abs(val) >= 1000000;
    return (
      <td style={{ ...cell, borderBottom: 'none', paddingBottom: '2px', textAlign: 'right', fontWeight: 700, color: tc, background: bg, whiteSpace: 'nowrap', fontSize: isBig ? '0.73em' : '0.8em', letterSpacing: isBig ? '-0.4px' : 'normal' }}>
        {fmt(val)}
      </td>
    );
  };

  const marginCellBottom = (pct, isBc = false) => {
    let bg = '#f8fafc';
    let tc = '#0f172a';
    if (isBc) {
      if (pct >= 20) { bg = '#16a34a'; tc = '#fff'; }
      else if (pct > 0) { bg = '#eab308'; tc = '#fff'; }
      else { bg = '#dc2626'; tc = '#fff'; }
    }
    return (
      <td style={{ ...cell, borderTop: 'none', paddingTop: '2px', textAlign: 'right', color: tc, background: bg }}>
        <div style={{ fontStyle: 'italic', fontSize: '0.85em', fontWeight: 'normal', letterSpacing: 'normal' }}>({fmt(pct)}%)</div>
      </td>
    );
  };

  const pricingCellsTop = (job, pl, a) => {
    const isMk = a.pricingMode === 'markup';
    const sharedTone = { background: isMk ? '#e0f2fe' : '#f1f5f9', opacity: isMk ? 1 : 0.55 };
    const modeCell = { ...cell, ...sharedTone, cursor: 'pointer', padding: 0, color: '#0f172a', borderRight: 'none' };
    const valueCell = { ...cell, ...sharedTone, borderLeft: 'none' };

    return (
      <>
        <td onClick={() => setMode(job.id, pl.id, a.id, 'markup')} style={modeCell}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', minHeight: '32px', padding: '0 6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '999px', border: '1px solid #64748b', background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '999px', background: '#0f172a', opacity: isMk ? 1 : 0 }}></span>
            </span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>M%</span>
          </div>
        </td>

        <td style={valueCell}>
          <Num
            w="100%"
            step={5}
            value={Math.round(a.userMarkup * 100)}
            disabled={!isMk}
            onChange={e => setMarkup(job.id, pl.id, a.id, e.target.value)}
          />
        </td>

        <td colSpan={1} style={{ ...cell, background: '#f8fafc', textAlign: 'left', fontWeight: 700, color: '#0f172a', borderBottom: 'none', paddingLeft: '8px' }}>
          Discount
        </td>
      </>
    );
  };

  const pricingCellsBottom = (job, pl, a) => {
    const isFixed = a.pricingMode === 'fixed';
    const currentRevenue = a.pricingMode === 'fixed'
      ? f4(a.fixedAmount || 0)
      : f4(a.totalCost * (1 + (a.userMarkup || 0)));
    const sharedTone = { background: isFixed ? '#e0f2fe' : '#f1f5f9', opacity: isFixed ? 1 : 0.55 };
    const modeCell = { ...cell, ...sharedTone, cursor: 'pointer', padding: 0, color: '#0f172a', borderRight: 'none' };
    const valueCell = { ...cell, ...sharedTone, borderLeft: 'none' };

    return (
      <>
        <td onClick={() => setMode(job.id, pl.id, a.id, 'fixed')} style={modeCell}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', minHeight: '32px', padding: '0 6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '999px', border: '1px solid #64748b', background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '999px', background: '#0f172a', opacity: isFixed ? 1 : 0 }}></span>
            </span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>F</span>
          </div>
        </td>

        <td style={valueCell}>
          <Num
            w="100%"
            step={100}
            value={a.fixedAmount}
            disabled={!isFixed}
            onChange={e => setFixed(job.id, pl.id, a.id, e.target.value)}
          />
        </td>

        <td colSpan={1} style={{ ...cell, borderTop: 'none' }}>
          <Num
            w="100%"
            step={100}
            value={a.correction || 0}
            onChange={e => setCorrection(job.id, pl.id, a.id, currentRevenue, e.target.value)}
          />
        </td>
      </>
    );
  };

  const rows = [];

  rows.push(
    <tr key="hdr">
      <th colSpan={8} style={{ ...cell, background: '#0f172a', color: '#fff', textAlign: 'left', fontSize: '0.85em' }}>BC — Cost &amp; Revenue structure (J ▸ P ▸ A ▸ C)</th>
      <th style={{ ...cell, ...gap, background: '#1e293b', color: '#fca5a5' }}>costs</th>
      <th style={{ ...cell, background: '#1e293b', color: '#93c5fd' }}>revenue</th>
      <th style={{ ...cell, background: '#1e293b', color: '#fbbf24' }}>discount</th>
      <th style={{ ...cell, background: '#1e293b', color: '#86efac' }}>margin</th>
    </tr>
  );

  // Split BC row into a Top and Bottom part
  rows.push(
    <tr key="bc-a">
      <td rowSpan={2} colSpan={8} style={{ ...badge('#0f172a'), textAlign: 'left', fontSize: '1.1em', padding: '8px' }}>BC</td>
      {sumCellTop(tree.totalCost, true)}
      {sumCellTop(tree.totalRevenue)}
      {sumCellTop(tree.totalDiscount || 0)}
      {marginCellTop(tree.margin, tree.marginPct, true)}
    </tr>
  );
  
  rows.push(
    <tr key="bc-b">
      {sumCellBottom(true)}
      {sumCellBottom()}
      {sumCellBottom()}
      {marginCellBottom(tree.marginPct, true)}
    </tr>
  );

  tree.jobs.forEach((job, ji) => {
    const J = `J${ji + 1}`;

      rows.push(
        <tr key={job.id + 'a'}>
          <td rowSpan={2} style={badge('#0f172a')}>
            <div style={squareBadgeInner}>
              <span style={squareBadgeLabel}>{J}</span>
              {xbtn(() => delJob(job.id), true)}
              {addbtn('+P', () => addPlant(job.id), '#475569', '#fff', false)}
            </div>
          </td>
          <td colSpan={7} style={cell}><input style={inp} placeholder="Descrizione non fissa" value={job.description} onChange={e => setJob(job.id, 'description', e.target.value)} /></td>
          {sumCellTop(job.totalCost, true)}
          {sumCellTop(job.totalRevenue)}
          {sumCellTop(job.totalDiscount || 0)}
          {marginCellTop(job.margin, job.marginPct)}
        </tr>
      );

    rows.push(
      <tr key={job.id + 'b'}>
        <td colSpan={3} style={cell}><input style={inp} placeholder="JOBCODE" value={job.jobcode} onChange={e => setJob(job.id, 'jobcode', e.target.value)} /></td>
        <td colSpan={3} style={cell}><input style={inp} placeholder="PM" value={job.pm} onChange={e => setJob(job.id, 'pm', e.target.value)} /></td>
        <td colSpan={1} style={cell}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8em', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>% Gen</span>
            <Num w="48px" step={1} value={Math.round((job.generalCostPct || 0) * 100)} onChange={e => setJob(job.id, 'generalCostPct', Math.max(0, Number(e.target.value) / 100))} />
          </div>
        </td>
        {sumCellBottom(true)}
        {sumCellBottom()}
        {sumCellBottom()}
        {marginCellBottom(job.marginPct)}
      </tr>
    );

    job.plants.forEach((pl, pi) => {
      const P = `P${ji + 1}.${pi + 1}`;

      rows.push(
        <tr key={pl.id + 'a'}>
          {blank('pl0', 1)}
          <td rowSpan={2} style={plantBadge}>
            <div style={squareBadgeInner}>
              <span style={squareBadgeLabel}>{P}</span>
              {xbtn(() => delPlant(job.id, pl.id), true)}
              {addbtn('+A', () => addAct(job.id, pl.id), 'rgba(255,255,255,0.25)', '#fff', false)}
            </div>
          </td>
          <td colSpan={6} style={cell}>
            <select 
              style={pl.code ? plantSelectActiveStyle : plantSelectBaseStyle} 
              value={pl.code ? `${pl.code} - ${pl.name}` : ''} 
              onChange={e => selPlant(job.id, pl.id, e.target.value)}
            >
              <option value="" style={{ color: '#0f172a', background: '#fff', textShadow: 'none', fontWeight: 'normal' }}>— Descrizione fissa (Plant) —</option>
              {PLANTS.map(p => <option key={p.code} style={{ color: '#0f172a', background: '#fff', textShadow: 'none', fontWeight: 'normal' }}>{p.code} - {p.description}</option>)}
            </select>
          </td>
          {sumCellTop(pl.totalCost, true)}
          {sumCellTop(pl.totalRevenue)}
          {sumCellTop(pl.totalDiscount || 0)}
          {marginCellTop(pl.margin, pl.marginPct)}
        </tr>
      );

      rows.push(
        <tr key={pl.id + 'b'}>
          {blank('plb0', 1)}
          <td colSpan={6} style={cell}><input style={inp} placeholder="Note" value={pl.note} onChange={e => setPlantNote(job.id, pl.id, e.target.value)} /></td>
          {sumCellBottom(true)}
          {sumCellBottom()}
          {sumCellBottom()}
          {marginCellBottom(pl.marginPct)}
        </tr>
      );

      pl.activities.forEach((a, ai) => {
        const A = `A${ji + 1}.${pi + 1}.${ai + 1}`;

        rows.push(
          <tr key={a.id + 'a'}>
            {blank('a0', 1)}
            {blank('a1', 1)}
            <td rowSpan={2} style={actBadge}>
              <div style={squareBadgeInner}>
                <span style={squareBadgeLabel}>{A}</span>
                {xbtn(() => delAct(job.id, pl.id, a.id), true)}
                {addbtn('+C', () => addCi(job.id, pl.id, a.id), 'rgba(255,255,255,0.25)', '#fff', false)}
              </div>
            </td>

            <td colSpan={2} style={cell}>
              <select 
                style={a.code ? actSelectActiveStyle : actSelectBaseStyle} 
                value={a.code ? `${a.code} - ${a.description}` : ''} 
                onChange={e => selAct(job.id, pl.id, a.id, e.target.value)}
              >
                <option value="" style={{ color: '#0f172a', background: '#fff', textShadow: 'none', fontWeight: 'normal' }}>— Descrizione fissa (Activity) —</option>
                {ACTIVITIES.map(x => <option key={x.code} style={{ color: '#0f172a', background: '#fff', textShadow: 'none', fontWeight: 'normal' }}>{x.code} - {x.description}</option>)}
              </select>
            </td>

            {pricingCellsTop(job, pl, a)}
            {sumCellTop(a.totalCost, true)}
            {sumCellTop(a.totalRevenue)}
            {sumCellTop(a.discount || 0)}
            {marginCellTop(a.margin, a.marginPct)}
          </tr>
        );

        rows.push(
          <tr key={a.id + 'b'}>
            {blank('ab0', 1)}
            {blank('ab1', 1)}

            <td colSpan={2} style={cell}>
              <input style={inp} placeholder="Note" value={a.note} onChange={e => setActNote(job.id, pl.id, a.id, e.target.value)} />
            </td>

            {pricingCellsBottom(job, pl, a)}
            {sumCellBottom(true)}
            {sumCellBottom()}
            {sumCellBottom()}
            {marginCellBottom(a.marginPct)}
          </tr>
        );

        a.costItems.forEach((ci) => {
          const ciCost = f4(ci.calc * (1 + (job.generalCostPct || 0)));
          const ciIsBig = Math.abs(ciCost) >= 1000000;
          
          rows.push(
            <tr key={ci.id}>
              {blank('c0', 1)}
              {blank('c1', 1)}
              {blank('c2', 1)}
              <td colSpan={2} style={cell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <select style={inp} value={ci.description} onChange={e => selCi(job.id, pl.id, a.id, ci.id, e.target.value)}>
                    <option value="">— Descrizione fissa —</option>
                    {COST_ITEMS.map(c => <option key={c.code}>{c.description}</option>)}
                  </select>
                  {xbtn(() => delCi(job.id, pl.id, a.id, ci.id))}
                </div>
              </td>
              <td colSpan={2} style={{ ...cell, padding: '3px 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' }}>
                  <Num w="96px" step={1} value={ci.baseUnitCost} onChange={e => setCiNum(job.id, pl.id, a.id, ci.id, 'baseUnitCost', e.target.value)} />
                  <span style={{ fontSize: '0.72em', color: '#64748b', fontWeight: 600 }}>€ /</span>
                  <span style={{ fontSize: '0.72em', color: '#0f172a', fontWeight: 700 }}>{ci.um || 'UM'}</span>
                </div>
              </td>
              <td style={{ ...cell, padding: '3px 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' }}>
                  <Num w="68px" step={1} value={ci.quantity} onChange={e => setCiNum(job.id, pl.id, a.id, ci.id, 'quantity', e.target.value)} />
                  <span style={{ fontSize: '0.68em', color: '#0f172a', fontWeight: 700 }}>{ci.um || 'UM'}</span>
                </div>
              </td>
              <td style={{ ...cell, ...gap, textAlign: 'right', fontWeight: 700, color: '#0f172a', background: '#f8fafc', whiteSpace: 'nowrap', fontSize: ciIsBig ? '0.73em' : '0.8em', letterSpacing: ciIsBig ? '-0.4px' : 'normal' }}>{fmt(ciCost)}</td>
              <td style={{ ...cell, background: '#f8fafc', border: 'none' }}></td>
              <td style={{ ...cell, background: '#f8fafc', border: 'none' }}></td>
              <td style={{ ...cell, background: '#f8fafc', border: 'none' }}></td>
            </tr>
          );
        });
      });
    });
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f1f5f9', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      <style>{`.hide-arrows::-webkit-inner-spin-button,.hide-arrows::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.hide-arrows{-moz-appearance:textfield}`}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#0f172a' }}>Business Case Builder</h2>
        <button onClick={addJob} style={{ border: 'none', background: '#0f172a', color: '#fff', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700 }}>+ Add Job (J)</button>
        <button onClick={exportExcel} style={{ border: 'none', background: '#16a34a', color: '#fff', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700, marginLeft: 'auto' }}>⬇ Export Excel</button>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '8px' }}>
        <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%', minWidth: '1047px', background: 'transparent' }}>
          <colgroup>
            <col style={{ width: '64px' }} />
            <col style={{ width: '64px' }} />
            <col style={{ width: '64px' }} />
            <col style={{ width: '94px' }} />
            <col style={{ width: '166px' }} />
            <col style={{ width: '46px' }} />
            <col style={{ width: '94px' }} />
            <col style={{ width: '104px' }} />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}
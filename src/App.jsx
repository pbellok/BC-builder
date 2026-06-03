import React, { useState, useMemo } from 'react';

const f4 = (n) => Number(Number(n || 0).toFixed(4));
const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const gid = (p) => `${p}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

const Num = ({ value, onChange, w = '100%', step = 1, disabled = false }) => (
  <div style={{ display: 'flex', width: w, border: '1px solid #cbd5e1', borderRadius: '3px', backgroundColor: disabled ? '#f1f5f9' : '#fff', overflow: 'hidden', opacity: disabled ? 0.45 : 1 }}>
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
  { code: 'S-009', description: 'PFTE meccanico' },
  { code: 'S-013', description: 'Progettazione esecutivo' },
  { code: 'S-021', description: 'Direzione lavori' },
  { code: 'R-001', description: 'Realizzazione meccanico' },
  { code: 'R-007', description: 'Gestione cantiere' }
];

const COST_ITEMS = [
  { code: 'H-001', description: 'ORE IMPIEGATI - JUNIOR', um: 'H', cu: 28, gen: 0.2 },
  { code: 'H-002', description: 'ORE IMPIEGATI - SENIOR', um: 'H', cu: 35, gen: 0.2 },
  { code: 'H-003', description: 'ORE - CAPOCOMMESSA', um: 'H', cu: 65, gen: 0.2 },
  { code: 'Q-004', description: 'TRASFERTA - KM', um: 'KM', cu: 0.6, gen: 0.2 },
  { code: 'Y-001', description: 'MATERIALI PRINCIPALI', um: 'N', cu: 0, gen: 0.2 },
  { code: 'Y-010', description: 'FORNITURA E POSA', um: 'N', cu: 0, gen: 0.2 }
];

export default function BCBuilder() {
  const [bc, setBc] = useState({
    id: 'bc_001',
    jobs: [{ id: gid('job'), description: 'Descrizione non fissa', pm: '', jobcode: '', plants: [] }]
  });

  const tree = useMemo(() => {
    let bC = 0, bR = 0, bD = 0;
    const jobs = bc.jobs.map(job => {
      let jC = 0, jR = 0, jD = 0;
      const plants = job.plants.map(plant => {
        let pC = 0, pR = 0, pD = 0;
        const activities = plant.activities.map(act => {
          let aC = 0;
          const costItems = act.costItems.map(ci => {
            const base = ci.quantity * ci.baseUnitCost;
            aC += base * (1 + ci.generalCostPct);
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
  const addJob = () => setBc(p => ({ ...p, jobs: [...p.jobs, { id: gid('job'), description: 'Descrizione non fissa', pm: '', jobcode: '', plants: [] }] }));
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
  const addCi = (jid, pid, aid) => mapAct(jid, pid, a => a.id === aid ? { ...a, costItems: [...a.costItems, { id: gid('c'), code: '', description: '', um: '', baseUnitCost: 0, quantity: 0, generalCostPct: 0 }] } : a);
  const delCi = (jid, pid, aid, cid) => mapAct(jid, pid, a => a.id === aid ? { ...a, costItems: a.costItems.filter(c => c.id !== cid) } : a);
  const selCi = (jid, pid, aid, cid, s) => {
    const x = COST_ITEMS.find(c => c.description === s);
    mapCi(jid, pid, aid, c => c.id === cid ? {
      ...c,
      code: x ? x.code : '',
      description: x ? x.description : s,
      um: x ? x.um : c.um,
      baseUnitCost: x ? x.cu : c.baseUnitCost,
      generalCostPct: x ? x.gen : c.generalCostPct
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
        'Gen %': ci.generalCostPct * 100,
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

  const sumCell = (val, color, span, first = false) => (
    <td rowSpan={span} style={{ ...cell, ...(first ? gap : {}), textAlign: 'right', fontWeight: 700, color: '#0f172a', background: '#f8fafc' }}>{fmt(val)}</td>
  );

  const marginCell = (val, pct, span, isBc = false) => {
    let bg = '#f8fafc';
    let tc = '#0f172a';
    if (isBc) {
      if (pct >= 20) {
        bg = '#16a34a';
        tc = '#fff';
      } else if (pct > 0) {
        bg = '#eab308';
        tc = '#fff';
      } else {
        bg = '#dc2626';
        tc = '#fff';
      }
    }
    return (
      <td rowSpan={span} style={{ ...cell, textAlign: 'right', fontWeight: 700, color: tc, background: bg }}>
        <div>{fmt(val)}</div>
        <div style={{ fontStyle: 'italic', fontSize: '0.85em', fontWeight: 'normal' }}>({fmt(pct)}%)</div>
      </td>
    );
  };

  const blank = (key, span = 1) => <td key={key} colSpan={span} style={{ border: 'none', background: 'transparent', padding: 0 }}></td>;
  const plantBadge = { ...cell, background: 'linear-gradient(135deg,#0d9488,#14b8a6)', color: '#fff', textAlign: 'center', fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '0.5px', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3)', textShadow: '0 1px 1px rgba(0,0,0,0.3)', padding: 0 };
  const actBadge = { ...cell, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', textAlign: 'center', fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '0.5px', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3)', textShadow: '0 1px 1px rgba(0,0,0,0.3)', padding: 0 };
  const xbtn = (fn, compact = false) => <button onClick={fn} style={{ border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '3px', cursor: 'pointer', fontSize: compact ? '0.62em' : '0.7em', padding: compact ? '1px 4px' : '1px 5px', marginLeft: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>✕</button>;
  const addbtn = (label, fn, bg, col, compact = false) => <button onClick={fn} style={{ border: 'none', background: bg, color: col, borderRadius: '3px', cursor: 'pointer', fontSize: compact ? '0.62em' : '0.7em', padding: compact ? '2px 4px' : '2px 6px', marginTop: 0, display: 'block', width: compact ? 'auto' : '100%', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</button>;

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

        <td colSpan={2} style={{ ...cell, background: '#f8fafc', textAlign: 'left', fontWeight: 700, color: '#0f172a', borderBottom: 'none', paddingLeft: '8px' }}>
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

        <td colSpan={2} style={{ ...cell, borderTop: 'none' }}>
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
      <th colSpan={9} style={{ ...cell, background: '#0f172a', color: '#fff', textAlign: 'left', fontSize: '0.85em' }}>BC — Cost &amp; Revenue structure (J ▸ P ▸ A ▸ C)</th>
      <th style={{ ...cell, ...gap, background: '#1e293b', color: '#fca5a5' }}>costs</th>
      <th style={{ ...cell, background: '#1e293b', color: '#93c5fd' }}>revenue</th>
      <th style={{ ...cell, background: '#1e293b', color: '#fbbf24' }}>discount</th>
      <th style={{ ...cell, background: '#1e293b', color: '#86efac' }}>margin</th>
    </tr>
  );

  rows.push(
    <tr key="bc">
      <td colSpan={9} style={{ ...badge('#0f172a'), textAlign: 'left', fontSize: '1.1em', padding: '8px' }}>BC</td>
      {sumCell(tree.totalCost, '#dc2626', 1, true)}
      {sumCell(tree.totalRevenue, '#2563eb', 1)}
      {sumCell(tree.totalDiscount || 0, '#d97706', 1)}
      {marginCell(tree.margin, tree.marginPct, 1, true)}
    </tr>
  );

  tree.jobs.forEach((job, ji) => {
    const J = `J${ji + 1}`;

      rows.push(
        <tr key={job.id + 'a'}>
          <td rowSpan={2} style={badge('#0f172a')}>
            <div style={squareBadgeInner}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span style={squareBadgeLabel}>{J}</span>
                {xbtn(() => delJob(job.id), true)}
              </div>
              {addbtn('+P', () => addPlant(job.id), '#475569', '#fff', true)}
            </div>
          </td>
          <td colSpan={8} style={cell}><input style={inp} placeholder="Descrizione non fissa" value={job.description} onChange={e => setJob(job.id, 'description', e.target.value)} /></td>
          {sumCell(job.totalCost, '#dc2626', 2, true)}
          {sumCell(job.totalRevenue, '#2563eb', 2)}
          {sumCell(job.totalDiscount || 0, '#d97706', 2)}
          {marginCell(job.margin, job.marginPct, 2)}
        </tr>
      );


    rows.push(
      <tr key={job.id + 'b'}>
        <td colSpan={4} style={cell}><input style={inp} placeholder="JOBCODE" value={job.jobcode} onChange={e => setJob(job.id, 'jobcode', e.target.value)} /></td>
        <td colSpan={4} style={cell}><input style={inp} placeholder="PM" value={job.pm} onChange={e => setJob(job.id, 'pm', e.target.value)} /></td>
      </tr>
    );

    job.plants.forEach((pl, pi) => {
      const P = `P${ji + 1}.${pi + 1}`;

      rows.push(
        <tr key={pl.id + 'a'}>
          {blank('pl0', 1)}
          <td rowSpan={2} style={plantBadge}>
            <div style={squareBadgeInner}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span style={squareBadgeLabel}>{P}</span>
                {xbtn(() => delPlant(job.id, pl.id), true)}
              </div>
              {addbtn('+A', () => addAct(job.id, pl.id), 'rgba(255,255,255,0.25)', '#fff', true)}
            </div>
          </td>
          <td colSpan={7} style={cell}>
            <select style={inp} value={pl.code ? `${pl.code} - ${pl.name}` : ''} onChange={e => selPlant(job.id, pl.id, e.target.value)}>
              <option value="">— Descrizione fissa (Plant) —</option>
              {PLANTS.map(p => <option key={p.code}>{p.code} - {p.description}</option>)}
            </select>
          </td>
          {sumCell(pl.totalCost, '#dc2626', 2, true)}
          {sumCell(pl.totalRevenue, '#2563eb', 2)}
          {sumCell(pl.totalDiscount || 0, '#d97706', 2)}
          {marginCell(pl.margin, pl.marginPct, 2)}
        </tr>
      );

      rows.push(
        <tr key={pl.id + 'b'}>
          {blank('plb0', 1)}
          <td colSpan={7} style={cell}><input style={inp} placeholder="Note" value={pl.note} onChange={e => setPlantNote(job.id, pl.id, e.target.value)} /></td>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span style={squareBadgeLabel}>{A}</span>
                  {xbtn(() => delAct(job.id, pl.id, a.id), true)}
                </div>
                {addbtn('+C', () => addCi(job.id, pl.id, a.id), 'rgba(255,255,255,0.25)', '#fff', true)}
              </div>
            </td>

            <td colSpan={2} style={cell}>
              <select style={inp} value={a.code ? `${a.code} - ${a.description}` : ''} onChange={e => selAct(job.id, pl.id, a.id, e.target.value)}>
                <option value="">— Descrizione fissa (Activity) —</option>
                {ACTIVITIES.map(x => <option key={x.code}>{x.code} - {x.description}</option>)}
              </select>
            </td>

            {pricingCellsTop(job, pl, a)}
            {sumCell(a.totalCost, '#dc2626', 2, true)}
            {sumCell(a.totalRevenue, '#2563eb', 2)}
            {sumCell(a.discount || 0, '#d97706', 2)}
            {marginCell(a.margin, a.marginPct, 2)}
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
          </tr>
        );

        a.costItems.forEach((ci) => {
          rows.push(
            <tr key={ci.id}>
              {blank('c0', 1)}
              {blank('c1', 1)}
              <td colSpan={3} style={cell}>
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
                  <Num w="70px" step={1} value={ci.quantity} onChange={e => setCiNum(job.id, pl.id, a.id, ci.id, 'quantity', e.target.value)} />
                  <span style={{ fontSize: '0.68em', color: '#0f172a', fontWeight: 700 }}>{ci.um || 'UM'}</span>
                </div>
              </td>
              <td style={{ ...cell, padding: '3px 3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0px', whiteSpace: 'nowrap', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.77em', color: '#0f172a', fontWeight: 700 }}>{Math.round(ci.generalCostPct * 100)}</span>
                  <span style={{ fontSize: '0.58em', color: '#64748b', fontWeight: 600 }}>% gen</span>
                </div>
              </td>
              <td style={{ ...cell, ...gap, textAlign: 'right', fontWeight: 700, color: '#0f172a', background: '#f8fafc' }}>{fmt(f4(ci.calc * (1 + ci.generalCostPct)))}</td>
              <td style={{ ...cell, background: '#f8fafc' }}></td>
              <td style={{ ...cell, background: '#f8fafc' }}></td>
              <td style={{ ...cell, background: '#f8fafc' }}></td>
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

      <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '1097px', minWidth: '1097px', background: '#fff' }}>
          <colgroup>
            <col style={{ width: '64px' }} />
            <col style={{ width: '64px' }} />
            <col style={{ width: '64px' }} />
            <col style={{ width: '94px' }} />
            <col style={{ width: '166px' }} />
            <col style={{ width: '46px' }} />
            <col style={{ width: '110px' }} />
            <col style={{ width: '88px' }} />
            <col style={{ width: '50px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '95px' }} />
          </colgroup>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}
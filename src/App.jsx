import React, { useState, useMemo } from 'react';

// --- MATH UTILITY ---
const format4Dec = (num) => Number(num.toFixed(4));
const formatValue = (num) => Number(num || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// --- ID GENERATOR ---
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// --- CUSTOM NUMBER INPUT COMPONENT (supports compact mode) ---
const CustomNumInput = ({ value, onChange, width = '80px', step = 1, compact = false }) => {
  const increment = () => onChange({ target: { value: Number(value) + step } });
  const decrement = () => onChange({ target: { value: Math.max(0, Number(value) - step) } });
  const pad = compact ? '3px 7px' : '6px 12px';
  const fs = compact ? '0.85em' : '1em';

  return (
    <div style={{ display: 'inline-flex', width: width, border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', overflow: 'hidden', flexShrink: 0 }}>
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="hide-arrows"
        style={{ width: '100%', border: 'none', outline: 'none', padding: pad, textAlign: 'right', color: '#0f172a', backgroundColor: 'transparent', fontSize: fs }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <button type="button" tabIndex="-1" onClick={increment} style={{ flex: 1, border: 'none', borderBottom: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontSize: '9px', padding: compact ? '0 6px' : '0 10px', color: '#64748b' }}>▲</button>
        <button type="button" tabIndex="-1" onClick={decrement} style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '9px', padding: compact ? '0 6px' : '0 10px', color: '#64748b' }}>▼</button>
      </div>
    </div>
  );
};

// --- MASTER DATA ARCHIVES ---
const PLANTS = [
  { code: 'MEC', description: 'Impianto meccanico' },
  { code: 'IDR', description: 'Idraulica' },
  { code: 'ELE', description: 'Impianto elettrico' },
  { code: 'FTV', description: 'Impianto fotovoltaico' },
  { code: 'IDG', description: 'Idrogeno' },
  { code: 'EDI', description: 'Edilizia' },
  { code: 'GLO', description: 'Global' }
];

const ACTIVITIES = [
  { code: 'S-001', description: 'Rilievi' }, { code: 'S-002', description: 'Consulenza ingegneristica' },
  { code: 'S-003', description: 'Consulenza ingegneristica VVF' }, { code: 'S-004', description: "Studio di fattibilita' meccanico" },
  { code: 'S-005', description: "Studio di fattibilita' elettrico" }, { code: 'S-006', description: "Studio di fattibilita' edile" },
  { code: 'S-007', description: "Studio di fattibilita' idraulico" }, { code: 'S-008', description: 'Studio di fattibilita VVF' },
  { code: 'S-009', description: 'PFTE meccanico' }, { code: 'S-010', description: 'PFTE elettrico' },
  { code: 'S-011', description: 'PFTE edile' }, { code: 'S-012', description: 'PFTE idraulico' },
  { code: 'S-013', description: 'Progettazione esecutivo meccanico' }, { code: 'S-014', description: 'Progettazione esecutivo elettrico' },
  { code: 'S-015', description: 'Progettazione esecutivo edile' }, { code: 'S-016', description: 'Progettazione esecutivo idraulico' },
  { code: 'S-017', description: 'Progettazione as built meccanico' }, { code: 'S-018', description: 'Progettazione as built elettrico' },
  { code: 'S-019', description: 'Progettazione as built edile' }, { code: 'S-020', description: 'Progettazione as built idraulico' },
  { code: 'S-021', description: 'Direzione lavori meccanico' }, { code: 'S-022', description: 'Direzione lavori elettrico' },
  { code: 'S-023', description: 'Direzione lavori edile' }, { code: 'S-024', description: 'Direzione lavori idraulico' },
  { code: 'S-025', description: 'Direzione lavori VVF' }, { code: 'S-026', description: 'Direzione lavori GENERALE' },
  { code: 'S-027', description: 'Assistenza al collaudo meccanico' }, { code: 'S-028', description: 'Assistenza al collaudo elettrico' },
  { code: 'S-029', description: 'Assistenza al collaudo edile' }, { code: 'S-030', description: 'Assistenza al collaudo idraulico' },
  { code: 'S-031', description: 'Collaudo tecnico amministrativo' }, { code: 'S-032', description: 'Valutazione progetto VVF' },
  { code: 'S-033', description: 'Requisiti acustici passivi' }, { code: 'S-034', description: 'Clima acustico' },
  { code: 'S-035', description: 'Diagnosi energetica' }, { code: 'S-036', description: 'Accesso agli atti VVF' },
  { code: 'S-037', description: 'Valutazione rischio VVF' }, { code: 'S-038', description: 'Piani evacuazione VVF' },
  { code: 'S-039', description: 'CSP' }, { code: 'S-040', description: 'CSE' },
  { code: 'S-041', description: 'Relazione invarianza idraulica' }, { code: 'S-042', description: "Studio fattibilita' strutture" },
  { code: 'S-043', description: 'PFTE strutture' }, { code: 'S-044', description: 'Progettazione esecutivo strutture' },
  { code: 'S-045', description: 'As built strutture' }, { code: 'S-046', description: 'Direzione lavori strutture' },
  { code: 'S-047', description: 'Collaudo strutture' }, { code: 'S-048', description: 'Responsabile lavori' },
  { code: 'P-001', description: 'SCIA VVF' }, { code: 'P-002', description: 'Cert rei - dich. prod' },
  { code: 'P-003', description: 'Pratica inail' }, { code: 'P-004', description: 'Attestato di rinnovo periodico VVF' },
  { code: 'P-005', description: 'Pratica detrazione fiscale' }, { code: 'P-006', description: 'Pratica conto termico' },
  { code: 'P-007', description: 'Pratica incentivi diversi' }, { code: 'P-008', description: 'Legge 10 PFTE' },
  { code: 'P-009', description: "Legge 10 in corso d'opera" }, { code: 'P-010', description: 'Legge 10 as built' },
  { code: 'P-011', description: 'APE convenzionale' }, { code: 'P-012', description: 'APE' },
  { code: 'P-013', description: 'Pratica Paesaggistica' }, { code: 'P-014', description: 'Pratica comunale' },
  { code: 'P-015', description: 'Pratica autorizzativa' }, { code: 'P-016', description: 'Relazione geologica - geotecnica' },
  { code: 'G-001', description: 'Consulenza tecnica (no cassa)' }, { code: 'T-001', description: 'Attribuzione codice ditta' },
  { code: 'T-002', description: 'Pratica officina elettrica' }, { code: 'T-003', description: 'Pratica attivazione RID' },
  { code: 'T-004', description: 'Pratica gaudì' }, { code: 'T-005', description: 'Taratura interfaccia 786 ARERA' },
  { code: 'T-006', description: 'Taratura contatore di produzione' }, { code: 'T-007', description: 'Pratica di connessione completa' },
  { code: 'T-008', description: 'Pratica Antimafia' }, { code: 'T-009', description: 'Pratica SIAD' },
  { code: 'T-010', description: 'Pratica 786 distributore' }, { code: 'T-011', description: 'Pratica ARERA' },
  { code: 'T-012', description: 'Cambio titolarità' }, { code: 'T-013', description: 'Cambio dati GSE' },
  { code: 'T-014', description: 'Dichiarazione annuale di consumo' }, { code: 'T-015', description: 'Taratura SPG' },
  { code: 'T-016', description: 'Verifica misure di resistenza di terra' }, { code: 'T-017', description: 'Pratica CURIT' },
  { code: 'T-018', description: 'Pratica FGAS' }, { code: 'T-019', description: 'Pratica autoconsumo a distanza' },
  { code: 'R-001', description: 'Realizzazione meccanico' }, { code: 'R-002', description: 'Realizzazione elettrico' },
  { code: 'R-003', description: 'Realizzazione idraulico' }, { code: 'R-004', description: 'Realizzazione edile' },
  { code: 'R-005', description: 'Avviamento meccanico' }, { code: 'R-006', description: 'Avviamento elettrico' },
  { code: 'R-007', description: 'Gestione cantiere' }, { code: 'R-008', description: 'Sicurezza cantiere' }
];

const COST_ITEMS = [
  { code: 'H-001', description: 'ORE IMPIEGATI - JUNIOR', um: 'H', defaultCU: 28, defaultGenCost: 0.2 },
  { code: 'H-002', description: 'ORE IMPIEGATI - SENIOR', um: 'H', defaultCU: 35, defaultGenCost: 0.2 },
  { code: 'H-003', description: 'ORE IMPIEGATI - CAPOCOMMESSA', um: 'H', defaultCU: 65, defaultGenCost: 0.2 },
  { code: 'H-004', description: 'ORE OPERAI - JUNIOR', um: 'H', defaultCU: 28, defaultGenCost: 0.2 },
  { code: 'H-005', description: 'ORE OPERAI - SENIOR', um: 'H', defaultCU: 35, defaultGenCost: 0.2 },
  { code: 'Q-001', description: 'TRASFERTA - SOGGIORNO', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Q-002', description: 'TRASFERTA - SPOSTAMENTI', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Q-003', description: 'TRASFERTA - PASTI', um: 'N', defaultCU: 20, defaultGenCost: 0.2 },
  { code: 'Q-004', description: 'TRASFERTA - KM', um: 'KM', defaultCU: 0.6, defaultGenCost: 0.2 },
  { code: 'Q-005', description: 'TRASFERTA - PEDAGGI', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Q-006', description: 'TRASFERTA - PARCHEGGI', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Q-007', description: 'TRASFERTA - NOLEGGIO', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Q-008', description: 'TRASFERTA - ALTRO', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Y-001', description: 'MATERIALI PRINCIPALI', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Y-002', description: 'MATERIALI ACCESSORI', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Y-003', description: 'MATERIALI DI CONSUMO', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'W-001', description: 'TRASPORTO', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'W-002', description: 'SMALTIMENTO', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'W-003', description: 'ADDEBITO RAEE', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'W-004', description: 'NOLEGGIO MEZZI DA LAVORO', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Y-009', description: 'MANODOPERA ESTERNA', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Y-007', description: 'CONSULENZA ESTERNA', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'Y-010', description: 'FORNITURA E POSA', um: 'N', defaultCU: 0, defaultGenCost: 0.2 },
  { code: 'L-001', description: 'RIMBORSO SPESE ANTICIPATE', um: 'N', defaultCU: 0, defaultGenCost: 0.2 }
];

export default function BCBuilder() {
  // --- 1. INITIAL STATE ---
  const [job, setJob] = useState({
    id: 'job_001', code: 'JOB-001', description: 'Main Contract A',
    projectManager: 'Pietro Bellocchi', plants: []
  });

  // --- 2. CASCADING CALCULATIONS ---
  const calculatedTree = useMemo(() => {
    let jobCost = 0, jobRevenue = 0;
    const calcPlants = job.plants.map(plant => {
      let plantCost = 0, plantRevenue = 0;
      const calcActivities = plant.activities.map(activity => {
        let actCost = 0, actRevenue = 0;
        const calcCostItems = activity.costItems.map(ci => {
          const baseCost = ci.quantity * ci.baseUnitCost;
          const costWithGeneral = baseCost * (1 + ci.generalCostPct);
          actCost += costWithGeneral;
          actRevenue += costWithGeneral * (1 + activity.userMarkup);
          return { ...ci, calculatedCost: baseCost };
        });
        const finalActCost = format4Dec(actCost);
        const finalActRevenue = format4Dec(actRevenue);
        const actMargin = format4Dec(finalActRevenue - finalActCost);
        const actMarginPct = finalActRevenue > 0 ? format4Dec((actMargin / finalActRevenue) * 100) : 0;
        plantCost += finalActCost; plantRevenue += finalActRevenue;
        return { ...activity, costItems: calcCostItems, totalCost: finalActCost, totalRevenue: finalActRevenue, margin: actMargin, marginPct: actMarginPct };
      });
      jobCost += plantCost; jobRevenue += plantRevenue;
      return { ...plant, activities: calcActivities, totalCost: format4Dec(plantCost), totalRevenue: format4Dec(plantRevenue) };
    });
    const finalJobCost = format4Dec(jobCost);
    const finalJobRevenue = format4Dec(jobRevenue);
    return { ...job, plants: calcPlants, totalCost: finalJobCost, totalRevenue: finalJobRevenue, margin: format4Dec(finalJobRevenue - finalJobCost), marginPct: finalJobRevenue > 0 ? format4Dec(((finalJobRevenue - finalJobCost) / finalJobRevenue) * 100) : 0 };
  }, [job]);

  // --- 3. STATE MODIFIERS ---
  const updateJobField = (field, value) => setJob(prev => ({ ...prev, [field]: value }));
  const updatePlantField = (plantId, field, value) => setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, [field]: value } : p) }));
  const selectPlant = (plantId, selectedString) => {
    const sel = PLANTS.find(p => `${p.code} - ${p.description}` === selectedString);
    setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, code: sel ? sel.code : '', plantName: sel ? sel.description : selectedString } : p) }));
  };
  const selectActivity = (plantId, actId, selectedString) => {
    const sel = ACTIVITIES.find(a => `${a.code} - ${a.description}` === selectedString);
    setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: p.activities.map(a => a.id === actId ? { ...a, code: sel ? sel.code : '', description: sel ? sel.description : selectedString } : a) } : p) }));
  };
  const selectCostItem = (plantId, actId, ciId, selectedString) => {
    const sel = COST_ITEMS.find(ci => ci.description === selectedString);
    setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: p.activities.map(a => a.id === actId ? { ...a, costItems: a.costItems.map(ci => ci.id === ciId ? { ...ci, code: sel ? sel.code : '', description: sel ? sel.description : selectedString, um: sel ? sel.um : '', baseUnitCost: sel ? sel.defaultCU : ci.baseUnitCost, generalCostPct: sel ? sel.defaultGenCost : ci.generalCostPct } : ci) } : a) } : p) }));
  };
  const updateCostItemNum = (plantId, actId, ciId, field, value) => {
    const numValue = Math.max(0, Number(value));
    setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: p.activities.map(a => a.id === actId ? { ...a, costItems: a.costItems.map(ci => ci.id === ciId ? { ...ci, [field]: numValue } : ci) } : a) } : p) }));
  };
  const updateMarkup = (plantId, actId, value) => {
    const numValue = Math.max(0, Number(value) / 100);
    setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: p.activities.map(a => a.id === actId ? { ...a, userMarkup: numValue } : a) } : p) }));
  };
  const addPlant = () => setJob(prev => ({ ...prev, plants: [...prev.plants, { id: generateId('plant'), code: '', plantName: '', description: '', activities: [] }] }));
  const addActivity = (plantId) => setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: [...p.activities, { id: generateId('act'), code: '', description: '', userMarkup: 0, costItems: [] }] } : p) }));
  const addCostItem = (plantId, actId) => setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: p.activities.map(a => a.id === actId ? { ...a, costItems: [...a.costItems, { id: generateId('ci'), code: '', description: '', um: '', baseUnitCost: 0, quantity: 0, generalCostPct: 0 }] } : a) } : p) }));
  const removePlant = (plantId) => setJob(prev => ({ ...prev, plants: prev.plants.filter(p => p.id !== plantId) }));
  const removeActivity = (plantId, actId) => setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: p.activities.filter(a => a.id !== actId) } : p) }));
  const removeCostItem = (plantId, actId, ciId) => setJob(prev => ({ ...prev, plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: p.activities.map(a => a.id === actId ? { ...a, costItems: a.costItems.filter(ci => ci.id !== ciId) } : a) } : p) }));

  // --- EXPORT TO EXCEL ---
  const exportToExcel = () => {
    const exportData = [];
    calculatedTree.plants.forEach((plant) => {
      plant.activities.forEach((activity) => {
        activity.costItems.forEach((ci) => {
          exportData.push({
            'Job Code': calculatedTree.code, 'Project Manager': calculatedTree.projectManager,
            'Plant Tag': plant.code, 'Plant Name': plant.plantName || plant.description,
            'Plant Notes': plant.description, 'Activity Code': activity.code, 'Activity Description': activity.description,
            'Cost Item': ci.description, 'UM': ci.um, 'Base Cost (€)': ci.baseUnitCost,
            'Gen. Cost (%)': ci.generalCostPct * 100, 'Quantity': ci.quantity,
            'Final Cost (€)': format4Dec(ci.calculatedCost * (1 + ci.generalCostPct)), 'Applied Markup (%)': activity.userMarkup * 100
          });
        });
      });
    });
    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Job Data");
      worksheet['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 10 }];
      XLSX.writeFile(workbook, `${calculatedTree.code || 'Job_Export'}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }).catch(err => { console.error(err); alert("Export failed. Please ensure the 'xlsx' package is installed."); });
  };

  // --- UI STYLES ---
  const btnStyle = { padding: '10px 16px', cursor: 'pointer', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95em', transition: 'background-color 0.2s' };
  const inputStyle = { padding: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '1em' };

  return (
    <div className="app-container" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#e2e8f0', minHeight: '100vh', color: '#0f172a' }}>

      <style>{`
        body { margin: 0; padding: 0; background-color: #e2e8f0; }
        .app-container { padding: 32px 18px; }
        input[type="number"].hide-arrows::-webkit-inner-spin-button,
        input[type="number"].hide-arrows::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"].hide-arrows { -moz-appearance: textfield; }

        .r-flex { display: flex; justify-content: space-between; align-items: flex-start; }
        .r-col-left { width: 48%; }
        .r-col-right { width: 35%; text-align: right; }

        /* COMPACT COST-ITEMS TABLE */
        .ci-table { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; border-radius: 6px; overflow: hidden; border: 1px solid #fed7aa; }
        .ci-thead tr { background-color: #fff1e6; text-align: left; font-size: 0.72em; color: #9a3412; text-transform: uppercase; letter-spacing: 0.04em; }
        .ci-thead th { padding: 6px 8px; font-weight: 700; }
        .ci-tbody tr { background-color: #ffffff; }
        .ci-tbody td { border-top: 1px solid #fde4cc; padding: 5px 8px; font-size: 0.85em; vertical-align: middle; }
        .ci-input { padding: 5px 8px; width: 100%; box-sizing: border-box; border: 1px solid #e2cdb8; border-radius: 4px; background: #fffdfb; color: #0f172a; font-size: 0.9em; }

        .mobile-add-btn { display: none; }

        @media (max-width: 820px) {
          .app-container { padding: 14px 8px; }
          .r-flex { flex-direction: column; align-items: stretch; }
          .r-col-left, .r-col-right { width: 100%; text-align: left; }
          .r-col-right { margin-top: 20px; }
          .action-btn-group { display: flex; gap: 8px; }
          .mobile-add-btn { display: block; width: 100%; margin-top: 12px; }

          .ci-thead { display: none; }
          .ci-table { border: none; }
          .ci-tbody { display: block; width: 100%; }
          .ci-tbody tr { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #fffaf5; border: 1px solid #fed7aa; border-radius: 8px; margin-bottom: 10px; padding: 10px; }
          .ci-tbody td { border-top: none; padding: 0; display: flex; flex-direction: column; }
          .ci-tbody td.ci-full { grid-column: 1 / -1; }
          .ci-tbody td::before { content: attr(data-label); font-weight: 600; color: #9a3412; font-size: 0.7em; text-transform: uppercase; margin-bottom: 3px; }
        }
      `}</style>

      <datalist id="plants-list">{PLANTS.map(p => <option key={p.code} value={`${p.code} - ${p.description}`} />)}</datalist>
      <datalist id="activities-list">{ACTIVITIES.map(a => <option key={a.code} value={`${a.code} - ${a.description}`} />)}</datalist>
      <datalist id="cost-items-list">{COST_ITEMS.map(ci => <option key={ci.code} value={ci.description} />)}</datalist>

      <div style={{ width: '100%', boxSizing: 'border-box', margin: '0 auto', backgroundColor: '#ffffff', borderTop: '8px solid #334155', borderRadius: '12px', padding: '28px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>

        {/* HEADER & JOB LEVEL */}
        <div className="r-flex" style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '24px' }}>
          <div className="r-col-left">
            <h1 style={{ margin: '0 0 22px 0', color: '#0f172a', fontSize: '1.9em', letterSpacing: '-0.5px' }}>Job Setup</h1>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#475569', fontSize: '0.9em' }}>Job Code:</label>
              <input value={job.code} onChange={(e) => updateJobField('code', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#475569', fontSize: '0.9em' }}>Job Description:</label>
              <input value={job.description} onChange={(e) => updateJobField('description', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#475569', fontSize: '0.9em' }}>Project Manager:</label>
              <input value={job.projectManager} onChange={(e) => updateJobField('projectManager', e.target.value)} style={inputStyle} />
            </div>
            <button onClick={addPlant} style={{...btnStyle, backgroundColor: '#0284c7', color: 'white', padding: '12px 20px'}}>+ Add Plant</button>
          </div>

          <div className="r-col-right" style={{ backgroundColor: '#f8fafc', padding: '22px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 14px 0', color: '#334155', textTransform: 'uppercase', fontSize: '0.85em', letterSpacing: '1px' }}>Job Totals</h3>
            <p style={{ margin: '10px 0', fontSize: '1.1em' }}>Cost: <strong style={{color: '#0f172a'}}>€{formatValue(calculatedTree.totalCost)}</strong></p>
            <p style={{ margin: '10px 0', fontSize: '1.1em' }}>Revenue: <strong style={{color: '#0f172a'}}>€{formatValue(calculatedTree.totalRevenue)}</strong></p>
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #cbd5e1', marginBottom: '18px' }}>
              <p style={{ margin: '0', fontSize: '1.2em', color: '#059669' }}>Margin: <strong>{formatValue(calculatedTree.marginPct)}% (€{formatValue(calculatedTree.margin)})</strong></p>
            </div>
            <button onClick={exportToExcel} style={{...btnStyle, width: '100%', backgroundColor: '#10b981', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export to .xlsx
            </button>
          </div>
        </div>

        {/* PLANTS LOOP */}
        {calculatedTree.plants.map((plant, plantIndex) => {
          const plantNum = plantIndex + 1;
          return (
          <div key={plant.id} style={{ marginTop: '36px', padding: '20px', backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', borderLeft: '8px solid #0284c7', borderRadius: '10px', boxShadow: '0 4px 6px rgba(2, 132, 199, 0.08)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto', minWidth: '250px', maxWidth: '640px' }}>
                <div style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Plant {plantNum}</div>
                <div style={{ flex: 1 }}>
                  <input list="plants-list" placeholder="Select Plant..." value={plant.code ? `${plant.code} - ${plant.plantName}` : plant.plantName || ''} onChange={(e) => selectPlant(plant.id, e.target.value)} style={{ ...inputStyle, borderColor: '#0284c7', margin: 0, width: '100%', fontWeight: 'bold', fontSize: '0.95em', padding: '8px 12px' }} />
                </div>
              </div>
              <div className="action-btn-group" style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}>
                <button onClick={() => addActivity(plant.id)} style={{...btnStyle, backgroundColor: '#10b981', color: 'white'}}>+ Add Activity</button>
                <button onClick={() => removePlant(plant.id)} style={{...btnStyle, backgroundColor: '#ef4444', color: 'white'}}>Remove Plant</button>
              </div>
            </div>

            {/* NEW: FREE DESCRIPTION BAR UNDER PLANT CHOICE */}
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75em', fontWeight: 700, color: '#075985', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Notes</span>
              <input value={plant.description || ''} onChange={(e) => updatePlantField(plant.id, 'description', e.target.value)} placeholder="Free description for this plant (optional)..." style={{ flex: 1, padding: '7px 12px', border: '1px dashed #38bdf8', borderRadius: '6px', backgroundColor: '#f0f9ff', color: '#0c4a6e', fontSize: '0.9em', fontStyle: 'italic' }} />
            </div>

            {/* ACTIVITIES LOOP */}
            {plant.activities.map((activity, actIndex) => {
              const actNum = `${plantNum}.${actIndex + 1}`;
              return (
              <div key={activity.id} style={{ marginTop: actIndex === 0 ? '18px' : '12px', padding: '14px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderLeft: '6px solid #f97316', borderRadius: '8px' }}>

                {/* COMPACT TOP ROW: tag + description + markup + totals + remove all inline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ backgroundColor: '#ea580c', color: '#ffffff', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.82em', whiteSpace: 'nowrap' }}>Act {actNum}</div>
                  <div style={{ flex: '2 1 240px', minWidth: '200px' }}>
                    <input list="activities-list" placeholder="Select Activity..." style={{ ...inputStyle, borderColor: '#ea580c', margin: 0, width: '100%', fontWeight: 'bold', fontSize: '0.88em', padding: '6px 10px' }} value={activity.code ? `${activity.code} - ${activity.description}` : activity.description} onChange={(e) => selectActivity(plant.id, activity.id, e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ color: '#9a3412', fontSize: '0.78em' }}>Markup %</strong>
                    <CustomNumInput value={(activity.userMarkup * 100).toFixed(2)} onChange={(e) => updateMarkup(plant.id, activity.id, e.target.value)} width="78px" compact />
                  </div>
                  <button onClick={() => removeActivity(plant.id, activity.id)} style={{...btnStyle, backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 12px', fontSize: '0.8em'}}>Remove</button>
                </div>

                {/* COMPACT TOTALS STRIP */}
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '8px', padding: '6px 10px', backgroundColor: '#ffffff', borderRadius: '5px', border: '1px solid #fed7aa', fontSize: '0.82em', color: '#431407' }}>
                  <span>Cost: <strong>€{formatValue(activity.totalCost)}</strong></span>
                  <span>Revenue: <strong>€{formatValue(activity.totalRevenue)}</strong></span>
                  <span>Profit: <strong style={{ color: activity.margin >= 0 ? '#059669' : '#dc2626' }}>€{formatValue(activity.margin)} ({formatValue(activity.marginPct)}%)</strong></span>
                </div>

                {/* COMPACT COST ITEMS TABLE */}
                <table className="ci-table" style={{ marginTop: '12px' }}>
                  <thead className="ci-thead">
                    <tr>
                      <th style={{ width: '40%' }}>Cost Item</th>
                      <th style={{ width: '8%' }}>UM</th>
                      <th style={{ width: '18%' }}>Base €</th>
                      <th style={{ width: '9%', textAlign: 'center' }}>Gen%</th>
                      <th style={{ width: '18%' }}>Qty</th>
                      <th style={{ width: '7%', textAlign: 'right' }}>
                        <button onClick={() => addCostItem(plant.id, activity.id)} style={{...btnStyle, backgroundColor: '#10b981', color: 'white', padding: '3px 9px', fontSize: '0.95em'}} title="Add Cost Item">+</button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ci-tbody">
                    {activity.costItems.map(ci => (
                      <tr key={ci.id}>
                        <td className="ci-full" data-label="Cost Item">
                          <input list="cost-items-list" placeholder="Search Item..." className="ci-input" value={ci.description || ''} onChange={(e) => selectCostItem(plant.id, activity.id, ci.id, e.target.value)} />
                        </td>
                        <td data-label="UM" style={{ fontWeight: '600', color: '#64748b' }}>{ci.um || '-'}</td>
                        <td data-label="Base €"><CustomNumInput value={ci.baseUnitCost} onChange={(e) => updateCostItemNum(plant.id, activity.id, ci.id, 'baseUnitCost', e.target.value)} width="92px" compact /></td>
                        <td data-label="Gen%" style={{ color: '#64748b', textAlign: 'center' }}>{formatValue(ci.generalCostPct * 100)}%</td>
                        <td data-label="Qty"><CustomNumInput value={ci.quantity} onChange={(e) => updateCostItemNum(plant.id, activity.id, ci.id, 'quantity', e.target.value)} width="92px" compact /></td>
                        <td data-label="" style={{ textAlign: 'right' }}>
                          <button onClick={() => removeCostItem(plant.id, activity.id, ci.id)} style={{...btnStyle, backgroundColor: '#f1f5f9', color: '#ef4444', border: '1px solid #cbd5e1', padding: '4px 10px', fontSize: '0.85em'}}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button className="mobile-add-btn" onClick={() => addCostItem(plant.id, activity.id)} style={{...btnStyle, backgroundColor: '#10b981', color: 'white'}}>+ Add Cost Item</button>
              </div>
              );
            })}
          </div>
          );
        })}
      </div>
    </div>
  );
}
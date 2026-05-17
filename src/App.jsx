import React, { useState, useMemo } from 'react';

// --- MATH UTILITY ---
const format4Dec = (num) => Number(num.toFixed(4));
const formatValue = (num) => Number(num || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// --- ID GENERATOR ---
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// --- CUSTOM NUMBER INPUT COMPONENT ---
const CustomNumInput = ({ value, onChange, width = '80px', step = 1 }) => {
  const increment = () => onChange({ target: { value: Number(value) + step } });
  const decrement = () => onChange({ target: { value: Math.max(0, Number(value) - step) } });

  return (
    <div style={{ display: 'inline-flex', width: width, border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', overflow: 'hidden', flexShrink: 0 }}>
      <input 
        type="number" 
        value={value} 
        onChange={onChange}
        className="hide-arrows"
        style={{ 
          width: '100%', 
          border: 'none', 
          outline: 'none', 
          padding: '6px 12px', 
          textAlign: 'right', 
          color: '#0f172a', 
          backgroundColor: 'transparent',
          fontSize: '1em'
        }} 
      />
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <button type="button" tabIndex="-1" onClick={increment} style={{ flex: 1, border: 'none', borderBottom: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontSize: '10px', padding: '0 10px', color: '#64748b' }}>▲</button>
        <button type="button" tabIndex="-1" onClick={decrement} style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '10px', padding: '0 10px', color: '#64748b' }}>▼</button>
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
  { code: 'S-001', description: 'Rilievi', type: 'PRE', area: 'multiarea' },
  { code: 'S-002', description: 'Consulenza ingegneristica', type: 'PRE', area: 'multiarea' },
  { code: 'S-003', description: 'Consulenza ingegneristica VVF', type: 'PRE', area: 'VVF' },
  { code: 'S-004', description: "Studio di fattibilita' meccanico", type: 'PRE', area: 'meccanico' },
  { code: 'S-005', description: "Studio di fattibilita' elettrico", type: 'PRE', area: 'elettrico' },
  { code: 'S-006', description: "Studio di fattibilita' edile", type: 'PRE', area: 'edile' },
  { code: 'S-007', description: "Studio di fattibilita' idraulico", type: 'PRE', area: 'idraulico' },
  { code: 'S-008', description: 'Studio di fattibilita VVF', type: 'PRE', area: 'VVF' },
  { code: 'S-009', description: 'PFTE meccanico', type: 'PRE', area: 'meccanico' },
  { code: 'S-010', description: 'PFTE elettrico', type: 'PRE', area: 'elettrico' },
  { code: 'S-011', description: 'PFTE edile', type: 'PRE', area: 'edile' },
  { code: 'S-012', description: 'PFTE idraulico', type: 'PRE', area: 'idraulico' },
  { code: 'S-013', description: 'Progettazione esecutivo meccanico', type: 'PRE', area: 'meccanico' },
  { code: 'S-014', description: 'Progettazione esecutivo elettrico', type: 'PRE', area: 'elettrico' },
  { code: 'S-015', description: 'Progettazione esecutivo edile', type: 'PRE', area: 'edile' },
  { code: 'S-016', description: 'Progettazione esecutivo idraulico', type: 'PRE', area: 'idraulico' },
  { code: 'S-017', description: 'Progettazione as built meccanico', type: 'PRE', area: 'meccanico' },
  { code: 'S-018', description: 'Progettazione as built elettrico', type: 'PRE', area: 'elettrico' },
  { code: 'S-019', description: 'Progettazione as built edile', type: 'PRE', area: 'edile' },
  { code: 'S-020', description: 'Progettazione as built idraulico', type: 'PRE', area: 'idraulico' },
  { code: 'S-021', description: 'Direzione lavori meccanico', type: 'PRE', area: 'meccanico' },
  { code: 'S-022', description: 'Direzione lavori elettrico', type: 'PRE', area: 'elettrico' },
  { code: 'S-023', description: 'Direzione lavori edile', type: 'PRE', area: 'edile' },
  { code: 'S-024', description: 'Direzione lavori idraulico', type: 'PRE', area: 'idraulico' },
  { code: 'S-025', description: 'Direzione lavori VVF', type: 'PRE', area: 'VVF' },
  { code: 'S-026', description: 'Direzione lavori GENERALE', type: 'PRE', area: 'multiarea' },
  { code: 'S-027', description: 'Assistenza al collaudo meccanico', type: 'PRE', area: 'meccanico' },
  { code: 'S-028', description: 'Assistenza al collaudo elettrico', type: 'PRE', area: 'elettrico' },
  { code: 'S-029', description: 'Assistenza al collaudo edile', type: 'PRE', area: 'edile' },
  { code: 'S-030', description: 'Assistenza al collaudo idraulico', type: 'PRE', area: 'idraulico' },
  { code: 'S-031', description: 'Collaudo tecnico amministrativo', type: 'PRE', area: 'multiarea' },
  { code: 'S-032', description: 'Valutazione progetto VVF', type: 'PRE', area: 'VVF' },
  { code: 'S-033', description: 'Requisiti acustici passivi', type: 'PRE', area: 'acustica' },
  { code: 'S-034', description: 'Clima acustico', type: 'PRE', area: 'acustica' },
  { code: 'S-035', description: 'Diagnosi energetica', type: 'PRE', area: 'multiarea' },
  { code: 'S-036', description: 'Accesso agli atti VVF', type: 'PRE', area: 'VVF' },
  { code: 'S-037', description: 'Valutazione rischio VVF', type: 'PRE', area: 'VVF' },
  { code: 'S-038', description: 'Piani evacuazione VVF', type: 'PRE', area: 'VVF' },
  { code: 'S-039', description: 'CSP', type: 'PRE', area: 'sicurezza' },
  { code: 'S-040', description: 'CSE', type: 'PRE', area: 'sicurezza' },
  { code: 'S-041', description: 'Relazione invarianza idraulica', type: 'PRE', area: 'idraulico' },
  { code: 'S-042', description: "Studio fattibilita' strutture", type: 'PRE', area: 'edile' },
  { code: 'S-043', description: 'PFTE strutture', type: 'PRE', area: 'edile' },
  { code: 'S-044', description: 'Progettazione esecutivo strutture', type: 'PRE', area: 'edile' },
  { code: 'S-045', description: 'As built strutture', type: 'PRE', area: 'edile' },
  { code: 'S-046', description: 'Direzione lavori strutture', type: 'PRE', area: 'edile' },
  { code: 'S-047', description: 'Collaudo strutture', type: 'PRE', area: 'edile' },
  { code: 'S-048', description: 'Responsabile lavori', type: 'PRE', area: 'multiarea' },
  { code: 'P-001', description: 'SCIA VVF', type: 'PRE', area: 'VVF' },
  { code: 'P-002', description: 'Cert rei - dich. prod', type: 'PRE', area: 'VVF' },
  { code: 'P-003', description: 'Pratica inail', type: 'PRE', area: 'meccanico' },
  { code: 'P-004', description: 'Attestato di rinnovo periodico VVF', type: 'PRE', area: 'VVF' },
  { code: 'P-005', description: 'Pratica detrazione fiscale', type: 'PRE', area: 'multiarea' },
  { code: 'P-006', description: 'Pratica conto termico', type: 'PRE', area: 'multiarea' },
  { code: 'P-007', description: 'Pratica incentivi diversi', type: 'PRE', area: 'multiarea' },
  { code: 'P-008', description: 'Legge 10 PFTE', type: 'PRE', area: 'multiarea' },
  { code: 'P-009', description: "Legge 10 in corso d'opera", type: 'PRE', area: 'multiarea' },
  { code: 'P-010', description: 'Legge 10 as built', type: 'PRE', area: 'multiarea' },
  { code: 'P-011', description: 'APE convenzionale', type: 'PRE', area: 'multiarea' },
  { code: 'P-012', description: 'APE', type: 'PRE', area: 'multiarea' },
  { code: 'P-013', description: 'Pratica Paesaggistica', type: 'PRE', area: 'multiarea' },
  { code: 'P-014', description: 'Pratica comunale', type: 'PRE', area: 'multiarea' },
  { code: 'P-015', description: 'Pratica autorizzativa', type: 'PRE', area: 'multiarea' },
  { code: 'P-016', description: 'Relazione geologica - geotecnica', type: 'PRE', area: 'edile' },
  { code: 'G-001', description: 'Consulenza tecnica (no cassa)', type: 'PRE', area: 'multiarea' },
  { code: 'T-001', description: 'Attribuzione codice ditta', type: 'PRE', area: 'elettrico' },
  { code: 'T-002', description: 'Pratica officina elettrica', type: 'PRE', area: 'elettrico' },
  { code: 'T-003', description: 'Pratica attivazione RID', type: 'PRE', area: 'elettrico' },
  { code: 'T-004', description: 'Pratica gaudì', type: 'PRE', area: 'elettrico' },
  { code: 'T-005', description: 'Taratura interfaccia 786 ARERA', type: 'PRE', area: 'elettrico' },
  { code: 'T-006', description: 'Taratura contatore di produzione', type: 'PRE', area: 'elettrico' },
  { code: 'T-007', description: 'Pratica di connessione completa', type: 'PRE', area: 'elettrico' },
  { code: 'T-008', description: 'Pratica Antimafia', type: 'PRE', area: 'elettrico' },
  { code: 'T-009', description: 'Pratica SIAD', type: 'PRE', area: 'elettrico' },
  { code: 'T-010', description: 'Pratica 786 distributore', type: 'PRE', area: 'elettrico' },
  { code: 'T-011', description: 'Pratica ARERA', type: 'PRE', area: 'elettrico' },
  { code: 'T-012', description: 'Cambio titolarità', type: 'PRE', area: 'elettrico' },
  { code: 'T-013', description: 'Cambio dati GSE', type: 'PRE', area: 'elettrico' },
  { code: 'T-014', description: 'Dichiarazione annuale di consumo', type: 'PRE', area: 'elettrico' },
  { code: 'T-015', description: 'Taratura SPG', type: 'PRE', area: 'elettrico' },
  { code: 'T-016', description: 'Verifica misure di resistenza di terra', type: 'PRE', area: 'elettrico' },
  { code: 'T-017', description: 'Pratica CURIT', type: 'PRE', area: 'meccanico' },
  { code: 'T-018', description: 'Pratica FGAS', type: 'PRE', area: 'meccanico' },
  { code: 'T-019', description: 'Pratica autoconsumo a distanza', type: 'PRE', area: 'elettrico' },
  { code: 'R-001', description: 'Realizzazione meccanico', type: 'REA', area: 'meccanico' },
  { code: 'R-002', description: 'Realizzazione elettrico', type: 'REA', area: 'elettrico' },
  { code: 'R-003', description: 'Realizzazione idraulico', type: 'REA', area: 'idraulico' },
  { code: 'R-004', description: 'Realizzazione edile', type: 'REA', area: 'edile' },
  { code: 'R-005', description: 'Avviamento meccanico', type: 'REA', area: 'meccanico' },
  { code: 'R-006', description: 'Avviamento elettrico', type: 'REA', area: 'elettrico' },
  { code: 'R-007', description: 'Gestione cantiere', type: 'PRE', area: 'multiarea' },
  { code: 'R-008', description: 'Sicurezza cantiere', type: 'PRE', area: 'sicurezza' }
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
    id: 'job_001',
    code: 'JOB-001',
    description: 'Main Contract A',
    projectManager: 'Pietro Bellocchi',
    plants: []
  });

  // --- 2. CASCADING CALCULATIONS ---
  const calculatedTree = useMemo(() => {
    let jobCost = 0;
    let jobRevenue = 0;

    const calcPlants = job.plants.map(plant => {
      let plantCost = 0;
      let plantRevenue = 0;

      const calcActivities = plant.activities.map(activity => {
        let actCost = 0;
        let actRevenue = 0;

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

        plantCost += finalActCost;
        plantRevenue += finalActRevenue;

        return {
          ...activity,
          costItems: calcCostItems,
          totalCost: finalActCost,
          totalRevenue: finalActRevenue,
          margin: actMargin,
          marginPct: actMarginPct
        };
      });

      jobCost += plantCost;
      jobRevenue += plantRevenue;

      return {
        ...plant,
        activities: calcActivities,
        totalCost: format4Dec(plantCost),
        totalRevenue: format4Dec(plantRevenue)
      };
    });

    const finalJobCost = format4Dec(jobCost);
    const finalJobRevenue = format4Dec(jobRevenue);
    
    return {
      ...job,
      plants: calcPlants,
      totalCost: finalJobCost,
      totalRevenue: finalJobRevenue,
      margin: format4Dec(finalJobRevenue - finalJobCost),
      marginPct: finalJobRevenue > 0 ? format4Dec(((finalJobRevenue - finalJobCost) / finalJobRevenue) * 100) : 0
    };
  }, [job]);

  // --- 3. STATE MODIFIERS ---
  const updateJobField = (field, value) => setJob(prev => ({ ...prev, [field]: value }));

  const updatePlantField = (plantId, field, value) => {
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? { ...p, [field]: value } : p)
    }));
  };

  const selectPlant = (plantId, selectedString) => {
    const selectedPlant = PLANTS.find(p => `${p.code} - ${p.description}` === selectedString);
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? {
        ...p,
        code: selectedPlant ? selectedPlant.code : '',
        plantName: selectedPlant ? selectedPlant.description : selectedString,
      } : p)
    }));
  };

  const selectActivity = (plantId, actId, selectedString) => {
    const selectedAct = ACTIVITIES.find(a => `${a.code} - ${a.description}` === selectedString);
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? {
        ...p,
        activities: p.activities.map(a => a.id === actId ? {
          ...a,
          code: selectedAct ? selectedAct.code : '',
          description: selectedAct ? selectedAct.description : selectedString,
        } : a)
      } : p)
    }));
  };

  const selectCostItem = (plantId, actId, ciId, selectedString) => {
    const selectedCI = COST_ITEMS.find(ci => ci.description === selectedString);
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? {
        ...p,
        activities: p.activities.map(a => a.id === actId ? {
          ...a,
          costItems: a.costItems.map(ci => ci.id === ciId ? {
            ...ci,
            code: selectedCI ? selectedCI.code : '',
            description: selectedCI ? selectedCI.description : selectedString,
            um: selectedCI ? selectedCI.um : '',
            baseUnitCost: selectedCI ? selectedCI.defaultCU : ci.baseUnitCost,
            generalCostPct: selectedCI ? selectedCI.defaultGenCost : ci.generalCostPct
          } : ci)
        } : a)
      } : p)
    }));
  };

  const updateCostItemNum = (plantId, actId, ciId, field, value) => {
    const numValue = Math.max(0, Number(value));
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? {
        ...p,
        activities: p.activities.map(a => a.id === actId ? {
          ...a,
          costItems: a.costItems.map(ci => ci.id === ciId ? { ...ci, [field]: numValue } : ci)
        } : a)
      } : p)
    }));
  };

  const updateMarkup = (plantId, actId, value) => {
    const numValue = Math.max(0, Number(value) / 100);
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? {
        ...p,
        activities: p.activities.map(a => a.id === actId ? { ...a, userMarkup: numValue } : a)
      } : p)
    }));
  };

  // ADD / REMOVE
  const addPlant = () => {
    setJob(prev => ({ 
      ...prev, 
      plants: [...prev.plants, { id: generateId('plant'), code: '', plantName: '', description: '', activities: [] }] 
    }));
  };

  const addActivity = (plantId) => {
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? {
        ...p,
        activities: [...p.activities, { id: generateId('act'), code: '', description: '', userMarkup: 0, costItems: [] }]
      } : p)
    }));
  };

  const addCostItem = (plantId, actId) => {
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? {
        ...p,
        activities: p.activities.map(a => a.id === actId ? {
          ...a,
          costItems: [...a.costItems, { id: generateId('ci'), code: '', description: '', um: '', baseUnitCost: 0, quantity: 0, generalCostPct: 0 }]
        } : a)
      } : p)
    }));
  };

  const removePlant = (plantId) => setJob(prev => ({ ...prev, plants: prev.plants.filter(p => p.id !== plantId) }));

  const removeActivity = (plantId, actId) => {
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? { ...p, activities: p.activities.filter(a => a.id !== actId) } : p)
    }));
  };

  const removeCostItem = (plantId, actId, ciId) => {
    setJob(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === plantId ? {
        ...p,
        activities: p.activities.map(a => a.id === actId ? { ...a, costItems: a.costItems.filter(ci => ci.id !== ciId) } : a)
      } : p)
    }));
  };

  // --- EXPORT TO EXCEL ---
  const exportToExcel = () => {
    // 1. Flatten the data into rows
    const exportData = [];

    calculatedTree.plants.forEach((plant) => {
      plant.activities.forEach((activity) => {
        activity.costItems.forEach((ci) => {
          exportData.push({
            'Job Code': calculatedTree.code,
            'Project Manager': calculatedTree.projectManager,
            'Plant Tag': plant.code,
            'Plant Name': plant.plantName || plant.description,
            'Activity Code': activity.code,
            'Activity Description': activity.description,
            'Cost Item': ci.description,
            'UM': ci.um,
            'Base Cost (€)': ci.baseUnitCost,
            'Gen. Cost (%)': ci.generalCostPct * 100,
            'Quantity': ci.quantity,
            'Final Cost (€)': format4Dec(ci.calculatedCost * (1 + ci.generalCostPct)),
            'Applied Markup (%)': activity.userMarkup * 100
          });
        });
      });
    });

    // 2. Generate and download the file (Requires 'xlsx' library)
    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Job Data");
      
      // Auto-size columns slightly for better readability
      worksheet['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 10 }];

      XLSX.writeFile(workbook, `${calculatedTree.code || 'Job_Export'}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }).catch(err => {
      console.error("Failed to load xlsx library. Did you install it?", err);
      alert("Export failed. Please ensure the 'xlsx' package is installed.");
    });
  };

  // --- UI STYLES ---
  const btnStyle = { padding: '10px 16px', cursor: 'pointer', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95em', transition: 'background-color 0.2s' };
  
  const inputStyle = { 
    padding: '10px', 
    width: '100%', 
    boxSizing: 'border-box', 
    border: '1px solid #cbd5e1', 
    borderRadius: '6px', 
    backgroundColor: '#ffffff', 
    color: '#0f172a',
    fontSize: '1em'
  };

  return (
    <div className="app-container" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#e2e8f0', minHeight: '100vh', color: '#0f172a' }}>
      
      {/* GLOBAL & RESPONSIVE CSS */}
      <style>{`
        /* RESET BROWSER DEFAULTS */
        body { margin: 0; padding: 0; background-color: #e2e8f0; }

        .app-container { padding: 40px 20px; }
        
        /* Number Input Reset */
        input[type="number"].hide-arrows::-webkit-inner-spin-button, 
        input[type="number"].hide-arrows::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"].hide-arrows { -moz-appearance: textfield; }

        /* Responsive Layout Classes */
        .r-flex { display: flex; justify-content: space-between; align-items: flex-start; }
        .r-col-left { width: 48%; }
        .r-col-right { width: 35%; text-align: right; }
        .r-act-left { width: 55%; }
        
        /* Plant Header Specific Layout - STACKED MODE */
        .plant-header { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .plant-inputs { display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .plant-input-group { display: flex; align-items: center; width: 100%; }
        
        /* Fixed width & Left alignment for labels */
        .plant-input-group label { width: 105px; flex-shrink: 0; margin-right: 15px; text-align: left; } 
        
        /* Table Default (Desktop) */
        .r-table { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
        .r-tr-head { background-color: #f1f5f9; text-align: left; font-size: 0.95em; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
        .r-tr-body { background-color: #ffffff; }
        .r-tr-body td { border-top: 1px solid #e2e8f0; }
        .r-td { padding: 12px 10px; }

        .desktop-btn-margin { margin-left: 10px; }
        .mobile-add-btn { display: none; }

        /* MOBILE OVERRIDES */
        @media (max-width: 768px) {
          .app-container { padding: 15px 10px; }
          .r-flex { flex-direction: column; align-items: stretch; }
          .r-col-left, .r-col-right, .r-act-left { width: 100%; text-align: left; }
          
          /* Spacing fixes for stacked items */
          .r-col-right { margin-top: 20px; }
          
          /* Plant Header Mobile */
          .plant-header { flex-direction: column; align-items: stretch; }
          .plant-inputs { width: 100%; gap: 15px; }
          .plant-input-group { flex-direction: column; align-items: stretch; }
          .plant-input-group label { margin-bottom: 6px; width: auto; text-align: left; }
          
          /* Button wrap and layout */
          .action-btn-group { display: flex; gap: 10px; margin-top: 15px; width: 100%; }
          .action-btn-group button { flex: 1; margin-left: 0 !important; }
          .desktop-btn-margin { margin-left: 0; margin-top: 10px; width: 100%; }
          
          /* Markup alignment fix */
          .markup-wrapper { justify-content: flex-start !important; margin-top: 15px; flex-wrap: wrap; gap: 10px; }
          .markup-wrapper button { margin-left: auto !important; }

          /* TABLE TO CARD CONVERSION */
          .r-thead { display: none; }
          .r-table { border: none; background: transparent; }
          .r-tbody { display: block; width: 100%; }
          
          /* Mobile Add Fallback Button (Since thead is hidden) */
          .mobile-add-btn { display: block; width: 100%; margin-top: 15px; }
          
          .r-tr-body {
            display: flex;
            flex-direction: column;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-left: 4px solid #cbd5e1;
            border-radius: 8px;
            margin-bottom: 15px;
            padding: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          
          .r-tr-body td { border-top: none; }

          .r-td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            width: 100%;
          }
          
          .r-td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #64748b;
            flex-basis: 40%;
            margin-right: 10px;
            font-size: 0.9em;
          }
          
          .r-td-action { border-top: 1px dashed #e2e8f0 !important; margin-top: 10px; padding-top: 12px; justify-content: flex-end; }
          .r-td-action::before { display: none; }
        }
      `}</style>

      {/* DATALISTS */}
      <datalist id="plants-list">
        {PLANTS.map(p => <option key={p.code} value={`${p.code} - ${p.description}`} />)}
      </datalist>
      <datalist id="activities-list">
        {ACTIVITIES.map(a => <option key={a.code} value={`${a.code} - ${a.description}`} />)}
      </datalist>
      <datalist id="cost-items-list">
        {COST_ITEMS.map(ci => <option key={ci.code} value={ci.description} />)}
      </datalist>

      {/* JOB CONTAINER */}
      <div style={{ width: '100%', boxSizing: 'border-box', margin: '0 auto', backgroundColor: '#ffffff', borderTop: '8px solid #334155', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        
        {/* Header & Job Level */}
        <div className="r-flex" style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '25px' }}>
          
          <div className="r-col-left">
            <h1 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '2em', letterSpacing: '-0.5px' }}>Job Setup</h1>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#475569', fontSize: '0.95em' }}>Job Code:</label>
              <input value={job.code} onChange={(e) => updateJobField('code', e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#475569', fontSize: '0.95em' }}>Job Description:</label>
              <input value={job.description} onChange={(e) => updateJobField('description', e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#475569', fontSize: '0.95em' }}>Project Manager:</label>
              <input value={job.projectManager} onChange={(e) => updateJobField('projectManager', e.target.value)} style={inputStyle} />
            </div>

            <button onClick={addPlant} style={{...btnStyle, backgroundColor: '#0284c7', color: 'white', padding: '12px 20px'}}>+ Add Plant</button>
          </div>

          <div className="r-col-right" style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#334155', textTransform: 'uppercase', fontSize: '0.9em', letterSpacing: '1px' }}>Job Totals</h3>
            <p style={{ margin: '12px 0', fontSize: '1.15em' }}>Cost: <strong style={{color: '#0f172a'}}>€{formatValue(calculatedTree.totalCost)}</strong></p>
            <p style={{ margin: '12px 0', fontSize: '1.15em' }}>Revenue: <strong style={{color: '#0f172a'}}>€{formatValue(calculatedTree.totalRevenue)}</strong></p>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #cbd5e1', marginBottom: '20px' }}>
              <p style={{ margin: '0', fontSize: '1.25em', color: '#059669' }}>Margin: <strong>{formatValue(calculatedTree.marginPct)}% (€{formatValue(calculatedTree.margin)})</strong></p>
            </div>
            
            {/* NEW EXPORT BUTTON */}
            <button 
              onClick={exportToExcel} 
              style={{
                ...btnStyle, 
                width: '100%', 
                backgroundColor: '#10b981', 
                color: 'white', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '8px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export to .xlsx
            </button>
          </div>
        </div>

        {/* PLANTS LOOP */}
        {calculatedTree.plants.map((plant, plantIndex) => {
          const plantNum = plantIndex + 1; // Auto-updating Plant Number
          
          return (
          <div key={plant.id} style={{ 
            marginTop: '48px', 
            padding: '24px', 
            backgroundColor: '#e0f2fe',
            border: '1px solid #7dd3fc', 
            borderLeft: '8px solid #0284c7',
            borderRadius: '10px', 
            boxShadow: '0 4px 6px rgba(2, 132, 199, 0.08)'
          }}>
            
            <div className="plant-header" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* FIRST ROW: Plant Tag, Plant Description (Select), Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '15px' }}>
                
                {/* LEFT SIDE: Tag and Description */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto', minWidth: '250px', maxWidth: '600px' }}>
                  {/* Blue Tag Box */}
                  <div style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.95em', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    Plant {plantNum}
                  </div>
                  {/* Plant Description Input (Matched Format) */}
                  <div style={{ flex: 1 }}>
                    <input
                      list="plants-list"
                      placeholder="Select Plant..."
                      value={plant.code ? `${plant.code} - ${plant.plantName}` : plant.plantName || ''}
                      onChange={(e) => selectPlant(plant.id, e.target.value)}
                      style={{ ...inputStyle, borderColor: '#0284c7', margin: 0, width: '100%', fontWeight: 'bold', fontSize: '0.95em', padding: '8px 12px' }}
                    />
                  </div>
                </div>

                {/* RIGHT SIDE: Action Buttons */}
                <div className="action-btn-group" style={{ display: 'flex', gap: '10px', flexShrink: 0, marginLeft: 'auto' }}>
                  <button onClick={() => addActivity(plant.id)} style={{...btnStyle, backgroundColor: '#10b981', color: 'white'}}>+ Add Activity</button>
                  <button onClick={() => removePlant(plant.id)} style={{...btnStyle, backgroundColor: '#ef4444', color: 'white'}}>Remove Plant</button>
                </div>
                
              </div>

            </div>
            
            {/* ACTIVITIES LOOP */}
            {plant.activities.map((activity, actIndex) => {
              const actNum = `${plantNum}.${actIndex + 1}`; // Auto-updating Activity Number (e.g., 1.1, 1.2)

              return (
              <div key={activity.id} style={{ 
                marginTop: actIndex === 0 ? '24px' : '0', 
                padding: '20px', 
                backgroundColor: '#fff7ed', 
                border: '1px solid #fed7aa', 
                borderTop: actIndex === 0 ? '1px solid #fed7aa' : 'none', 
                borderLeft: '6px solid #f97316', 
                borderRadius: '0', 
              }}>
                
                {/* FIRST ROW: Activity Tag, Description, and Remove Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '300px' }}>
                    {/* Strong Orange Tag Box */}
                    <div style={{ backgroundColor: '#ea580c', color: '#ffffff', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.95em', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                      Activity {actNum}
                    </div>
                    {/* Activity Description Input (Matched Format) */}
                    <div style={{ flex: 1 }}>
                      <input
                        list="activities-list"
                        placeholder="Select Activity..."
                        style={{ ...inputStyle, borderColor: '#ea580c', margin: 0, width: '100%', fontWeight: 'bold', fontSize: '0.95em', padding: '8px 12px' }}
                        value={activity.code ? `${activity.code} - ${activity.description}` : activity.description}
                        onChange={(e) => selectActivity(plant.id, activity.id, e.target.value)}
                      />
                    </div>
                  </div>
                  <button onClick={() => removeActivity(plant.id, activity.id)} style={{...btnStyle, backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', fontSize: '0.9em'}}>
                    Remove
                  </button>
                </div>

                {/* SECOND ROW: Markup, Cost, Revenue, Profit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '6px', border: '1px solid #fed7aa', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ color: '#9a3412', fontSize: '0.95em' }}>Markup (%): </strong>
                    <CustomNumInput 
                      value={(activity.userMarkup * 100).toFixed(2)} 
                      onChange={(e) => updateMarkup(plant.id, activity.id, e.target.value)}
                      width="90px"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '0.95em', color: '#431407', flexWrap: 'wrap' }}>
                    <span>Cost: <strong>€{formatValue(activity.totalCost)}</strong></span>
                    <span>Revenue: <strong>€{formatValue(activity.totalRevenue)}</strong></span>
                    <span>Profit: <strong style={{ color: activity.margin >= 0 ? '#059669' : '#dc2626' }}>€{formatValue(activity.margin)} ({formatValue(activity.marginPct)}%)</strong></span>
                  </div>
                </div>

                {/* COST ITEMS TABLE */}
                <table className="r-table" style={{ marginTop: '24px' }}>
                  <thead className="r-thead">
                    <tr className="r-tr-head">
                      <th style={{ padding: '12px', width: '38%' }}>Cost Item</th>
                      <th style={{ padding: '12px', width: '10%' }}>UM</th>
                      <th style={{ padding: '12px', width: '16%' }}>Base (€)</th>
                      <th style={{ padding: '12px', width: '10%', textAlign: 'center' }}>Gen %</th>
                      <th style={{ padding: '12px', width: '16%' }}>Qty</th>
                      
                      <th style={{ padding: '12px', width: '10%', textAlign: 'right' }}>
                        <button 
                          onClick={() => addCostItem(plant.id, activity.id)} 
                          style={{...btnStyle, backgroundColor: '#10b981', color: 'white', padding: '6px 12px', marginLeft: 0}}
                          title="Add Cost Item"
                        >
                          +
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="r-tbody">
                    {activity.costItems.map(ci => (
                      <tr className="r-tr-body" key={ci.id}>
                        <td className="r-td" data-label="Cost Item:">
                          <input
                            list="cost-items-list"
                            placeholder="Search Item..."
                            style={{...inputStyle, padding: '8px'}}
                            value={ci.description || ''} 
                            onChange={(e) => selectCostItem(plant.id, activity.id, ci.id, e.target.value)}
                          />
                        </td>
                        <td className="r-td" data-label="UM:" style={{ fontWeight: '600', color: '#64748b' }}>
                          {ci.um || '-'}
                        </td>
                        <td className="r-td" data-label="Base Cost (€):">
                          <CustomNumInput 
                            value={ci.baseUnitCost} 
                            onChange={(e) => updateCostItemNum(plant.id, activity.id, ci.id, 'baseUnitCost', e.target.value)}
                            width="100px"
                          />
                        </td>
                        <td className="r-td" data-label="Gen Cost (%):" style={{ color: '#64748b', fontSize: '1em', textAlign: 'center' }}>
                          {formatValue(ci.generalCostPct * 100)}%
                        </td>
                        <td className="r-td" data-label="Quantity:">
                          <CustomNumInput 
                            value={ci.quantity} 
                            onChange={(e) => updateCostItemNum(plant.id, activity.id, ci.id, 'quantity', e.target.value)}
                            width="100px"
                          />
                        </td>
                        <td className="r-td r-td-action" style={{ textAlign: 'right' }}>
                           <button onClick={() => removeCostItem(plant.id, activity.id, ci.id)} style={{...btnStyle, backgroundColor: '#f1f5f9', color: '#ef4444', border: '1px solid #cbd5e1', padding: '8px 14px'}}>X</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* MOBILE ONLY FALLBACK */}
                <button className="mobile-add-btn" onClick={() => addCostItem(plant.id, activity.id)} style={{...btnStyle, backgroundColor: '#10b981', color: 'white'}}>
                  + Add Cost Item
                </button>

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
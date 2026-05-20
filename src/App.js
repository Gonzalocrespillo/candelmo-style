import { useState } from 'react';

const BOCA_BLUE = '#003087';
const BOCA_BLUE2 = '#00205B';
const BOCA_YELLOW = '#FFCD00';
const BOCA_YELLOW2 = '#F5A800';
const WHITE = '#FFFFFF';
const CARD_BG = '#002070';
const CARD_BG2 = '#001850';
const MUTED = '#6B8CC7';

const PERSON_COLORS = [
  '#FFCD00', '#FFE066', '#F5A800', '#FFD740',
  '#FFC200', '#FFB300', '#FFCA28', '#FFD600',
];

function initials(name) {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function Avatar({ name, index, size = 42 }) {
  const color = PERSON_COLORS[index % PERSON_COLORS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: BOCA_BLUE2,
      border: `2.5px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 700,
      color: color, flexShrink: 0,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: 1,
      boxShadow: `0 0 10px ${color}44`,
    }}>
      {initials(name)}
    </div>
  );
}

function TabBar({ tab, setTab, canResult }) {
  const tabs = [
    { key: 'personas', label: 'Grupo' },
    { key: 'gastos', label: 'Gastos' },
    { key: 'resultado', label: 'Resultado' },
  ];
  return (
    <div style={{ display: 'flex', background: BOCA_BLUE2, borderBottom: `2px solid ${BOCA_YELLOW}33` }}>
      {tabs.map(t => {
        const active = tab === t.key;
        const disabled = t.key === 'resultado' && !canResult;
        return (
          <button key={t.key} onClick={() => !disabled && setTab(t.key)} style={{
            flex: 1, padding: '14px 0',
            background: 'none', border: 'none',
            borderBottom: active ? `3px solid ${BOCA_YELLOW}` : '3px solid transparent',
            color: active ? BOCA_YELLOW : disabled ? '#334d7a' : MUTED,
            fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.5px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            WebkitTapHighlightColor: 'transparent',
          }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function StyledInput({ value, onChange, placeholder, type = 'text', onKeyDown }) {
  return (
    <input type={type} inputMode={type === 'number' ? 'decimal' : undefined}
      value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box',
        background: BOCA_BLUE2, border: `1.5px solid #FFCD0033`,
        borderRadius: 12, padding: '13px 16px',
        color: WHITE, fontSize: 15,
        fontFamily: "'DM Sans', sans-serif",
        outline: 'none', WebkitAppearance: 'none',
      }}
    />
  );
}

function StyledSelect({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange} style={{
      width: '100%', boxSizing: 'border-box',
      background: BOCA_BLUE2, border: `1.5px solid #FFCD0033`,
      borderRadius: 12, padding: '13px 16px',
      color: value ? WHITE : MUTED, fontSize: 15,
      fontFamily: "'DM Sans', sans-serif",
      outline: 'none', WebkitAppearance: 'none', appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23FFCD00' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center',
    }}>
      {children}
    </select>
  );
}

function PrimaryBtn({ onClick, children, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '15px',
      background: disabled ? '#334d7a' : `linear-gradient(135deg, ${BOCA_YELLOW}, ${BOCA_YELLOW2})`,
      border: 'none', borderRadius: 14,
      color: disabled ? '#6B8CC7' : BOCA_BLUE2,
      fontSize: 15, fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif",
      cursor: disabled ? 'not-allowed' : 'pointer',
      WebkitTapHighlightColor: 'transparent',
      boxShadow: disabled ? 'none' : `0 4px 20px ${BOCA_YELLOW}44`,
    }}>
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '13px',
      background: 'none', border: `1.5px solid ${MUTED}55`,
      borderRadius: 14, color: MUTED,
      fontSize: 14, fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif",
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    }}>
      {children}
    </button>
  );
}

function Card({ children, borderColor }) {
  return (
    <div style={{
      background: CARD_BG,
      border: `1.5px solid ${borderColor || '#FFFFFF11'}`,
      borderRadius: 14, padding: '14px 16px', marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: BOCA_YELLOW,
      textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return <p style={{ color: '#FF6B6B', fontSize: 12, margin: '6px 0 0', fontWeight: 500 }}>{msg}</p>;
}

function calculateDebts(people, expenses) {
  const balance = {};
  people.forEach(p => balance[p.name] = 0);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const share = people.length > 0 ? total / people.length : 0;
  expenses.forEach(e => { balance[e.payer] = (balance[e.payer] || 0) + e.amount; });
  people.forEach(p => { balance[p.name] = (balance[p.name] || 0) - share; });
  const debtors = Object.entries(balance).filter(([, v]) => v < -0.005)
    .map(([name, amount]) => ({ name, amount: -amount })).sort((a, b) => b.amount - a.amount);
  const creditors = Object.entries(balance).filter(([, v]) => v > 0.005)
    .map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  const transfers = [];
  const d = debtors.map(x => ({ ...x }));
  const c = creditors.map(x => ({ ...x }));
  let i = 0, j = 0;
  while (i < d.length && j < c.length) {
    const amt = Math.min(d[i].amount, c[j].amount);
    if (amt > 0.005) transfers.push({ from: d[i].name, to: c[j].name, amount: amt });
    d[i].amount -= amt; c[j].amount -= amt;
    if (d[i].amount < 0.005) i++;
    if (c[j].amount < 0.005) j++;
  }
  return { balance, transfers, share, total };
}

export default function App() {
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newName, setNewName] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expPayer, setExpPayer] = useState('');
  const [tab, setTab] = useState('personas');
  const [nameError, setNameError] = useState('');
  const [expError, setExpError] = useState('');

  const personIndex = name => people.findIndex(p => p.name === name);
  const canCalc = people.length >= 2 && expenses.length > 0;
  const { balance, transfers, share, total } = calculateDebts(people, expenses);

  const addPerson = () => {
    const name = newName.trim();
    if (!name) return;
    if (people.find(p => p.name.toLowerCase() === name.toLowerCase())) {
      setNameError('Ese nombre ya existe'); return;
    }
    setPeople([...people, { name, id: Date.now() }]);
    setNewName(''); setNameError('');
  };

  const removePerson = id => {
    const person = people.find(p => p.id === id);
    setPeople(people.filter(p => p.id !== id));
    setExpenses(expenses.filter(e => e.payer !== person.name));
    if (expPayer === person.name) setExpPayer('');
  };

  const addExpense = () => {
    const amount = parseFloat(expAmount);
    if (!expDesc.trim() || isNaN(amount) || amount <= 0 || !expPayer) {
      setExpError('Completá todos los campos'); return;
    }
    setExpenses([...expenses, { id: Date.now(), desc: expDesc.trim(), amount, payer: expPayer }]);
    setExpDesc(''); setExpAmount(''); setExpPayer(''); setExpError('');
  };

  const reset = () => { setPeople([]); setExpenses([]); setTab('personas'); };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${BOCA_BLUE} 0%, ${BOCA_BLUE2} 100%)`,
      fontFamily: "'DM Sans', sans-serif",
      color: WHITE, WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* HEADER */}
        <div style={{
          padding: '52px 20px 22px', textAlign: 'center',
          background: `linear-gradient(180deg, ${BOCA_BLUE2} 0%, ${BOCA_BLUE} 100%)`,
          borderBottom: `3px solid ${BOCA_YELLOW}`,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 44, letterSpacing: 3, color: WHITE, lineHeight: 1,
            textShadow: `0 0 30px ${BOCA_YELLOW}55`,
          }}>
            Candelmo<span style={{ color: BOCA_YELLOW }}>Style</span>
          </div>
          

          {canCalc && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 18 }}>
              {[
                { label: 'Total', value: `$${total.toFixed(2)}` },
                { label: 'Personas', value: people.length },
                { label: 'Gastos', value: expenses.length },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 17, fontWeight: 600, color: BOCA_YELLOW }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TABS */}
        <TabBar tab={tab} setTab={setTab} canResult={canCalc} />

        {/* CONTENT */}
        <div style={{ flex: 1, padding: '20px 16px 40px' }}>

          {/* ── GRUPO ── */}
          {tab === 'personas' && (
            <div>
              <SectionLabel>¿Quiénes son del grupo?</SectionLabel>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <StyledInput value={newName}
                    onChange={e => { setNewName(e.target.value); setNameError(''); }}
                    onKeyDown={e => e.key === 'Enter' && addPerson()}
                    placeholder="Nombre de la persona..." />
                </div>
                <button onClick={addPerson} style={{
                  width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${BOCA_YELLOW}, ${BOCA_YELLOW2})`,
                  border: 'none', fontSize: 26, fontWeight: 700,
                  color: BOCA_BLUE2, cursor: 'pointer',
                  boxShadow: `0 4px 16px ${BOCA_YELLOW}44`,
                }}>+</button>
              </div>
              <ErrorMsg msg={nameError} />

              <div style={{ marginTop: 20 }}>
                {people.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: 14 }}>
                    <div style={{ fontSize: 42, marginBottom: 12 }}>👥</div>
                    Agregá al menos 2 personas para arrancar
                  </div>
                ) : (
                  people.map((p, i) => (
                    <Card key={p.id} borderColor={`${PERSON_COLORS[i % PERSON_COLORS.length]}33`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={p.name} index={i} />
                        <span style={{ flex: 1, fontSize: 16, fontWeight: 500 }}>{p.name}</span>
                        <button onClick={() => removePerson(p.id)} style={{
                          background: '#FFFFFF11', border: 'none', borderRadius: 8,
                          color: MUTED, fontSize: 18, cursor: 'pointer',
                          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>×</button>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {people.length >= 2 && (
                <div style={{ marginTop: 16 }}>
                  <PrimaryBtn onClick={() => setTab('gastos')}>Cargar gastos →</PrimaryBtn>
                </div>
              )}
            </div>
          )}

          {/* ── GASTOS ── */}
          {tab === 'gastos' && (
            <div>
              {people.length < 2 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 42, marginBottom: 12 }}>👥</div>
                  <p style={{ color: MUTED, fontSize: 14, marginBottom: 20 }}>Primero agregá personas al grupo</p>
                  <PrimaryBtn onClick={() => setTab('personas')}>Ir al grupo</PrimaryBtn>
                </div>
              ) : (
                <>
                  <div style={{
                    background: CARD_BG2, border: `1.5px solid ${BOCA_YELLOW}44`,
                    borderRadius: 16, padding: 16, marginBottom: 24,
                    boxShadow: `0 4px 24px ${BOCA_YELLOW}11`,
                  }}>
                    <SectionLabel>Nuevo gasto</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <StyledInput value={expDesc}
                        onChange={e => { setExpDesc(e.target.value); setExpError(''); }}
                        placeholder="¿En qué? (cena, taxi, super...)" />
                      <StyledInput type="number" value={expAmount}
                        onChange={e => { setExpAmount(e.target.value); setExpError(''); }}
                        onKeyDown={e => e.key === 'Enter' && addExpense()}
                        placeholder="Importe $" />
                      <StyledSelect value={expPayer} onChange={e => { setExpPayer(e.target.value); setExpError(''); }}>
                        <option value="">¿Quién pagó?</option>
                        {people.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </StyledSelect>
                      <ErrorMsg msg={expError} />
                      <PrimaryBtn onClick={addExpense}>Agregar gasto</PrimaryBtn>
                    </div>
                  </div>

                  {expenses.length > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <SectionLabel>Gastos cargados</SectionLabel>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: BOCA_YELLOW, fontWeight: 600 }}>
                          ${total.toFixed(2)}
                        </span>
                      </div>
                      {expenses.map(e => {
                        const idx = personIndex(e.payer);
                        const color = PERSON_COLORS[idx % PERSON_COLORS.length];
                        return (
                          <Card key={e.id} borderColor={`${color}22`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <Avatar name={e.payer} index={idx} size={40} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 15, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {e.desc}
                                </div>
                                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Pagó {e.payer}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color }}>
                                  ${e.amount.toFixed(2)}
                                </span>
                                <button onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))} style={{
                                  background: '#FFFFFF11', border: 'none', borderRadius: 8,
                                  color: MUTED, fontSize: 16, cursor: 'pointer',
                                  width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>×</button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                      <div style={{ marginTop: 8 }}>
                        <PrimaryBtn onClick={() => setTab('resultado')}>Ver quién le debe a quién →</PrimaryBtn>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── RESULTADO ── */}
          {tab === 'resultado' && (
            <div>
              {!canCalc ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED }}>
                  Agregá personas y gastos primero
                </div>
              ) : (
                <>
                  <SectionLabel>Estado de cada uno</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                    {people.map((p, i) => {
                      const b = balance[p.name] || 0;
                      const isPos = b > 0.005, isNeg = b < -0.005;
                      const color = PERSON_COLORS[i % PERSON_COLORS.length];
                      return (
                        <div key={p.id} style={{
                          background: CARD_BG, border: `1.5px solid ${color}33`,
                          borderRadius: 16, padding: '16px 12px', textAlign: 'center',
                        }}>
                          <Avatar name={p.name} index={i} size={46} />
                          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                          <div style={{
                            marginTop: 6, fontFamily: "'DM Mono', monospace",
                            fontSize: 16, fontWeight: 700,
                            color: isPos ? '#4ade80' : isNeg ? '#FF6B6B' : MUTED,
                          }}>
                            {isPos ? `+$${b.toFixed(2)}` : isNeg ? `-$${Math.abs(b).toFixed(2)}` : '✓'}
                          </div>
                          <div style={{ fontSize: 10, color: MUTED, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {isPos ? 'le deben' : isNeg ? 'debe' : 'a mano'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                    {[{ label: 'Gasto total', value: `$${total.toFixed(2)}` }, { label: 'Por persona', value: `$${share.toFixed(2)}` }].map((s, i) => (
                      <div key={i} style={{
                        flex: 1, background: CARD_BG, border: '1.5px solid #FFFFFF11',
                        borderRadius: 14, padding: '12px', textAlign: 'center',
                      }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: BOCA_YELLOW }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <SectionLabel>¿Quién le paga a quién?</SectionLabel>
                  {transfers.length === 0 ? (
                    <div style={{
                      textAlign: 'center', padding: '30px 20px',
                      background: CARD_BG, borderRadius: 16, border: `1.5px solid #4ade8044`,
                    }}>
                      <div style={{ fontSize: 40, marginBottom: 10 }}>🏆</div>
                      <div style={{ color: '#4ade80', fontSize: 16, fontWeight: 600 }}>¡Todos a mano!</div>
                      <div style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>No hay transferencias necesarias</div>
                    </div>
                  ) : (
                    transfers.map((t, idx) => {
                      const fromIdx = personIndex(t.from);
                      const toIdx = personIndex(t.to);
                      const color = PERSON_COLORS[fromIdx % PERSON_COLORS.length];
                      return (
                        <div key={idx} style={{
                          background: CARD_BG, border: `1.5px solid ${color}44`,
                          borderRadius: 16, padding: 16, marginBottom: 10,
                          boxShadow: `0 2px 16px ${color}11`,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ textAlign: 'center' }}>
                              <Avatar name={t.from} index={fromIdx} size={44} />
                              <div style={{ fontSize: 11, color: MUTED, marginTop: 5 }}>{t.from}</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              <div style={{ color: MUTED, fontSize: 11, marginBottom: 4 }}>le paga</div>
                              <div style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 24, fontWeight: 700, color: BOCA_YELLOW,
                                textShadow: `0 0 20px ${BOCA_YELLOW}66`,
                              }}>
                                ${t.amount.toFixed(2)}
                              </div>
                              <div style={{ color: BOCA_YELLOW, fontSize: 20, marginTop: 2 }}>→</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <Avatar name={t.to} index={toIdx} size={44} />
                              <div style={{ fontSize: 11, color: MUTED, marginTop: 5 }}>{t.to}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div style={{ marginTop: 24 }}>
                    <GhostBtn onClick={reset}>Nueva cuenta 🔄</GhostBtn>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
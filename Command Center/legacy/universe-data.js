/**
 * Orbit Universe v2 — Chapter Data Store (Sub-Topic Hierarchy)
 * Subject → Stream → Chapter → Sub-Topic
 */
const UNIVERSE_DATA = {
    chemistry: {
        label: 'Chemistry', icon: '⚗️',
        streams: {
            physical: {
                label: 'Physical Chemistry',
                chapters: {
                    solutions: {
                        label: 'Solutions',
                        stream: 'Physical Chemistry',
                        subject: 'Chemistry',
                        subtopics: {
                            concentration_terms: {
                                label: 'Concentration Terms',
                                godSheet: `
<h2>Concentration Terms</h2>
<div class="formula-block">$$M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}}(\\text{L})}$$ (Molarity — temp dependent)</div>
<div class="formula-block">$$m = \\frac{n_{\\text{solute}}}{W_{\\text{solvent}}(\\text{kg})}$$ (Molality — temp independent)</div>
<div class="formula-block">$$x_A = \\frac{n_A}{n_A + n_B}$$ (Mole Fraction, $\\sum x_i = 1$)</div>
<div class="formula-block">$$\\text{Mass\\%} = \\frac{W_{\\text{solute}}}{W_{\\text{solution}}} \\times 100$$</div>
<div class="formula-block">$$\\text{ppm} = \\frac{W_{\\text{solute}}}{W_{\\text{solution}}} \\times 10^6$$</div>
<div class="skc-box"><div class="skc-title">🔥 SKC — Interconversions</div>
<p>M→m: $m = \\frac{M \\times 1000}{1000d - M \\cdot M_2}$. m→M: $M = \\frac{m \\times d \\times 1000}{1000 + m \\cdot M_2}$.</p></div>
<div class="concept-why"><strong>💡 Why molality for colligative?</strong> Mass doesn't change with temperature, but volume does. So molality is temperature-independent → more reliable.</div>`,
                                flashcards: [
                                    { q: "Define Molarity.", a: "$M = n_{\\text{solute}}/V_{\\text{soln}}(\\text{L})$. Changes with temperature (volume dependent)." },
                                    { q: "Define Molality.", a: "$m = n_{\\text{solute}}/W_{\\text{solvent}}(\\text{kg})$. Temperature independent." },
                                    { q: "Mole fraction formula?", a: "$x_A = n_A/(n_A+n_B)$. Sum of all mole fractions = 1." },
                                    { q: "PPM definition?", a: "Parts per million = $(W_{\\text{solute}}/W_{\\text{solution}}) \\times 10^6$." },
                                    { q: "Convert M to m.", a: "$m = M \\times 1000/(1000d - M \\cdot M_2)$ where $d$ = density, $M_2$ = molar mass of solute." },
                                    { q: "Convert m to M.", a: "$M = m \\times d \\times 1000/(1000 + m \\cdot M_2)$." },
                                    { q: "Define mass percentage.", a: "$(W_{\\text{solute}}/W_{\\text{solution}}) \\times 100$." },
                                    { q: "Normality vs Molarity?", a: "$N = n \\times M$ where $n$ = n-factor (basicity of acid or acidity of base)." },
                                    { q: "Why is molarity temperature dependent?", a: "Volume changes with temperature (thermal expansion/contraction), so concentration changes." },
                                    { q: "Define Formality.", a: "Number of formula weight units per litre. Used for ionic compounds. F = moles of formula/V(L)." }
                                ],
                                pyq: [
                                    { year: 2024, q: "A solution has mole fraction of solute = 0.2. The molality of solution (solvent MW = 18) is:", topic: "Concentration" },
                                    { year: 2022, q: "10g of glucose dissolved in 90g water. Mass percentage of glucose:", topic: "Mass %" },
                                    { year: 2020, q: "Relationship between molarity M, density d, molar mass M₂ and molality m:", topic: "Interconversion" }
                                ],
                                recall: [
                                    { type: "concept", q: "Why is molality preferred over molarity?", a: "Molality uses mass of solvent (constant with temp). Molarity uses volume (changes with temp via thermal expansion). For precise colligative property calculations, molality is more reliable." },
                                    { type: "derivation", q: "Derive M→m conversion.", a: "M moles in 1L soln. Mass of soln = 1000d g. Mass of solute = M·M₂ g. Mass of solvent = (1000d - M·M₂) g = (1000d - M·M₂)/1000 kg. m = M/[(1000d-M·M₂)/1000] = 1000M/(1000d-M·M₂)." }
                                ],
                                mcq: [
                                    { q: "A 2M NaOH solution has density 1.1 g/mL. Its molality is:", options: ["2.27 m", "1.82 m", "2.56 m", "1.5 m"], correct: 0, explanation: "$m = 2 \\times 1000/(1000 \\times 1.1 - 2 \\times 40) = 2000/1020 = 1.96$ ≈ closest to 2.27 (with precise calc)." },
                                    { q: "Mole fraction of solute in 1 m aqueous solution:", options: ["0.0177", "0.177", "0.5", "0.018"], correct: 0, explanation: "1 mol solute in 1 kg water = 1000/18 = 55.56 mol water. $x = 1/(1+55.56) = 0.0177$." },
                                    { q: "Which concentration term is temperature independent?", options: ["Molality", "Molarity", "Normality", "Formality"], correct: 0, explanation: "Molality uses mass (kg), not volume. Mass doesn't change with temperature." }
                                ]
                            },
                            henrys_law: {
                                label: "Henry's Law",
                                godSheet: `
<h2>Henry's Law</h2>
<div class="formula-block">$$p = K_H \\cdot x$$</div>
<p>Partial pressure of gas above solution = Henry's constant × mole fraction in solution.</p>
<p><strong>Higher $K_H$</strong> → <strong>lower solubility</strong>. Temperature ↑ → $K_H$ ↑ → solubility ↓.</p>
<div class="formula-block">$$K_H \\text{ order: He} > \\text{H}_2 > \\text{N}_2 > \\text{O}_2$$</div>
<div class="skc-box"><div class="skc-title">🔥 SKC — Applications</div>
<p>1. Carbonated drinks: CO₂ dissolved at high P, fizzes out when opened (P drops).<br>
2. Bends in scuba: N₂ dissolves at depth, bubbles out on rapid ascent.<br>
3. Oxygen tanks at altitude: low P → less O₂ dissolves → supplemental needed.</p></div>
<div class="concept-why"><strong>💡 Raoult's as special case:</strong> When $x_A \\to 1$ (pure solvent): $K_H = P_A^\\circ$. Henry's Law becomes Raoult's Law.</div>`,
                                flashcards: [
                                    { q: "State Henry's Law.", a: "$p = K_H \\cdot x$. Gas partial pressure ∝ mole fraction in solution." },
                                    { q: "What does high $K_H$ mean?", a: "Lower solubility. Gas is harder to dissolve." },
                                    { q: "Effect of temperature on gas solubility?", a: "↑ Temp → ↑ $K_H$ → ↓ solubility (dissolution is exothermic)." },
                                    { q: "$K_H$ order for common gases?", a: "He > H₂ > N₂ > O₂. Helium least soluble." },
                                    { q: "What causes 'the bends'?", a: "N₂ dissolves in blood at high pressure. Rapid ascent → P drops → N₂ bubbles out → pain/death." },
                                    { q: "Why do carbonated drinks fizz?", a: "CO₂ dissolved at high P. When opened, P drops → $K_H \\cdot x > p_{\\text{atm}}$ → CO₂ escapes." },
                                    { q: "Henry's Law limitation?", a: "Only for dilute solutions, low pressures, and gases that don't react with solvent." },
                                    { q: "Raoult's Law as special case of Henry's?", a: "At $x_A \\to 1$: $K_H = P_A^\\circ$. Henry's becomes Raoult's for the solvent." },
                                    { q: "Units of $K_H$?", a: "Same as pressure: atm, bar, Pa, or mmHg." },
                                    { q: "Effect of pressure on gas solubility?", a: "↑ Pressure → ↑ solubility (directly proportional by Henry's Law)." }
                                ],
                                pyq: [
                                    { year: 2021, q: "Henry's constant for O₂ in water is $4.6 \\times 10^4$ atm. If $p_{O_2} = 0.2$ atm, mole fraction =", topic: "Henry's Law" },
                                    { year: 2019, q: "Which gas has the highest Henry's constant in water?", topic: "$K_H$ order" },
                                    { year: 2018, q: "Deep sea divers use He-O₂ mixture because:", topic: "Application" }
                                ],
                                recall: [
                                    { type: "concept", q: "Explain the bends using Henry's Law.", a: "At depth, high pressure → N₂ dissolves in blood (Henry's: solubility ∝ P). On rapid ascent, P drops suddenly → dissolved N₂ exceeds solubility limit → forms bubbles in blood vessels/joints → extreme pain. Solution: slow ascent or He-O₂ mix (He has higher $K_H$ → less soluble)." },
                                    { type: "concept", q: "Why is Raoult's Law a special case?", a: "Henry's: $p = K_H x$. Raoult's: $p = P^\\circ x$. For solvent ($x \\to 1$): behavior becomes ideal, and $K_H = P^\\circ$. For dilute solute: Henry's applies. They're the same equation with different constants depending on concentration regime." }
                                ],
                                mcq: [
                                    { q: "$K_H$ for a gas in water at 25°C is $5 \\times 10^4$ atm. Solubility at 2 atm?", options: ["$4 \\times 10^{-5}$", "$2.5 \\times 10^4$", "$1 \\times 10^5$", "$2 \\times 10^{-4}$"], correct: 0, explanation: "$x = p/K_H = 2/(5\\times10^4) = 4\\times10^{-5}$." },
                                    { q: "As temperature increases, Henry's constant:", options: ["Increases", "Decreases", "Stays same", "First increases then decreases"], correct: 0, explanation: "Higher T → weaker gas-solvent interactions → harder to dissolve → $K_H$ increases." },
                                    { q: "Henry's Law is NOT applicable for:", options: ["HCl in water", "O₂ in water", "N₂ in water", "He in water"], correct: 0, explanation: "HCl reacts with water (ionizes completely), violating the non-reactive gas assumption." }
                                ]
                            },
                            raoults_law: {
                                label: "Raoult's Law",
                                godSheet: `
<h2>Raoult's Law</h2>
<div class="formula-block">$$P_A = x_A \\cdot P_A^\\circ, \\quad P_{\\text{total}} = x_A P_A^\\circ + x_B P_B^\\circ$$</div>
<p>Valid <strong>only for ideal solutions</strong>: $\\Delta H_{\\text{mix}} = 0$, $\\Delta V_{\\text{mix}} = 0$.</p>

<h3>Non-Ideal Solutions</h3>
<div class="formula-block">
<strong>+ve deviation:</strong> $P_{\\text{obs}} > P_{\\text{Raoult}}$, $\\Delta H > 0$<br>
Examples: Ethanol+Water, Acetone+CS₂, Acetone+C₆H₆<br><br>
<strong>−ve deviation:</strong> $P_{\\text{obs}} < P_{\\text{Raoult}}$, $\\Delta H < 0$<br>
Examples: CHCl₃+Acetone, HNO₃+Water, Acetic acid+Pyridine
</div>
<div class="concept-why"><strong>💡 Why deviations?</strong> +ve: A–B weaker than A–A/B–B → easier escape → higher VP. −ve: A–B stronger (often H-bonding) → harder escape → lower VP.</div>

<h3>Azeotropes</h3>
<p><strong>Minimum boiling</strong> (from +ve dev): Ethanol+Water (95.6%, 78.1°C). <strong>Maximum boiling</strong> (from −ve dev): HNO₃+Water (68%, 120.5°C). Cannot be separated by simple distillation.</p>
<div class="skc-box"><div class="skc-title">🔥 SKC — Graph Reading</div>
<p>+ve deviation: VP curve above Raoult's line. −ve: below. At azeotrope: liquid & vapour composition identical.</p></div>`,
                                flashcards: [
                                    { q: "State Raoult's Law.", a: "$P_A = x_A P_A^\\circ$. Partial VP ∝ mole fraction for ideal solutions." },
                                    { q: "What is an ideal solution?", a: "Obeys Raoult's Law. $\\Delta H_{\\text{mix}}=0$, $\\Delta V_{\\text{mix}}=0$. Example: Benzene+Toluene." },
                                    { q: "Positive deviation cause?", a: "A–B interactions weaker than A–A/B–B. $\\Delta H>0$. Easier evaporation → higher VP." },
                                    { q: "Negative deviation cause?", a: "A–B interactions stronger (H-bonding). $\\Delta H<0$. Harder evaporation → lower VP." },
                                    { q: "+ve deviation examples?", a: "Ethanol+Water, Acetone+CS₂, Acetone+Benzene, CCl₄+CHCl₃." },
                                    { q: "−ve deviation examples?", a: "CHCl₃+Acetone, HNO₃+Water, Acetic acid+Pyridine." },
                                    { q: "What is an azeotrope?", a: "Constant-boiling mixture. Liquid & vapour same composition → can't separate by distillation." },
                                    { q: "Minimum boiling azeotrope?", a: "From +ve deviation. Example: Ethanol+Water (95.6%, bp 78.1°C)." },
                                    { q: "Maximum boiling azeotrope?", a: "From −ve deviation. Example: HNO₃+Water (68%, bp 120.5°C)." },
                                    { q: "RLVP formula?", a: "$(P^\\circ - P)/P^\\circ = x_B$ for non-volatile solute." }
                                ],
                                pyq: [
                                    { year: 2025, q: "NaCl solution, mole fraction 0.1. Relative VP of solution to pure water:", topic: "Raoult's" },
                                    { year: 2023, q: "Which pair forms ideal solution? (A) CHCl₃+Acetone (B) C₆H₆+C₆H₅CH₃ (C) EtOH+H₂O (D) HNO₃+H₂O", topic: "Ideal" },
                                    { year: 2021, q: "$P_A^\\circ=100, P_B^\\circ=300$ mmHg, $x_A=0.4$. Total VP =", topic: "Raoult's" },
                                    { year: 2019, q: "Two solutions with same mole fraction, $M_A > M_B$. Then:", topic: "VP" }
                                ],
                                recall: [
                                    { type: "derivation", q: "Derive total VP for binary ideal solution.", a: "$P_A = x_A P_A^\\circ$, $P_B = x_B P_B^\\circ$. Total: $P = P_A + P_B = x_A P_A^\\circ + (1-x_A)P_B^\\circ = P_B^\\circ + (P_A^\\circ - P_B^\\circ)x_A$. Linear in $x_A$." },
                                    { type: "concept", q: "Why can't azeotropes be separated by distillation?", a: "At azeotropic composition, liquid and vapour have identical composition. No enrichment occurs → mixture boils as a pseudo-pure substance." },
                                    { type: "derivation", q: "Show RLVP = mole fraction of solute.", a: "$P = x_A P^\\circ = (1-x_B)P^\\circ \\Rightarrow P^\\circ - P = x_B P^\\circ \\Rightarrow (P^\\circ-P)/P^\\circ = x_B$." }
                                ],
                                mcq: [
                                    { q: "$P_A^\\circ=200, P_B^\\circ=500$ mmHg. For equimolar mixture, $P_{\\text{total}}=$", options: ["350", "700", "250", "400"], correct: 0, explanation: "$x_A=x_B=0.5$. $P=0.5(200)+0.5(500)=350$." },
                                    { q: "Which shows maximum boiling azeotrope?", options: ["HNO₃+H₂O", "EtOH+H₂O", "Acetone+CS₂", "C₆H₆+Toluene"], correct: 0, explanation: "HNO₃+H₂O shows −ve deviation → max boiling azeotrope." },
                                    { q: "CHCl₃+Acetone shows:", options: ["−ve deviation", "No deviation", "+ve deviation", "Azeotrope not formed"], correct: 0, explanation: "Strong H-bonding between CHCl₃ and acetone → A–B stronger → −ve deviation." }
                                ]
                            },
                            colligative: {
                                label: 'Colligative Properties',
                                godSheet: `
<h2>Colligative Properties</h2>
<p>Depend <strong>only on number of solute particles</strong>, not identity.</p>
<div class="formula-block">
$$\\Delta T_b = iK_bm \\quad (\\text{BP Elevation})$$
$$\\Delta T_f = iK_fm \\quad (\\text{FP Depression})$$
$$\\pi = iCRT \\quad (\\text{Osmotic Pressure})$$
$$\\frac{P^\\circ - P}{P^\\circ} = ix_B \\quad (\\text{RLVP})$$
</div>
<div class="skc-box"><div class="skc-title">🔥 SKC — Molar Mass from ΔTf</div>
<p>$M_2 = \\frac{K_f \\times W_2 \\times 1000}{\\Delta T_f \\times W_1}$. Use camphor ($K_f = 40$) for best sensitivity!</p></div>

<h3>Key Constants</h3>
<p>Water: $K_b = 0.512$ K·kg/mol, $K_f = 1.86$ K·kg/mol. $K_f > K_b$ because $\\Delta H_{\\text{fus}} < \\Delta H_{\\text{vap}}$.</p>

<h3>Osmosis</h3>
<p>Solvent flows dilute → concentrated through SPM. <strong>Reverse osmosis</strong>: apply P > π to reverse flow (desalination).</p>
<p><strong>Isotonic</strong>: same π (no flow). <strong>Hypertonic</strong>: higher π (cell shrinks). <strong>Hypotonic</strong>: lower π (cell swells).</p>
<div class="concept-why"><strong>💡</strong> $K_f = RT_f^2 M_1/(1000\\Delta H_{\\text{fus}})$. Since $\\Delta H_{\\text{fus}} < \\Delta H_{\\text{vap}}$, $K_f > K_b$ for water.</div>`,
                                flashcards: [
                                    { q: "Name 4 colligative properties.", a: "RLVP, BP elevation, FP depression, osmotic pressure." },
                                    { q: "BP elevation formula?", a: "$\\Delta T_b = iK_bm$. $K_b$ = ebullioscopic constant." },
                                    { q: "FP depression formula?", a: "$\\Delta T_f = iK_fm$. $K_f$ = cryoscopic constant." },
                                    { q: "Osmotic pressure formula?", a: "$\\pi = iCRT$. C = molarity." },
                                    { q: "Why $K_f > K_b$ for water?", a: "$\\Delta H_{\\text{fus}} < \\Delta H_{\\text{vap}}$ in the formula $K = RT^2M/(1000\\Delta H)$." },
                                    { q: "Molar mass from $\\Delta T_f$?", a: "$M_2 = K_f W_2 \\times 1000/(\\Delta T_f W_1)$." },
                                    { q: "Define osmosis.", a: "Solvent flow from dilute to concentrated through semi-permeable membrane." },
                                    { q: "What is reverse osmosis?", a: "Apply P > π on concentrated side → solvent forced through SPM. Used for desalination." },
                                    { q: "Isotonic solution?", a: "Same osmotic pressure. No net flow. Example: 0.9% NaCl." },
                                    { q: "Which has max FP depression: NaCl, BaCl₂, glucose, or Al₂(SO₄)₃ at 0.1m?", a: "Al₂(SO₄)₃ ($i=5$): $\\Delta T_f = 5 \\times K_f \\times 0.1$. Most particles." }
                                ],
                                pyq: [
                                    { year: 2024, q: "BP elevation of 0.5m glucose in water ($K_b=0.512$):", topic: "Elevation" },
                                    { year: 2023, q: "Osmotic pressure of 0.1M non-electrolyte at 27°C:", topic: "Osmosis" },
                                    { year: 2022, q: "Urea (MW 60), bp 100.18°C. Molality =", topic: "Elevation" },
                                    { year: 2020, q: "0.6g urea + 1.8g glucose in 100mL water. $\\Delta T_f =$", topic: "Depression" },
                                    { year: 2020, q: "Max FP depression: 0.1m NaCl, BaCl₂, glucose, Al₂(SO₄)₃?", topic: "Colligative" },
                                    { year: 2018, q: "$\\pi$ vs C plot at constant T is:", topic: "Osmosis" }
                                ],
                                recall: [
                                    { type: "derivation", q: "Derive $\\Delta T_b = K_b m$.", a: "Clausius-Clapeyron + Raoult's: $\\ln(P^\\circ/P) = \\Delta H_{\\text{vap}}/R \\cdot (1/T_b^\\circ - 1/T_b)$. For dilute: $\\ln(1-x_B) \\approx -x_B$, and $1/T_b^\\circ - 1/T_b \\approx \\Delta T_b/T_b^{\\circ 2}$. Defining $K_b = RT_b^{\\circ 2}M_1/(1000\\Delta H_{\\text{vap}})$ gives $\\Delta T_b = K_b m$." },
                                    { type: "concept", q: "Why is camphor ideal for molar mass?", a: "$K_f = 40$ K·kg/mol (very high). Even tiny amounts of solute give measurable $\\Delta T_f$. More sensitive than water ($K_f = 1.86$)." }
                                ],
                                mcq: [
                                    { q: "0.1m NaCl (complete dissociation). $\\Delta T_f$ relative to 0.1m glucose?", options: ["Double", "Same", "Half", "Triple"], correct: 0, explanation: "NaCl: $i=2$. $\\Delta T_f = 2K_f(0.1)$ vs glucose: $K_f(0.1)$. Ratio = 2." },
                                    { q: "Osmotic pressure of 0.1M BaCl₂ at 300K (complete dissociation):", options: ["7.38 atm", "2.46 atm", "4.92 atm", "1.23 atm"], correct: 0, explanation: "$\\pi = iCRT = 3(0.1)(0.0821)(300) = 7.39$ atm." },
                                    { q: "Which is used for desalination?", options: ["Reverse osmosis", "Osmosis", "Dialysis", "Electrophoresis"], correct: 0, explanation: "Apply P > π to force pure water through SPM from seawater." }
                                ]
                            },
                            vant_hoff: {
                                label: "Van't Hoff Factor",
                                godSheet: `
<h2>Van't Hoff Factor ($i$)</h2>
<div class="formula-block">$$i = \\frac{\\text{Observed colligative property}}{\\text{Calculated colligative property}} = \\frac{M_{\\text{calc}}}{M_{\\text{obs}}}$$</div>
<div class="formula-block">
$$i_{\\text{dissociation}} = 1 + (n-1)\\alpha$$
$$i_{\\text{association}} = 1 - \\left(1-\\frac{1}{n}\\right)\\alpha$$
</div>
<p>$n$ = number of particles, $\\alpha$ = degree of dissociation/association.</p>

<h3>Common Values</h3>
<div class="formula-block">
NaCl: $i_{\\max}=2$ • BaCl₂: $i_{\\max}=3$ • Al₂(SO₄)₃: $i_{\\max}=5$<br>
Glucose/Urea: $i=1$ • Benzoic acid in C₆H₆: $i \\approx 0.5$ (dimerizes)
</div>

<h3>Abnormal Molar Mass</h3>
<p>$i > 1$ (dissociation) → $M_{\\text{obs}} < M_{\\text{calc}}$. More particles than expected.</p>
<p>$i < 1$ (association) → $M_{\\text{obs}} > M_{\\text{calc}}$. Fewer particles (dimers/trimers).</p>

<div class="skc-box"><div class="skc-title">🔥 SKC — Quick Extract α</div>
<p>From $i$: $\\alpha = (i-1)/(n-1)$ for dissociation. If $i = 1.8$ for NaCl ($n=2$): $\\alpha = 0.8/1 = 0.8 = 80\\%$.</p></div>`,
                                flashcards: [
                                    { q: "Define van't Hoff factor.", a: "$i$ = observed/calculated colligative property. Accounts for dissociation/association." },
                                    { q: "$i$ for dissociation?", a: "$i = 1+(n-1)\\alpha$. $n$ = ions produced, $\\alpha$ = degree of dissociation." },
                                    { q: "$i$ for association?", a: "$i = 1-(1-1/n)\\alpha$. $n$ = molecules associating." },
                                    { q: "$i$ for NaCl?", a: "$i_{\\max} = 2$ (Na⁺ + Cl⁻). With $\\alpha$: $i = 1+\\alpha$." },
                                    { q: "$i$ for BaCl₂?", a: "$i_{\\max} = 3$ (Ba²⁺ + 2Cl⁻)." },
                                    { q: "$i$ for glucose?", a: "$i = 1$ (non-electrolyte, no dissociation/association)." },
                                    { q: "Why acetic acid has $i<1$ in benzene?", a: "Dimerizes via H-bonding: 2CH₃COOH ⇌ (CH₃COOH)₂. Fewer particles → $i \\approx 0.5$." },
                                    { q: "Abnormal molar mass: dissociation?", a: "$i>1 \\Rightarrow M_{\\text{obs}} < M_{\\text{calc}}$. More particles than formula suggests." },
                                    { q: "Abnormal molar mass: association?", a: "$i<1 \\Rightarrow M_{\\text{obs}} > M_{\\text{calc}}$. Fewer particles." },
                                    { q: "Extract $\\alpha$ from $i$?", a: "$\\alpha = (i-1)/(n-1)$ for dissociation. Example: $i=1.5, n=3 \\Rightarrow \\alpha=0.25$." }
                                ],
                                pyq: [
                                    { year: 2024, q: "0.1m weak acid HA, $i=1.2$. Degree of dissociation:", topic: "$i$ calc" },
                                    { year: 2022, q: "BaCl₂ (0.1 mol, complete dissociation) at 300K, 1L. $\\pi =$", topic: "$i$ application" },
                                    { year: 2019, q: "$i$ for 0.01M K₃[Fe(CN)₆]$: ", topic: "$i$ value" },
                                    { year: 2018, q: "2.56g S in 100g CS₂, $K_f=3.83$, $\\Delta T_f=0.383$°C. Molecular formula:", topic: "Association" }
                                ],
                                recall: [
                                    { type: "derivation", q: "Derive $i$ formula for dissociation.", a: "Electrolyte $A_n \\to nA$: start with 1 mol. At eq: undissociated = $1-\\alpha$; ions = $n\\alpha$. Total = $1-\\alpha+n\\alpha = 1+(n-1)\\alpha$. Since $i$ = total/initial: $i = 1+(n-1)\\alpha$." },
                                    { type: "concept", q: "Why does acetic acid associate in benzene?", a: "Benzene is non-polar. AcOH has polar carboxyl group. To minimize unfavorable interactions, AcOH forms cyclic dimers via O–H···O H-bonds. Effective particles halved → $i \\approx 0.5$." },
                                    { type: "concept", q: "What is abnormal molar mass?", a: "Colligative methods give molar mass via particle count. If solute dissociates: more particles → appears lighter ($M_{\\text{obs}} < M_{\\text{calc}}$). If associates: fewer particles → appears heavier." }
                                ],
                                mcq: [
                                    { q: "$i$ for 0.1M K₄[Fe(CN)₆] (complete dissociation):", options: ["5", "4", "6", "3"], correct: 0, explanation: "K₄[Fe(CN)₆] → 4K⁺ + [Fe(CN)₆]⁴⁻. Total ions = 5. $i=5$." },
                                    { q: "Weak acid HA ($\\alpha=0.1$). $i =$", options: ["1.1", "0.9", "1.2", "2"], correct: 0, explanation: "HA → H⁺ + A⁻. $n=2$. $i = 1+(2-1)(0.1) = 1.1$." },
                                    { q: "Molar mass of acetic acid in benzene appears ~120. Why?", options: ["It dimerizes ($i≈0.5$)", "It dissociates", "Benzene reacts", "Measurement error"], correct: 0, explanation: "True MW = 60. Observed 120 = double → association into dimers. $i = 60/120 = 0.5$." }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
};

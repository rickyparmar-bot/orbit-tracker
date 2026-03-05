/**
 * Orbit Universe — Electrostatics Chapter Data (Physics)
 */
UNIVERSE_DATA.physics = {
    label: 'Physics', icon: '⚡',
    streams: {
        electrostatics: {
            label: 'Electrostatics', chapters: {
                electrostatics: {
                    label: 'Electrostatics', stream: 'Electrostatics', subject: 'Physics',
                    godSheet: `
<h2>Coulomb's Law</h2>
<div class="formula-block">$$F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r^2}, \\quad k = 9 \\times 10^9 \\text{ Nm}^2\\text{C}^{-2}$$</div>
<p>Vector form: $\\vec{F} = k\\frac{q_1 q_2}{r^2}\\hat{r}_{12}$. Superposition: net force = vector sum of all pairwise forces.</p>

<h2>Electric Field</h2>
<div class="formula-block">$$\\vec{E} = \\frac{\\vec{F}}{q_0} = \\frac{kQ}{r^2}\\hat{r}$$</div>
<div class="formula-block">$$E_{\\text{dipole,axial}} = \\frac{2kp}{r^3}, \\quad E_{\\text{dipole,equat}} = \\frac{kp}{r^3}$$</div>
<div class="skc-box"><div class="skc-title">🔥 SKC Box — Shell Theorem</div>
<p>Uniform sphere: $E_{\\text{out}} = kQ/r^2$, $E_{\\text{surface}} = kQ/R^2$, $E_{\\text{in}} = 0$ (hollow) or $kQr/R^3$ (solid).</p></div>

<h2>Gauss's Law</h2>
<div class="formula-block">$$\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{enc}}}{\\varepsilon_0}$$</div>
<ul><li>Infinite plane: $E = \\sigma/2\\varepsilon_0$</li><li>Parallel plates: $E = \\sigma/\\varepsilon_0$ between, 0 outside</li><li>Line charge: $E = \\lambda/2\\pi\\varepsilon_0 r$</li></ul>

<h2>Electric Potential</h2>
<div class="formula-block">$$V = \\frac{kQ}{r}, \\quad E = -\\frac{dV}{dr}, \\quad W = q(V_A - V_B)$$</div>

<h2>Capacitance</h2>
<div class="formula-block">$$C = Q/V, \\quad C_{\\parallel} = \\varepsilon_0 A/d, \\quad U = \\tfrac{1}{2}CV^2$$</div>
<p>Series: $1/C = 1/C_1+1/C_2$. Parallel: $C = C_1+C_2$. Dielectric: $C' = KC$.</p>
<div class="skc-box"><div class="skc-title">🔥 Kaam Ka Dabba</div><p>Battery ON + dielectric: V const, C↑, Q↑, U↑. Battery OFF: Q const, C↑, V↓, U↓.</p></div>

<h2>Electric Dipole</h2>
<div class="formula-block">$$\\vec{p} = q\\vec{d}, \\quad \\tau = pE\\sin\\theta, \\quad U = -\\vec{p}\\cdot\\vec{E}$$</div>`,

                    flashcards: [
                        { q: "State Coulomb's Law.", a: "$F = kq_1q_2/r^2$, $k=9\\times10^9$ Nm²/C². Along line joining charges." },
                        { q: "Superposition principle?", a: "Net force = vector sum of individual forces. Each calculated independently." },
                        { q: "Define electric field.", a: "$\\vec{E}=\\vec{F}/q_0$. Force per unit +ve test charge. Units: N/C = V/m." },
                        { q: "E due to point charge?", a: "$E=kQ/r^2$. Radially outward (+), inward (−)." },
                        { q: "Field line properties?", a: "Start +, end −. Never cross. Tangent = E direction. Density ∝ |E|." },
                        { q: "State Gauss's Law.", a: "$\\oint\\vec{E}\\cdot d\\vec{A}=q_{enc}/\\varepsilon_0$. Flux = enclosed charge / ε₀." },
                        { q: "E of infinite plane?", a: "$E=\\sigma/2\\varepsilon_0$. Uniform, distance-independent." },
                        { q: "E between parallel plates?", a: "$E=\\sigma/\\varepsilon_0$ between, 0 outside." },
                        { q: "E of line charge?", a: "$E=\\lambda/2\\pi\\varepsilon_0 r$. Inversely ∝ distance." },
                        { q: "Define potential.", a: "$V=kQ/r$. Scalar. Work/charge from ∞ to point." },
                        { q: "E-V relation?", a: "$E=-dV/dr$. E points high→low V." },
                        { q: "Equipotential surfaces?", a: "V=const. Always ⊥ to E. No work along them." },
                        { q: "Dipole moment?", a: "$\\vec{p}=q\\vec{d}$, −q to +q. Units: C·m." },
                        { q: "Torque on dipole?", a: "$\\tau=pE\\sin\\theta$. Max at 90°, 0 when aligned." },
                        { q: "PE of dipole?", a: "$U=-pE\\cos\\theta=-\\vec{p}\\cdot\\vec{E}$. Min at θ=0." },
                        { q: "Axial field of dipole?", a: "$E=2kp/r^3$ for $r\\gg d$." },
                        { q: "Equatorial field of dipole?", a: "$E=kp/r^3$, antiparallel to $\\vec{p}$." },
                        { q: "Define capacitance.", a: "$C=Q/V$. Units: Farad. Charge per volt." },
                        { q: "Parallel plate C?", a: "$C=\\varepsilon_0 A/d$." },
                        { q: "Energy in capacitor?", a: "$U=CV^2/2=Q^2/2C=QV/2$." },
                        { q: "Capacitors in series?", a: "$1/C_{eq}=1/C_1+1/C_2+\\ldots$ Same Q, V divides." },
                        { q: "Capacitors in parallel?", a: "$C_{eq}=C_1+C_2+\\ldots$ Same V, Q divides." },
                        { q: "Dielectric effect on C?", a: "$C'=KC$. Always increases. K = dielectric constant." },
                        { q: "Dielectric + battery connected?", a: "V const → C↑ → Q↑ → U↑." },
                        { q: "Dielectric + battery disconnected?", a: "Q const → C↑ → V↓ → U↓." },
                        { q: "Energy density?", a: "$u=\\varepsilon_0 E^2/2$. Energy per unit volume." },
                        { q: "Define electric flux.", a: "$\\Phi=\\vec{E}\\cdot\\vec{A}=EA\\cos\\theta$. Units: Vm." },
                        { q: "Flux through closed surface, no charge?", a: "Zero (Gauss's Law)." },
                        { q: "Shell theorem (hollow)?", a: "$E_{out}=kQ/r^2$, $E_{in}=0$." },
                        { q: "E inside conductor?", a: "E=0. Charge on surface only." },
                        { q: "E inside solid charged sphere?", a: "$E=kQr/R^3$. Linear in r." },
                        { q: "Electrostatic shielding?", a: "E=0 inside conductor shell. Faraday cage." },
                        { q: "Work by E on charge?", a: "$W=q(V_A-V_B)$. + charge: high→low V spontaneous." },
                        { q: "PE of two charges?", a: "$U=kq_1q_2/r$. +ve like, −ve unlike." },
                        { q: "Gaussian surface?", a: "Imaginary closed surface exploiting symmetry." },
                        { q: "Why E lines never cross?", a: "Would give 2 directions at one point — impossible." },
                        { q: "V at centre of ring?", a: "$V=kQ/R$, E=0 at centre (symmetry)." },
                        { q: "E on axis of ring?", a: "$E=kQx/(R^2+x^2)^{3/2}$. Max at $x=R/\\sqrt{2}$." },
                        { q: "E at sharp points?", a: "Very large (high σ). Corona discharge." },
                        { q: "E vs V difference?", a: "E: vector (F/q). V: scalar (energy/q). $E=-dV/dr$." },
                        { q: "Polarization?", a: "Dipole alignment in dielectric. $E_{net}=E_0/K$." },
                        { q: "Force on dipole in non-uniform E?", a: "$F=p(dE/dx)$. Moves toward stronger field." },
                        { q: "Charge distributions?", a: "Linear λ (C/m), Surface σ (C/m²), Volume ρ (C/m³)." },
                        { q: "Conductor properties?", a: "E=0 inside, charge on surface, E⊥surface, V=const." },
                        { q: "Spherical conductor C?", a: "$C=4\\pi\\varepsilon_0 R$. Earth ≈ 711 μF." },
                        { q: "Force between plates?", a: "$F=Q^2/2\\varepsilon_0 A$. Always attractive." },
                        { q: "Breakdown voltage?", a: "Max E before conduction. Air: ~3×10⁶ V/m." },
                        { q: "Van de Graaff principle?", a: "Charge accumulates on outer sphere. High voltage generation." },
                        { q: "Image charge method?", a: "Replace conductor with mirror charge to solve boundary problems." }
                    ],
                    pyq: [
                        { year: 2025, q: "Charge Q uniformly on sphere radius R. E at r<R from centre:", topic: "Gauss's Law" },
                        { year: 2024, q: "Two series capacitors C each, dielectric K=3 fills one. Net C?", topic: "Capacitance" },
                        { year: 2024, q: "Dipole in non-uniform E field experiences:", topic: "Dipole" },
                        { year: 2023, q: "Conducting sphere radius R, charge Q. V at distance r>R:", topic: "Potential" },
                        { year: 2023, q: "+q, +q, −q at equilateral triangle vertices. V at centroid:", topic: "Superposition" },
                        { year: 2022, q: "Parallel plate C, area A, sep d. Sep doubled, dielectric K=4 half gap:", topic: "Capacitance" },
                        { year: 2022, q: "Electric flux through one face of cube, charge q at centre:", topic: "Gauss's Law" },
                        { year: 2021, q: "Point charge q at distance d from grounded plane. Force:", topic: "Image Charges" },
                        { year: 2021, q: "Energy in 10μF capacitor charged to 100V:", topic: "Energy" },
                        { year: 2020, q: "E on perpendicular bisector of short dipole varies as:", topic: "Dipole" },
                        { year: 2020, q: "Concentric shells Q₁, Q₂. V at centre:", topic: "Potential" },
                        { year: 2019, q: "Charged particle enters uniform E ⊥ to field. Path is:", topic: "Motion" },
                        { year: 2018, q: "Earth as spherical conductor R=6400km. C=", topic: "Capacitance" },
                        { year: 2018, q: "+4q and +q separated by r. E=0 at:", topic: "Null Point" }
                    ],
                    recall: [
                        { type: "derivation", q: "Derive E of infinite plane via Gauss's Law.", a: "Cylinder Gaussian surface with faces ∥ to sheet. Curved flux=0. Two faces: 2EA. Charge=σA. $2EA=σA/ε_0$ → $E=σ/2ε_0$." },
                        { type: "concept", q: "Why E=0 inside conductor?", a: "Free electrons move until net E=0. If E≠0 → current → contradicts equilibrium. Charges on surface." },
                        { type: "derivation", q: "Derive C of parallel plate capacitor.", a: "$E=σ/ε_0=Q/ε_0A$. $V=Ed=Qd/ε_0A$. $C=Q/V=ε_0A/d$." },
                        { type: "concept", q: "Why dielectric increases C?", a: "Polarization → induced charges → net E drops → V drops for same Q → C=Q/V increases by factor K." },
                        { type: "derivation", q: "Energy stored in capacitor.", a: "$dW=Vdq=q/C·dq$. $W=∫₀^Q q/C dq = Q²/2C = CV²/2$." },
                        { type: "concept", q: "Electrostatic shielding.", a: "Inside conducting shell E=0 always. Charges rearrange to cancel external field. Faraday cage." },
                        { type: "derivation", q: "E on axis of charged ring.", a: "By symmetry ⊥ components cancel. $dE_x=k·dq·x/(R²+x²)^{3/2}$. Integrate: $E=kQx/(R²+x²)^{3/2}$." },
                        { type: "concept", q: "Why high σ at sharp points?", a: "Surface equipotential. Sharp = small R = high curvature → σ must be large → high E → corona discharge." }
                    ]
                }
            }
        }
    }
};

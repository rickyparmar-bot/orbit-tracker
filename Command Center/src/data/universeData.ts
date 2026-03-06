export interface SubTopic {
    label: string;
    godSheet: string;
    flashcards: { q: string; a: string }[];
    pyq: { year: number; q: string; topic: string }[];
    recall: { type: string; q: string; a: string }[];
    mcq: { q: string; options: string[]; correct: number; explanation: string }[];
}

export interface Chapter {
    label: string;
    subtopics: Record<string, SubTopic>;
}

export interface Unit {
    label: string;
    chapters: Record<string, Chapter>;
}

export interface SubjectData {
    label: string;
    icon: string;
    units: Record<string, Unit>;
}

const emptySubtopics = (): Record<string, SubTopic> => ({});

export const UNIVERSE_DATA: Record<string, SubjectData> = {
    physics: {
        label: 'Physics',
        icon: '⚡',
        units: {
            mechanics: {
                label: 'Mechanics',
                chapters: {
                    units_measurements: { label: 'Units and Measurements', subtopics: emptySubtopics() },
                    kinematics: { label: 'Kinematics (1D & 2D)', subtopics: emptySubtopics() },
                    nlw: { label: 'Newton’s Laws of Motion', subtopics: emptySubtopics() },
                    wep: { label: 'Work, Energy and Power', subtopics: emptySubtopics() },
                    com: { label: 'Center of Mass', subtopics: emptySubtopics() },
                    rotation: { label: 'Rotational Motion', subtopics: emptySubtopics() },
                    gravitation: { label: 'Gravitation', subtopics: emptySubtopics() },
                }
            },
            properties_matter: {
                label: 'Properties of Matter',
                chapters: {
                    solids: { label: 'Mechanical Properties of Solids', subtopics: emptySubtopics() },
                    fluids: { label: 'Mechanical Properties of Fluids', subtopics: emptySubtopics() },
                    thermal_props: { label: 'Thermal Properties of Matter', subtopics: emptySubtopics() },
                }
            },
            thermodynamics: {
                label: 'Thermodynamics',
                chapters: {
                    ktg_thermo: { label: 'KTG & Thermodynamics', subtopics: emptySubtopics() },
                }
            },
            oscillations_waves: {
                label: 'Oscillations & Waves',
                chapters: {
                    shm: { label: 'Simple Harmonic Motion', subtopics: emptySubtopics() },
                    wave_motion: { label: 'Wave Motion', subtopics: emptySubtopics() },
                }
            },
            electromagnetism: {
                label: 'Electromagnetism',
                chapters: {
                    electrostatics: { label: 'Electric Charges and Field', subtopics: emptySubtopics() },
                    potential_capacitance: { label: 'Electrostatic Potential & Capacitance', subtopics: emptySubtopics() },
                    current_electricity: { label: 'Current Electricity', subtopics: emptySubtopics() },
                    magnetism: { label: 'Moving Charge and Magnetism', subtopics: emptySubtopics() },
                    emi: { label: 'Electromagnetic Induction', subtopics: emptySubtopics() },
                    ac: { label: 'Alternating Current', subtopics: emptySubtopics() },
                }
            },
            optics: {
                label: 'Optics',
                chapters: {
                    ray_optics: { label: 'Ray Optics', subtopics: emptySubtopics() },
                    wave_optics: { label: 'Wave Optics', subtopics: emptySubtopics() },
                    instruments: { label: 'Optical Instruments', subtopics: emptySubtopics() },
                }
            },
            modern_physics: {
                label: 'Modern Physics',
                chapters: {
                    modern: { label: 'Modern Physics', subtopics: emptySubtopics() },
                    em_waves: { label: 'Electromagnetic Waves', subtopics: emptySubtopics() },
                    semiconductors: { label: 'Semiconductors', subtopics: emptySubtopics() },
                }
            }
        }
    },
    mathematics: {
        label: 'Mathematics',
        icon: '📐',
        units: {
            algebra: {
                label: 'Algebra',
                chapters: {
                    sets: { label: 'Sets', subtopics: emptySubtopics() },
                    quad_eq: { label: 'Quadratic Equations', subtopics: emptySubtopics() },
                    seq_series: { label: 'Sequence and Series', subtopics: emptySubtopics() },
                    binomial: { label: 'Binomial Theorem', subtopics: emptySubtopics() },
                    perm_comb: { label: 'Permutations and Combinations', subtopics: emptySubtopics() },
                    complex: { label: 'Complex Numbers', subtopics: emptySubtopics() },
                    stats: { label: 'Statistics', subtopics: emptySubtopics() },
                    prob: { label: 'Probability', subtopics: emptySubtopics() },
                }
            },
            trigonometry: {
                label: 'Trigonometry',
                chapters: {
                    trig_func: { label: 'Trigonometric Functions', subtopics: emptySubtopics() },
                    sol_triangles: { label: 'Solution of Triangles', subtopics: emptySubtopics() },
                    inv_trig: { label: 'Inverse Trigonometric Functions', subtopics: emptySubtopics() },
                }
            },
            coordinate_geo: {
                label: 'Coordinate Geometry',
                chapters: {
                    straight_lines: { label: 'Straight Lines', subtopics: emptySubtopics() },
                    parabola: { label: 'Parabola', subtopics: emptySubtopics() },
                    ellipse: { label: 'Ellipse', subtopics: emptySubtopics() },
                    hyperbola: { label: 'Hyperbola', subtopics: emptySubtopics() },
                }
            },
            calculus: {
                label: 'Calculus',
                chapters: {
                    limits: { label: 'Limits', subtopics: emptySubtopics() },
                    continuity: { label: 'Continuity & Differentiability', subtopics: emptySubtopics() },
                    aod: { label: 'Applications of Derivatives', subtopics: emptySubtopics() },
                    indefinite: { label: 'Indefinite Integrals', subtopics: emptySubtopics() },
                    definite: { label: 'Definite Integrals', subtopics: emptySubtopics() },
                    aoi: { label: 'Application of Integrals', subtopics: emptySubtopics() },
                    diff_eq: { label: 'Differential Equations', subtopics: emptySubtopics() },
                }
            },
            vectors_3d: {
                label: 'Vectors & 3D',
                chapters: {
                    vectors: { label: 'Vectors', subtopics: emptySubtopics() },
                    geo_3d: { label: 'Three-Dimensional Geometry', subtopics: emptySubtopics() },
                }
            },
            matrices_determinants: {
                label: 'Matrices & Determinants',
                chapters: {
                    matrices: { label: 'Matrices', subtopics: emptySubtopics() },
                    determinants: { label: 'Determinants', subtopics: emptySubtopics() },
                }
            }
        }
    },
    physical_chemistry: {
        label: 'Physical Chemistry',
        icon: '⚖️',
        units: {
            foundations: {
                label: 'Foundations',
                chapters: {
                    mole: { label: 'Mole Concept', subtopics: emptySubtopics() },
                    atomic: { label: 'Atomic Structure', subtopics: emptySubtopics() },
                    redox: { label: 'Redox Reaction', subtopics: emptySubtopics() },
                }
            },
            bonding_state: {
                label: 'Bonding & State',
                chapters: {
                    bonding: { label: 'Chemical Bonding', subtopics: emptySubtopics() },
                    thermo: { label: 'Thermodynamics', subtopics: emptySubtopics() },
                }
            },
            equilibrium: {
                label: 'Equilibrium',
                chapters: {
                    chem_eq: { label: 'Chemical Equilibrium', subtopics: emptySubtopics() },
                    ionic_eq: { label: 'Ionic Equilibrium', subtopics: emptySubtopics() },
                }
            },
            dynamics: {
                label: 'Dynamics & Solutions',
                chapters: {
                    kinetics: { label: 'Chemical Kinetics', subtopics: emptySubtopics() },
                    electro: { label: 'Electrochemistry', subtopics: emptySubtopics() },
                    solutions: { label: 'Solutions (Active Sprint)', subtopics: emptySubtopics() },
                }
            }
        }
    },
    organic_chemistry: {
        label: 'Organic Chemistry',
        icon: '🧪',
        units: {
            fundamentals: {
                label: 'Fundamentals',
                chapters: {
                    iupac: { label: 'IUPAC', subtopics: emptySubtopics() },
                    isomerism: { label: 'Isomerism', subtopics: emptySubtopics() },
                    goc: { label: 'GOC', subtopics: emptySubtopics() },
                }
            },
            functional_groups: {
                label: 'Functional Groups',
                chapters: {
                    hydrocarbons: { label: 'Hydrocarbons', subtopics: emptySubtopics() },
                    haloalkanes: { label: 'Haloalkanes and Haloarenes', subtopics: emptySubtopics() },
                    alcohols: { label: 'Alcohols, Phenols and Ethers', subtopics: emptySubtopics() },
                    carbonyl: { label: 'Aldehydes, Ketones & Carboxylic Acids', subtopics: emptySubtopics() },
                    amines: { label: 'Amines', subtopics: emptySubtopics() },
                }
            },
            bio_analysis: {
                label: 'Bio & Analysis',
                chapters: {
                    biomolecules: { label: 'Biomolecules', subtopics: emptySubtopics() },
                    analysis: { label: 'Qualitative and Quantitative Analysis', subtopics: emptySubtopics() },
                }
            }
        }
    },
    inorganic_chemistry: {
        label: 'Inorganic Chemistry',
        icon: '💎',
        units: {
            classifications: {
                label: 'Classifications',
                chapters: {
                    periodic: { label: 'Periodic Table', subtopics: emptySubtopics() },
                }
            },
            elements_coordination: {
                label: 'Elements & Coordination',
                chapters: {
                    df_block: { label: 'D and F Block Elements', subtopics: emptySubtopics() },
                    coordination: { label: 'Coordination Compounds', subtopics: emptySubtopics() },
                }
            }
        }
    }
};

/**
 * Orbit Universe — Relations & Functions Chapter Data (Math)
 */
UNIVERSE_DATA.math = {
    label: 'Mathematics', icon: '📐',
    streams: {
        algebra: {
            label: 'Algebra', chapters: {
                relations_functions: {
                    label: 'Relations & Functions', stream: 'Algebra', subject: 'Mathematics',
                    godSheet: `
<h2>Relations</h2>
<p>A relation R from A to B is a subset of $A \\times B$. Number of relations = $2^{|A|\\cdot|B|}$.</p>
<div class="formula-block">
<strong>Types on set A:</strong><br>
• <strong>Reflexive:</strong> $(a,a) \\in R \\; \\forall a \\in A$<br>
• <strong>Symmetric:</strong> $(a,b) \\in R \\Rightarrow (b,a) \\in R$<br>
• <strong>Transitive:</strong> $(a,b),(b,c) \\in R \\Rightarrow (a,c) \\in R$<br>
• <strong>Equivalence:</strong> Reflexive + Symmetric + Transitive</div>
<div class="skc-box"><div class="skc-title">🔥 SKC Box</div><p>Equivalence classes partition the set. Count partitions = Bell number ($B_3=5, B_4=15$).</p></div>

<h2>Functions</h2>
<div class="formula-block">
• <strong>Injective:</strong> $f(a)=f(b) \\Rightarrow a=b$<br>
• <strong>Surjective:</strong> Range = Codomain<br>
• <strong>Bijective:</strong> Both. Inverse exists. Count = $n!$</div>
<p>Functions A→B: $|B|^{|A|}$. One-one: $P(|B|,|A|)$.</p>

<h2>Composition & Inverse</h2>
<div class="formula-block">$(g\\circ f)(x)=g(f(x))$. NOT commutative. IS associative.<br>
$f^{-1}$ exists iff bijective. $(g\\circ f)^{-1}=f^{-1}\\circ g^{-1}$.</div>

<h2>Binary Operations</h2>
<div class="formula-block">$*:A\\times A\\to A$. Check: closure, commutativity, associativity, identity, inverse.</div>`,

                    flashcards: [
                        { q: "What is a relation?", a: "Subset of $A\\times B$. Set of ordered pairs." },
                        { q: "Reflexive relation?", a: "$(a,a)\\in R$ for all $a\\in A$." },
                        { q: "Symmetric relation?", a: "$(a,b)\\in R \\Rightarrow (b,a)\\in R$." },
                        { q: "Transitive relation?", a: "$(a,b),(b,c)\\in R \\Rightarrow (a,c)\\in R$." },
                        { q: "Equivalence relation?", a: "Reflexive + Symmetric + Transitive." },
                        { q: "Equivalence classes?", a: "Partition set into disjoint subsets. $[a]=\\{x:(x,a)\\in R\\}$." },
                        { q: "Number of relations A→B?", a: "$2^{|A|\\cdot|B|}$." },
                        { q: "Injective function?", a: "$f(a)=f(b)\\Rightarrow a=b$. Different inputs → different outputs." },
                        { q: "Surjective function?", a: "Range = Codomain. Every element has pre-image." },
                        { q: "Bijective function?", a: "Injective + Surjective. Inverse exists." },
                        { q: "Functions A→B count?", a: "$|B|^{|A|}$." },
                        { q: "One-one functions count?", a: "$P(|B|,|A|)=|B|!/(|B|-|A|)!$ if $|A|\\leq|B|$." },
                        { q: "Onto functions count?", a: "Inclusion-exclusion: $\\sum(-1)^k\\binom{n}{k}(n-k)^m$." },
                        { q: "Bijections A→A?", a: "$|A|!$ (factorial)." },
                        { q: "Composition?", a: "$(g\\circ f)(x)=g(f(x))$. Apply f first." },
                        { q: "Composition commutative?", a: "NO. $g\\circ f \\neq f\\circ g$ generally." },
                        { q: "Composition associative?", a: "YES. $h\\circ(g\\circ f)=(h\\circ g)\\circ f$." },
                        { q: "When does $f^{-1}$ exist?", a: "Only when f is bijective." },
                        { q: "Binary operation?", a: "$*:A\\times A\\to A$. Closed operation." },
                        { q: "Commutative operation?", a: "$a*b=b*a$ for all a,b." },
                        { q: "Associative operation?", a: "$(a*b)*c=a*(b*c)$." },
                        { q: "Identity element?", a: "$e*a=a*e=a$ for all a. Unique." },
                        { q: "Inverse element?", a: "$a*a^{-1}=a^{-1}*a=e$." },
                        { q: "Subtraction on ℕ?", a: "NOT a binary op. Not closed: $3-5=-2\\notin\\mathbb{N}$." },
                        { q: "Empty relation?", a: "Symmetric, transitive (vacuously). NOT reflexive." },
                        { q: "Universal relation?", a: "$R=A\\times A$. Equivalence relation." },
                        { q: "Identity relation?", a: "$I=\\{(a,a):a\\in A\\}$. Smallest equivalence relation." },
                        { q: "Check one-one?", a: "$f(a)=f(b)\\Rightarrow a=b$, or monotonic ($f'>0$ or $f'<0$)." },
                        { q: "Floor function?", a: "$\\lfloor x\\rfloor$=largest int ≤ x. Not 1-1. Onto ℤ." },
                        { q: "Signum function?", a: "sgn(x)=x/|x| if x≠0, 0 otherwise. Neither 1-1 nor onto ℝ." },
                        { q: "|x| injective?", a: "No: $|-a|=|a|$. Range=$[0,\\infty)$." },
                        { q: "Domain of $\\sqrt{x-3}$?", a: "$x\\geq3$. Domain=$[3,\\infty)$." },
                        { q: "Range of $1/(1+x^2)$?", a: "$(0,1]$." },
                        { q: "$f(x)=x^2$ on ℝ?", a: "Not injective ($f(-1)=f(1)$). Not surjective (no negatives)." },
                        { q: "Make $x^2$ bijective?", a: "Domain $[0,\\infty)$, codomain $[0,\\infty)$. $f^{-1}=\\sqrt{x}$." },
                        { q: "Partition of set?", a: "Non-empty disjoint subsets whose union = whole set." },
                        { q: "Antisymmetric?", a: "$(a,b)\\in R,(b,a)\\in R \\Rightarrow a=b$. Example: ≤." },
                        { q: "Partial order?", a: "Reflexive + Antisymmetric + Transitive. Example: ≤, ⊆." },
                        { q: "Reflexive relations count?", a: "$2^{n^2-n}$. Diagonal fixed." },
                        { q: "Symmetric relations count?", a: "$2^{n(n+1)/2}$." },
                        { q: "$e^x$ properties?", a: "Strictly increasing → 1-1. Range=$(0,\\infty)$. Not onto ℝ." },
                        { q: "$\\ln$ properties?", a: "$(0,\\infty)\\to\\mathbb{R}$. Bijective. $\\ln^{-1}=e^x$." },
                        { q: "Linear $f(x)=ax+b$?", a: "Bijective ℝ→ℝ if $a\\neq0$. $f^{-1}=(x-b)/a$." },
                        { q: "Even function?", a: "$f(-x)=f(x)$. Symmetric about y-axis." },
                        { q: "Odd function?", a: "$f(-x)=-f(x)$. Symmetric about origin." },
                        { q: "Inverse of composition?", a: "$(g\\circ f)^{-1}=f^{-1}\\circ g^{-1}$." },
                        { q: "Kernel of f?", a: "$\\ker(f)=\\{(a,b):f(a)=f(b)\\}$. Equivalence relation." },
                        { q: "Equivalence relations on {1,2,3}?", a: "5 (Bell number B₃). Correspond to 5 partitions." },
                        { q: "$f\\circ g$ bijective if f isn't?", a: "Possible! g may restrict domain where f is bijective." }
                    ],
                    pyq: [
                        { year: 2025, q: "$f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x^3+5$. Then f is:", topic: "Bijection" },
                        { year: 2024, q: "Equivalence relations on $\\{1,2,3\\}$:", topic: "Equivalence" },
                        { year: 2024, q: "$f(x)=(x-1)/(x+1)$. $f(f(x))=$", topic: "Composition" },
                        { year: 2023, q: "$f:A\\to B$ bijective, $|A|=5$. Then $|B|=$", topic: "Bijection" },
                        { year: 2023, q: "R on ℤ: $aRb$ iff $a-b$ even. R is:", topic: "Equivalence" },
                        { year: 2022, q: "Onto functions $\\{1..5\\}\\to\\{a,b,c\\}$:", topic: "Onto" },
                        { year: 2022, q: "$g\\circ f=I_A, f\\circ g=I_B$. Then:", topic: "Inverse" },
                        { year: 2021, q: "$a*b=a+b-ab$ on ℝ. Identity?", topic: "Binary Ops" },
                        { year: 2021, q: "$R=\\{(a,b):a\\leq b^3\\}$ on ℝ. R is:", topic: "Relations" },
                        { year: 2020, q: "$f:\\mathbb{N}\\to\\mathbb{N}$, $f(x)=x+1$. f is:", topic: "Injective" },
                        { year: 2019, q: "Bijections from A to itself, |A|=3:", topic: "Bijection" },
                        { year: 2018, q: "$f(x)=|x|$, $g(x)=x$. $g\\circ f=$", topic: "Composition" }
                    ],
                    recall: [
                        { type: "concept", q: "How equivalence classes partition a set?", a: "Each element in exactly one class. Classes disjoint. Union = A. 'Same remainder mod 3' gives 3 classes." },
                        { type: "derivation", q: "Prove f⁻¹ is bijective if f is.", a: "Injective: $f^{-1}(a)=f^{-1}(b)\\Rightarrow f(f^{-1}(a))=f(f^{-1}(b))\\Rightarrow a=b$. Surjective: for any $a\\in A$, $f^{-1}(f(a))=a$." },
                        { type: "concept", q: "Why composition not commutative?", a: "$g(f(x))$ applies f first; $f(g(x))$ applies g first. Different order → different result. But associative: inner-to-outer always same." },
                        { type: "derivation", q: "Count equivalence relations on {1,2,3}.", a: "= partitions: {1,2,3}, {1}{2,3}, {2}{1,3}, {3}{1,2}, {1}{2}{3}. Total = 5 = Bell(3)." },
                        { type: "concept", q: "Why must f be bijective for f⁻¹?", a: "Injective: unique pre-image (well-defined). Surjective: every element has pre-image (total function). Without both: undefined or multi-valued." },
                        { type: "concept", q: "Determine equivalence relation systematically.", a: "Check 3 independently: 1) (a,a)∈R ∀a? 2) (a,b)∈R⇒(b,a)∈R? 3) (a,b),(b,c)∈R⇒(a,c)∈R? One counterexample kills property." }
                    ]
                }
            }
        }
    }
};

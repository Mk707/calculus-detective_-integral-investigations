import { SubjectBank, ActiveCase, Subject } from '../types';

export const SUBJECT_BANKS: SubjectBank[] = [
  // ─────────────────────────────────────────────────────────
  // CALCULUS
  // ─────────────────────────────────────────────────────────
  {
    subject: 'calculus',
    subjectTitle: 'Calculus',
    subjectTagline: 'Deploy derivatives, integrals & limits to crack the case',
    levels: [
      {
        id: '1',
        title: 'The Velocity Vanish',
        description:
          'A notorious diamond thief is escaping in a custom getaway car. Satellites captured its position function over the last minute. Calculate the instantaneous velocity to intercept at the right crossroad.',
        location: 'Downtown Freeway',
        evidenceType: 'Satellite Position Tracking',
        successStory:
          'Calculated perfectly. The spike strips deployed exactly where the car hit the predicted velocity. Thief apprehended.',
        failureStory:
          'Your derivative was off. The car blazed past the intercept point before units were in position. He is gone.',
        questions: [
          {
            formula: 'p(t) = 5t^2 + 20t + 10',
            question: "Find the velocity function v(t) = p'(t) and calculate v(3).",
            correctAnswer: '50',
            options: ['30', '45', '50', '55'],
            explanation: "v(t) = p'(t) = 10t + 20. At t = 3: v(3) = 30 + 20 = 50.",
            topic: 'Derivative',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=derivatives+calculus+power+rule+introduction+khan+academy',
          },
          {
            formula: 'f(x) = x^3 - 3x^2 + 5',
            question: "Find the value of f'(2).",
            correctAnswer: '0',
            options: ['-3', '0', '3', '6'],
            explanation: "f'(x) = 3x² - 6x. At x = 2: f'(2) = 3(4) - 6(2) = 12 - 12 = 0.",
            topic: 'Derivative',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=derivatives+calculus+power+rule+examples',
          },
          {
            formula: 'g(t) = 4t^2 - 8t',
            question: "Find g'(t) and determine the value of t where the rate of change equals zero.",
            correctAnswer: 't = 1',
            options: ['t = 0', 't = 1', 't = 2', 't = 4'],
            explanation: "g'(t) = 8t - 8. Set to zero: 8t - 8 = 0 → t = 1.",
            topic: 'Derivative',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=derivative+critical+points+calculus+explained',
          },
          {
            formula: 'h(x) = 3x^2 + 6x',
            question: "Calculate h'(4).",
            correctAnswer: '30',
            options: ['18', '24', '30', '36'],
            explanation: "h'(x) = 6x + 6. At x = 4: h'(4) = 24 + 6 = 30.",
            topic: 'Derivative',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=derivatives+calculus+practice+problems',
          },
        ],
      },
      {
        id: '2',
        title: 'The Blast Radius',
        description:
          'A building was leveled by a mysterious explosion. Sensors captured the blast pressure curve over distance from the epicenter. Calculate the total force absorbed to identify the explosive used.',
        location: 'Old Warehouse District',
        evidenceType: 'Pressure Sensor Data',
        successStory:
          'The integrated force points directly to a specialized industrial explosive. We traced the buyer to a local rival.',
        failureStory:
          'Wrong integral, wrong explosive type. The bomber had time to skip town while we chased a dead end.',
        questions: [
          {
            formula: 'f(x) = 3x^2 + 2',
            question: 'Calculate \\int_{0}^{2} (3x^2 + 2)\\, dx.',
            correctAnswer: '12',
            options: ['8', '10', '12', '14'],
            explanation: '\\int(3x^2+2)dx = x^3+2x. At x=2: 8+4=12. At x=0: 0. Result = 12.',
            topic: 'Integral',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=definite+integrals+calculus+introduction+khan+academy',
          },
          {
            formula: 'f(x) = 2x + 3',
            question: 'Calculate \\int_{0}^{3} (2x + 3)\\, dx.',
            correctAnswer: '18',
            options: ['9', '12', '15', '18'],
            explanation: '\\int(2x+3)dx = x^2+3x. At x=3: 9+9=18. At x=0: 0. Result = 18.',
            topic: 'Integral',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=definite+integrals+area+under+curve+calculus',
          },
          {
            formula: 'f(x) = x^2',
            question: 'Calculate \\int_{0}^{3} x^2\\, dx.',
            correctAnswer: '9',
            options: ['3', '6', '9', '12'],
            explanation: '\\int x^2\\,dx = \\frac{x^3}{3}. At x=3: 27/3=9. At x=0: 0. Result = 9.',
            topic: 'Integral',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=integration+power+rule+calculus+tutorial',
          },
          {
            formula: 'f(x) = 4x^3',
            question: 'Calculate \\int_{0}^{2} 4x^3\\, dx.',
            correctAnswer: '16',
            options: ['8', '12', '16', '20'],
            explanation: '\\int 4x^3\\,dx = x^4. At x=2: 16. At x=0: 0. Result = 16.',
            topic: 'Integral',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=integral+calculus+practice+problems+solutions',
          },
        ],
      },
      {
        id: '3',
        title: "The Forger's Limit",
        description:
          'An ancient scroll appeared at a suspicious auction. Forensic chemical analysis models the ink stability ratio as a rational function of time. We must find its theoretical limit to expose the forgery.',
        location: 'High-End Auction House',
        evidenceType: 'Ink Stability Analysis',
        successStory:
          'The limiting ratio confirms the ink never reaches ancient-pigment characteristics. Forgery exposed.',
        failureStory:
          'Misidentified the trend. We authenticated a fake, costing the museum millions.',
        questions: [
          {
            formula: 'f(n) = \\dfrac{2n^2 + 5n}{n^2 + 10}',
            question: 'As n → ∞, what is the limit of the stability ratio?',
            correctAnswer: '2',
            options: ['0', '1', '2', 'Infinity'],
            explanation:
              'Highest-power terms dominate: 2n²/n² = 2. Lower terms vanish as n → ∞.',
            topic: 'Limit',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=limits+at+infinity+rational+functions+calculus',
          },
          {
            formula: '\\lim_{x \\to 0} \\dfrac{\\sin(x)}{x}',
            question: 'Evaluate this fundamental trigonometric limit.',
            correctAnswer: '1',
            options: ['0', '1', 'π', 'Undefined'],
            explanation:
              'The classic squeeze-theorem result: lim(x→0) sin(x)/x = 1. This is a foundational calculus limit.',
            topic: 'Limit',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=limit+sin+x+over+x+as+x+approaches+0+calculus',
          },
          {
            formula: '\\lim_{x \\to 2} \\dfrac{x^2 - 4}{x - 2}',
            question: 'Evaluate the limit.',
            correctAnswer: '4',
            options: ['0', '2', '4', 'Undefined'],
            explanation:
              'Factor: (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2. At x=2: 4.',
            topic: 'Limit',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=limits+factoring+indeterminate+forms+calculus',
          },
          {
            formula: '\\lim_{x \\to \\infty} \\dfrac{5x + 3}{2x - 1}',
            question: 'Evaluate the limit as x → ∞.',
            correctAnswer: '5/2',
            options: ['1', '2', '5/2', '∞'],
            explanation:
              'Divide numerator and denominator by x: (5 + 3/x)/(2 - 1/x) → 5/2 as x → ∞.',
            topic: 'Limit',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=limits+at+infinity+calculus+horizontal+asymptote',
          },
        ],
      },
      {
        id: '4',
        title: "The Forger's Folly: Decay",
        description:
          'A different artifact is undergoing radiocarbon dating. Its particle decay follows a differential equation. Solve for the remaining particle count to determine if the age claim is genuine.',
        location: 'Radiocarbon Lab',
        evidenceType: 'Particle Counter',
        successStory:
          'Your calculation confirmed the decay signature exactly. The artifact age was verified — the scholar was innocent.',
        failureStory:
          'Wrong decay value. We wrongly accused a scholar of fraud, causing an international incident.',
        questions: [
          {
            formula: 'N(t) = N_0\\, e^{-0.1t}',
            question: 'With N₀ = 100, calculate N(10). Use e⁻¹ ≈ 0.37.',
            correctAnswer: '37',
            options: ['10', '37', '50', '90'],
            explanation: 'N(10) = 100 · e^(-0.1·10) = 100 · e⁻¹ ≈ 100 · 0.37 = 37.',
            topic: 'Differential Equation',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=differential+equations+exponential+decay+calculus',
          },
          {
            formula: '\\dfrac{dy}{dt} = -2y, \\quad y(0) = 50',
            question: 'Find y(1). Use e⁻² ≈ 0.14.',
            correctAnswer: '7',
            options: ['7', '14', '25', '50'],
            explanation: 'y(t) = 50e^(-2t). At t=1: y(1) = 50 × 0.14 = 7.',
            topic: 'Differential Equation',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=separable+differential+equations+exponential+growth+decay',
          },
          {
            formula: '\\dfrac{dP}{dt} = 0.1P, \\quad P(0) = 500',
            question: 'Find P(10). Use e ≈ 2.72.',
            correctAnswer: '1360',
            options: ['500', '1000', '1360', '2720'],
            explanation: 'P(t) = 500e^(0.1t). At t=10: P(10) = 500 · e^1 ≈ 500 · 2.72 = 1360.',
            topic: 'Differential Equation',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=exponential+growth+differential+equations+examples',
          },
          {
            formula: '\\dfrac{dQ}{dt} = -0.5Q, \\quad Q(0) = 200',
            question: 'Find Q(2). Use e⁻¹ ≈ 0.37.',
            correctAnswer: '74',
            options: ['37', '50', '74', '100'],
            explanation: 'Q(t) = 200e^(-0.5t). At t=2: Q(2) = 200 · e^(-1) ≈ 200 · 0.37 = 74.',
            topic: 'Differential Equation',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=exponential+decay+differential+equations+calculus+tutorial',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BIOLOGY
  // ─────────────────────────────────────────────────────────
  {
    subject: 'biology',
    subjectTitle: 'Biology',
    subjectTagline: 'Analyze cellular evidence and decode life\'s blueprints',
    levels: [
      {
        id: '1',
        title: 'The Cellular Saboteur',
        description:
          'A toxin has been introduced into a research lab\'s cell cultures, causing mass cell failure. Forensic biologists need to identify which organelle was targeted to trace the source compound.',
        location: 'BioSecurity Research Lab',
        evidenceType: 'Cell Culture Analysis',
        successStory:
          'Correct. The toxin targeted the identified organelle. We traced the compound to a rogue pharmaceutical supplier — arrested at the border.',
        failureStory:
          'Wrong organelle. We wasted precious hours investigating the wrong cellular pathway. The saboteur destroyed all remaining samples.',
        questions: [
          {
            question: "What organelle is known as the 'powerhouse of the cell'?",
            correctAnswer: 'Mitochondria',
            options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi Apparatus'],
            explanation:
              'Mitochondria produce ATP through cellular respiration, supplying energy for virtually every cellular function.',
            topic: 'Cell Biology',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=cell+organelles+mitochondria+biology+explained+crashcourse',
          },
          {
            question: 'What is the primary function of the cell membrane?',
            correctAnswer: 'Control what enters and exits the cell',
            options: [
              'Produce ATP energy',
              'Control what enters and exits the cell',
              'Store genetic information',
              'Synthesize proteins',
            ],
            explanation:
              'The cell membrane (plasma membrane) is selectively permeable — it regulates which molecules pass in or out, maintaining the internal environment.',
            topic: 'Cell Biology',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=cell+membrane+structure+function+biology+tutorial',
          },
          {
            question: 'Which organelle contains the cell\'s DNA and directs cellular activities?',
            correctAnswer: 'Nucleus',
            options: ['Ribosome', 'Vacuole', 'Nucleus', 'Chloroplast'],
            explanation:
              'The nucleus is the control center of the eukaryotic cell, housing DNA in chromosomes and directing protein synthesis via RNA.',
            topic: 'Cell Biology',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=cell+nucleus+function+biology+lesson+explanation',
          },
          {
            question: 'What process converts glucose + oxygen into ATP energy, CO₂, and water?',
            correctAnswer: 'Cellular Respiration',
            options: ['Photosynthesis', 'Cellular Respiration', 'Osmosis', 'Mitosis'],
            explanation:
              'Cellular respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP. It occurs primarily in the mitochondria.',
            topic: 'Cell Biology',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=cellular+respiration+biology+explained+atp',
          },
        ],
      },
      {
        id: '2',
        title: 'The DNA Deception',
        description:
          'A paternity fraud case has emerged at a genetics research institute. A suspect claims to have manipulated inheritance records. Answer the genetics question to expose the deception.',
        location: 'Genetics Research Institute',
        evidenceType: 'DNA Sequence Profiles',
        successStory:
          'Perfect analysis. The inheritance pattern proved the records were forged. The suspect is facing charges of scientific fraud.',
        failureStory:
          'Incorrect genetics interpretation. The forged records were authenticated, and the suspect walked free on a technicality.',
        questions: [
          {
            question: 'What are the four nitrogenous bases in DNA?',
            correctAnswer: 'Adenine, Thymine, Guanine, Cytosine',
            options: [
              'Adenine, Thymine, Guanine, Cytosine',
              'Adenine, Uracil, Guanine, Cytosine',
              'Adenine, Thymine, Lysine, Cytosine',
              'Arginine, Thymine, Guanine, Cytosine',
            ],
            explanation:
              'DNA contains A (Adenine), T (Thymine), G (Guanine), C (Cytosine). A pairs with T; G pairs with C. RNA replaces T with Uracil.',
            topic: 'Genetics',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=DNA+structure+bases+biology+explanation+crashcourse',
          },
          {
            question:
              'Two heterozygous parents (Aa × Aa) cross. What is the probability of a homozygous recessive (aa) offspring?',
            correctAnswer: '25%',
            options: ['0%', '25%', '50%', '75%'],
            explanation:
              'Punnett square for Aa × Aa yields: AA (25%), Aa (50%), aa (25%). One in four chance of homozygous recessive.',
            topic: 'Genetics',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=punnett+square+genetics+mendel+biology+tutorial',
          },
          {
            question:
              'What type of cell division produces sex cells (sperm and eggs) with half the chromosome count?',
            correctAnswer: 'Meiosis',
            options: ['Mitosis', 'Meiosis', 'Binary Fission', 'Budding'],
            explanation:
              'Meiosis divides a diploid (2n) cell into four haploid (n) gametes. Mitosis produces identical diploid cells for growth and repair.',
            topic: 'Genetics',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=meiosis+vs+mitosis+biology+cell+division+tutorial',
          },
          {
            question: 'What is the difference between a genotype and a phenotype?',
            correctAnswer: 'Genotype is genetic makeup; phenotype is the observable trait',
            options: [
              'Genotype is the observable trait; phenotype is the genetic makeup',
              'Genotype is genetic makeup; phenotype is the observable trait',
              'Both refer to the same thing',
              'Genotype is environment; phenotype is DNA sequence',
            ],
            explanation:
              'Genotype = allele combination (e.g., Aa). Phenotype = observable characteristic (e.g., brown eyes) produced by genotype + environment.',
            topic: 'Genetics',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=genotype+phenotype+genetics+biology+lesson',
          },
        ],
      },
      {
        id: '3',
        title: 'The Missing Link',
        description:
          'A fossil smuggler claims a bone fragment is from a newly discovered transitional species. Our evolutionary biologist must analyze the evidence — and the evolutionary concepts behind it.',
        location: 'Natural History Museum',
        evidenceType: 'Paleontological Analysis',
        successStory:
          'Correct analysis. The fossil characteristics match confirmed transitional species markers. The smuggler\'s fake provenance has been exposed.',
        failureStory:
          'Evolutionary reasoning was flawed. The smuggler exploited the error to authenticate their forgery and vanished.',
        questions: [
          {
            question: 'What best describes natural selection?',
            correctAnswer: 'Organisms with beneficial traits survive and reproduce more',
            options: [
              'Organisms with beneficial traits survive and reproduce more',
              'Genetic mutations that occur at a constant rate each generation',
              'Organisms choosing which traits to pass on to offspring',
              'Humans selectively breeding organisms for desired traits',
            ],
            explanation:
              'Natural selection: individuals whose heritable traits improve survival/reproduction pass those traits on more frequently, shifting the population over time.',
            topic: 'Evolution',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=natural+selection+evolution+biology+crashcourse',
          },
          {
            question: 'What is the main evidence that fossils provide in evolutionary biology?',
            correctAnswer: 'A record of past life forms showing change over time',
            options: [
              'Proof that species never change',
              'A record of past life forms showing change over time',
              'Direct measurement of DNA sequences',
              'Evidence that evolution happens within a single lifetime',
            ],
            explanation:
              'Fossils show morphological changes across geological time, including transitional forms that link ancestral and derived species.',
            topic: 'Evolution',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=fossil+record+evidence+evolution+biology',
          },
          {
            question: 'Which scenario is an example of convergent evolution?',
            correctAnswer: 'Wings evolving independently in birds and bats',
            options: [
              'A dog and wolf having similar skeletons due to common ancestry',
              'Wings evolving independently in birds and bats',
              'Humans and chimpanzees sharing 98% of their DNA',
              'Different finch species on the same island sharing a common ancestor',
            ],
            explanation:
              'Convergent evolution: unrelated lineages independently evolve similar traits due to similar environmental pressures. Wings in birds vs. bats arose separately.',
            topic: 'Evolution',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=convergent+evolution+biology+examples+explained',
          },
          {
            question: 'What is genetic drift?',
            correctAnswer: 'Random changes in allele frequency due to chance events',
            options: [
              'Mutations deliberately caused by environmental stress',
              'Random changes in allele frequency due to chance events',
              'The horizontal transfer of genes between species',
              'A steady, predictable rate of genetic change',
            ],
            explanation:
              'Genetic drift causes random allele frequency shifts, especially in small populations. Events like bottlenecks or founder effects can drastically change a population\'s gene pool.',
            topic: 'Evolution',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=genetic+drift+bottleneck+evolution+biology+tutorial',
          },
        ],
      },
      {
        id: '4',
        title: 'The Ecosystem Collapse',
        description:
          'An industrial spill has triggered a cascade of deaths across a protected wetland. The environmental response team needs ecological expertise to trace the root of the collapse through the food web.',
        location: 'Wetlands Environmental Response HQ',
        evidenceType: 'Ecosystem Impact Survey',
        successStory:
          'Brilliant ecological reasoning. The disrupted trophic level was identified, corrective measures were deployed, and the wetland is recovering.',
        failureStory:
          'Incorrect analysis. Resources were deployed to the wrong trophic level, and two more apex predator species were lost before the error was caught.',
        questions: [
          {
            question:
              'In a food chain, what are organisms that eat only plants (primary consumers) called?',
            correctAnswer: 'Herbivores',
            options: ['Herbivores', 'Carnivores', 'Omnivores', 'Decomposers'],
            explanation:
              'Herbivores (primary consumers) eat producers (plants). Carnivores eat animals. Decomposers break down dead organisms and recycle nutrients.',
            topic: 'Ecosystems',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=food+chain+trophic+levels+ecosystems+biology',
          },
          {
            question: 'What is the role of decomposers in an ecosystem?',
            correctAnswer: 'Break down dead organisms and return nutrients to the soil',
            options: [
              'Convert sunlight directly into food',
              'Break down dead organisms and return nutrients to the soil',
              'Regulate predator and prey populations',
              'Produce oxygen through photosynthesis',
            ],
            explanation:
              'Decomposers (bacteria, fungi) break down dead organisms via decomposition, releasing nutrients like nitrogen and phosphorus back into the soil for producers.',
            topic: 'Ecosystems',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=decomposers+nutrient+cycling+ecosystem+biology+explained',
          },
          {
            question: 'What defines a keystone species?',
            correctAnswer: 'A species with a disproportionately large impact on its ecosystem',
            options: [
              'The most numerous species in an ecosystem',
              'A species with a disproportionately large impact on its ecosystem',
              'A species found only in a single geographic location',
              'The apex predator at the top of the food chain',
            ],
            explanation:
              'Keystone species (e.g., sea otters, gray wolves) regulate entire ecosystems. Their removal causes dramatic changes far out of proportion to their population size.',
            topic: 'Ecosystems',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=keystone+species+ecosystem+wolves+yellowstone+biology',
          },
          {
            question: 'What is the greenhouse effect?',
            correctAnswer: 'Trapping of solar heat by atmospheric greenhouse gases',
            options: [
              'Artificial warming of greenhouses for agriculture',
              'Trapping of solar heat by atmospheric greenhouse gases',
              'The depletion of the ozone layer by UV radiation',
              'A cooling effect caused by dense forest canopies',
            ],
            explanation:
              'Greenhouse gases (CO₂, methane, water vapor) absorb and re-emit infrared radiation, warming the planet. Human-driven increases are intensifying this natural process.',
            topic: 'Ecosystems',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=greenhouse+effect+climate+change+biology+earth+science+explained',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // COMPUTER SCIENCE (BINARY & FUNDAMENTALS)
  // ─────────────────────────────────────────────────────────
  {
    subject: 'computer-science',
    subjectTitle: 'Computer Science',
    subjectTagline: 'Crack binary codes and outsmart the digital criminal',
    levels: [
      {
        id: '1',
        title: 'The Binary Breach',
        description:
          'A hacker has infiltrated a secure data center by exploiting low-level system knowledge. To understand the attack vector, our cyber team must answer fundamental questions about how computers store information.',
        location: 'Tier-4 Data Center',
        evidenceType: 'System Architecture Logs',
        successStory:
          'Correct. Understanding that vulnerability allowed us to patch the breach and trace the attacker\'s entry point to a compromised IoT device.',
        failureStory:
          'Wrong answer. Without understanding the fundamentals, we misidentified the attack surface. The hacker is still inside the network.',
        questions: [
          {
            question: 'What number system does a computer use at its most fundamental level?',
            correctAnswer: 'Binary (base-2)',
            options: [
              'Decimal (base-10)',
              'Binary (base-2)',
              'Hexadecimal (base-16)',
              'Octal (base-8)',
            ],
            explanation:
              'Computers use binary because transistors have two physical states: on (1) or off (0). All data — text, images, programs — is ultimately stored and processed as binary.',
            topic: 'Binary Basics',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=binary+number+system+computer+science+introduction+crashcourse',
          },
          {
            question: 'How many distinct values can a single bit represent?',
            correctAnswer: '2 values (0 or 1)',
            options: ['1 value (only 0)', '2 values (0 or 1)', '8 values (0–7)', '256 values (0–255)'],
            explanation:
              'A single bit has exactly 2 states: 0 or 1. With n bits you can represent 2ⁿ unique values. Two bits = 4, three bits = 8, eight bits (1 byte) = 256.',
            topic: 'Binary Basics',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=what+is+a+bit+binary+computer+science+basics+explained',
          },
          {
            type: 'code-fill',
            question: 'Python\'s bin() converts a decimal to binary. Fill in the output.',
            codeTemplate: '>>> bin(10)\n\'0b___\'',
            correctAnswer: '1010',
            options: [],
            explanation:
              'bin(10) returns \'0b1010\'. 10 = 8+2 = 1×2³ + 0×2² + 1×2¹ + 0×2⁰. The \'0b\' prefix signals binary.',
            topic: 'Binary Basics',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=python+bin+function+binary+decimal+conversion+explained',
          },
          {
            type: 'code-fill',
            question: 'ord() returns the ASCII/Unicode code point of a character. What does ord(\'A\') return?',
            codeTemplate: '>>> ord(\'A\')\n___',
            correctAnswer: '65',
            options: [],
            explanation:
              '\'A\' has ASCII value 65 = 01000001 in binary. ord() and chr() let you move between characters and their numeric codes.',
            topic: 'Binary Basics',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=python+ord+chr+ASCII+unicode+character+encoding+explained',
          },
        ],
      },
      {
        id: '2',
        title: 'The Encoded Message',
        description:
          'Intercepted communications contain a series of binary-encoded messages. The cyber intelligence lab must decode them to identify the suspect\'s next target before the operation is carried out.',
        location: 'Cyber Intelligence Lab',
        evidenceType: 'Encrypted Communication Logs',
        successStory:
          'Perfect decode. The binary message revealed the target address. Units arrived 12 minutes before the suspect and prevented the breach.',
        failureStory:
          'Decoding error. The converted value pointed us to the wrong address. By the time we realised the mistake, it was too late.',
        questions: [
          {
            question: 'What is the binary number 1010 in decimal?',
            correctAnswer: '10',
            options: ['5', '8', '10', '12'],
            explanation:
              '1010₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10.',
            topic: 'Binary Conversion',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=binary+to+decimal+conversion+tutorial+step+by+step',
          },
          {
            question: 'What is the decimal number 13 in binary?',
            correctAnswer: '1101',
            options: ['1011', '1100', '1101', '1110'],
            explanation:
              '13 = 8 + 4 + 1 = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 1101₂.',
            topic: 'Binary Conversion',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=decimal+to+binary+conversion+how+to+computer+science',
          },
          {
            type: 'code-fill',
            question: 'int() can parse any numeric base. Fill in the base argument to read a binary string.',
            codeTemplate: '# Convert binary string "11111111" to decimal\nint("11111111", ___)',
            correctAnswer: '2',
            options: [],
            explanation:
              'int(string, base) parses a number in any base. Base 2 = binary. int("11111111", 2) = 255, the max 8-bit value.',
            topic: 'Binary Conversion',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=python+int+base+conversion+binary+decimal+tutorial',
          },
          {
            type: 'code-fill',
            question: 'With n bits the maximum value is 2ⁿ − ?. Fill in the missing number.',
            codeTemplate: '# Maximum value storable in 4 bits\nmax_val = 2 ** 4 - ___',
            correctAnswer: '1',
            options: [],
            explanation:
              '2⁴ − 1 = 15 (binary: 1111). The −1 is because counting starts at 0 (0 through 15 = 16 values).',
            topic: 'Binary Conversion',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=binary+maximum+value+n+bits+formula+computer+science',
          },
        ],
      },
      {
        id: '3',
        title: 'The Circuit Crisis',
        description:
          'A saboteur has introduced faulty logic gate configurations into a chip manufacturing plant, causing defective processors to ship. Identify the gate behavior to trace which component was tampered with.',
        location: 'Semiconductor Fabrication Plant',
        evidenceType: 'Circuit Diagram & Truth Tables',
        successStory:
          'Gate identified. The tampered XOR component was isolated, the production line halted, and the saboteur\'s access logs were flagged.',
        failureStory:
          'Wrong gate. Millions of defective chips were shipped to medical devices before the error was caught.',
        questions: [
          {
            question: 'What is the output of an AND gate when inputs are A=1 and B=0?',
            correctAnswer: '0',
            options: ['0', '1', 'Both 0 and 1', 'Undefined'],
            explanation:
              'AND gate outputs 1 ONLY when ALL inputs are 1. Since B=0, output = 0. Truth table: (0,0)→0, (0,1)→0, (1,0)→0, (1,1)→1.',
            topic: 'Logic Gates',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=AND+gate+logic+gates+truth+table+computer+science',
          },
          {
            question: 'What does a NOT gate (inverter) output when the input is 0?',
            correctAnswer: '1',
            options: ['0', '1', 'The same value', 'No output'],
            explanation:
              'NOT gate inverts its single input: NOT(0) = 1, NOT(1) = 0. It is the simplest logic gate and forms the basis of all other gates.',
            topic: 'Logic Gates',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=NOT+gate+inverter+logic+gates+boolean+computer+science',
          },
          {
            type: 'code-fill',
            question: 'Implement a Python OR gate using the correct boolean keyword.',
            codeTemplate: 'def or_gate(a, b):\n    return a ___ b',
            correctAnswer: 'or',
            options: [],
            explanation:
              'Python uses \'or\' for boolean OR. True or False → True; False or False → False. Mirrors the OR gate: output is 1 when at least one input is 1.',
            topic: 'Logic Gates',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=python+boolean+operators+and+or+not+logic+gates+explained',
          },
          {
            type: 'code-fill',
            question: 'Python\'s bitwise XOR operator outputs 1 when inputs differ. Fill in the symbol.',
            codeTemplate: 'a, b = 1, 0\nresult = a ___ b  # True when inputs differ',
            correctAnswer: '^',
            options: [],
            explanation:
              '^ is Python\'s bitwise XOR operator. 1 ^ 0 = 1, 1 ^ 1 = 0, 0 ^ 0 = 0. Used in encryption, checksums, and binary addition.',
            topic: 'Logic Gates',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=python+bitwise+XOR+operator+logic+gates+explained',
          },
        ],
      },
      {
        id: '4',
        title: 'The Runaway Process',
        description:
          'A rogue algorithm inside a financial trading system is executing unauthorized transactions. The software team must demonstrate their understanding of algorithms and program logic to isolate and terminate the process.',
        location: 'Financial Software Development HQ',
        evidenceType: 'Code Execution Logs',
        successStory:
          'Correct reasoning. The runaway process was identified by its algorithmic pattern, isolated, and terminated before it could drain additional accounts.',
        failureStory:
          'Wrong analysis. The process was misidentified and a legitimate settlement algorithm was shut down instead, freezing millions in trades.',
        questions: [
          {
            question: 'What is an algorithm?',
            correctAnswer: 'A finite, step-by-step set of instructions to solve a problem',
            options: [
              'A type of computer virus',
              'A finite, step-by-step set of instructions to solve a problem',
              'A high-level programming language',
              'A hardware component inside a CPU',
            ],
            explanation:
              'An algorithm is an unambiguous, finite sequence of instructions that transforms an input into a desired output. Every computer program implements one or more algorithms.',
            topic: 'Algorithms',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=what+is+an+algorithm+computer+science+introduction+crashcourse',
          },
          {
            question:
              'In a sorted list [1, 3, 5, 7, 9], how many comparisons does binary search need to find 7?',
            correctAnswer: '2 comparisons',
            options: ['1 comparison', '2 comparisons', '4 comparisons', '5 comparisons'],
            explanation:
              'Binary search: check middle element (5) → 7>5, go right → check middle of [7,9] which is 7. Found in 2 steps. Linear search would require 4 comparisons.',
            topic: 'Algorithms',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=binary+search+algorithm+computer+science+explained+visualization',
          },
          {
            type: 'code-fill',
            question: 'This loop visits every element once. Fill in the Big-O time complexity letter.',
            codeTemplate: '# Time complexity: O(___)\nfor item in my_list:\n    process(item)',
            correctAnswer: 'n',
            options: [],
            explanation:
              'O(n) — linear time — means work grows proportionally with n (the list size). One operation per element = n total operations.',
            topic: 'Algorithms',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=big+O+notation+O+n+linear+time+complexity+explained',
          },
          {
            type: 'code-fill',
            question: 'Binary search needs integer division to find the midpoint. Fill in the Python operator.',
            codeTemplate: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    mid = (low + high) ___ 2',
            correctAnswer: '//',
            options: [],
            explanation:
              '// is Python\'s floor division operator. (low + high) // 2 gives the integer midpoint without floating-point rounding errors.',
            topic: 'Algorithms',
            youtubeUrl:
              'https://www.youtube.com/results?search_query=python+floor+division+operator+binary+search+algorithm+explained',
          },
        ],
      },
    ],
  },
];

export function buildActiveCases(subject: Subject): ActiveCase[] {
  const bank = SUBJECT_BANKS.find(b => b.subject === subject);
  if (!bank) return [];

  return bank.levels.map(level => {
    const randomQuestion =
      level.questions[Math.floor(Math.random() * level.questions.length)];
    return {
      id: level.id,
      title: level.title,
      description: level.description,
      location: level.location,
      evidenceType: level.evidenceType,
      problem: randomQuestion,
      successStory: level.successStory,
      failureStory: level.failureStory,
    };
  });
}

export function getSubjectMeta(subject: Subject) {
  const bank = SUBJECT_BANKS.find(b => b.subject === subject);
  return bank
    ? { title: bank.subjectTitle, tagline: bank.subjectTagline }
    : { title: '', tagline: '' };
}

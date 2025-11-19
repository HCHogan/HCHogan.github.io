export const NAV_ITEMS = [
  { key: 'index', label: 'Index', description: 'Latest transmissions' },
  { key: 'field-notes', label: 'Field Notes', description: '精选 AI 回答' },
  { key: 'theorems', label: 'Theorems', description: 'Proof sketches' },
  { key: 'gear', label: 'Gear', description: 'Equipment & tooling' },
  { key: 'about', label: 'About Me', description: 'Author dossier' }
];

export const SECTION_CONTENT = {
  theorems: {
    title: 'THEOREMS',
    tagline: 'Proof sketches & categorical diagrams',
    description:
      'Where I pin derivations before codifying them into Lean4 or publishing a zine. Expect terse annotations and ASCII diagrams.',
    highlights: [
      {
        title: 'In Progress',
        body: 'An intuitive proof of the Blakers–Massey theorem using a climbing rope thought experiment.'
      },
      {
        title: 'Artifacts',
        body: 'Custom Lean4 tactics, scratchpad PDFs, and iPad sketches exported into the repo for future remixing.'
      }
    ],
    sections: [
      {
        title: 'Workshop Notes',
        body:
          'I use this space to test heuristics before promoting them into the canonical references. Not all lemmas survive, but the ones that do become part of my expedition kit.'
      }
    ]
  },
  gear: {
    title: 'GEAR_LOCKER',
    tagline: 'Tools that survive granite + production',
    description:
      'My complete toolchain, from editors and configs to the peripherals that stay plugged in during long compilers-and-tennis days.',
    sections: [
      {
        title: 'Toolchain',
        list: ['Note stack: Obsidian + LaTeX for formal writeups', 'Editor: Neovim (github.com/HCHogan/hvim)', 'Systems: NixOS + macOS managed through github.com/HCHogan/nix-config for reproducible environments.']
      },
      {
        title: 'Peripherals',
        list: ['Mouse: PRO X SUPERLIGHT 2', 'Keyboard: Wooting 60HE']
      }
    ]
  },
  about: {
    title: 'ABOUT_ME',
    tagline: 'Signal boost for the human behind the console',
    description:
      'I’m Hank, currently studying Electrical Engineering while quietly falling in love with compilers, programming languages, and the mechanics of modern chips.',
    bullets: [
      '🎓 Electrical Engineering undergrad drifting deeper into computer science.',
      '🚀 Obsessed with compilers, programming languages, and computer architecture.',
      '💻 Comfortable in Rust, Swift, Haskell, and Lean 4.',
      '🎾 When I’m not coding, I’m serving aces on the tennis court.',
      '🎶 Soundtrack: Melodic Dubstep and Tropical House on loop.'
    ],
    highlights: [
      {
        title: 'Stack',
        body: 'Rust + Haskell for ideas, Swift for the polished edges, Lean 4 for proofs.'
      },
      {
        title: 'Off Duty',
        body: 'Balancing tennis practice, coffee rituals, and playlists that keep the flow going.'
      }
    ],
    sections: [
      {
        title: 'Current Focus',
        body:
          'Building intuition for how compilers translate intent into silicon behavior, while experimenting with hybrid PL/architecture research ideas.'
      },
    ],
    orcidId: '0009-0003-7270-3426'
  }
};

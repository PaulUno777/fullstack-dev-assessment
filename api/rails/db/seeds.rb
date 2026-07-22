Candidate.delete_all

[
  {
    name: 'Alan Cruz',
    years_exp: 10,
    status: 'pending',
    date_applied: '2018-06-05 11:55:42',
    reviewed: false,
    description: 'An accomplished legal professional with a myriad of experience and a stellar reputation for handling all facets of litigation and trial practice.  An analytical and strategic thinker with a firm understanding of the drivers and interests impacting litigation, the legal ramifications of the workplace disciplinary process and the overall dynamics of attorney-client relations. Licensed to practice in Pennsylvania, New Jersey and the District of Columbia.'
  },
  {
    name: 'Brian Patel',
    years_exp: 13,
    status: 'accepted',
    date_applied: '2018-06-02 09:55:42',
    reviewed: true,
    description: 'I am a seasoned litigator in the South Florida area with 10 years worth of experience in construction, maritime and insurance defense. My current practice involves real estate (litigation and transactional) and family law as well. In addition to extensive in-court experience, I offer excellent legal research and writing skills and a dedicated focus on the timely delivery of high quality product.'
  },
  {
    name: 'Sally Collins',
    years_exp: 2,
    status: 'rejected',
    date_applied: '2018-06-05 11:55:42',
    reviewed: true,
    description: 'Experience in business immigration with an emphasis on the preparation, review and analysis of immigrant (PERM, I-140 immigrant petitions and AOS applications) and nonimmigrant (L-1A, L-1B, H-1B, O-1) visa petitions and applications. Work directly with large multinational clients in a broad spectrum of global industries. Advise on mergers, acquisitions and corporate reorganizations issues to ensure compliance with immigration regulations. In charge of responding to NOIR, RFE and audits.'
  },
  {
    name: 'Wendy Santiago',
    years_exp: 15,
    status: 'pending',
    date_applied: '2018-05-05 11:55:42',
    reviewed: false,
    description: ''
  },
  {
    name: 'Adrienne Hopkins',
    years_exp: 1,
    status: 'pending',
    date_applied: '2018-04-30 21:55:42',
    reviewed: false,
    description: 'Business litigation and employment litigation attorney; former law review editor; worked at top firms in Dallas, Texas for seven years before forming a private practice.'
  },
  {
    name: 'Kari Morgan',
    years_exp: 1,
    status: 'pending',
    date_applied: '2018-04-30 21:55:42',
    reviewed: false,
    description: 'I am an attorney with a diverse background in multiple areas of practice. I have counseled banks, corporations, and individuals at both state and federal levels.'
  },
  {
    name: 'Marcus Chen',
    years_exp: 8,
    status: 'pending',
    date_applied: '2018-06-08 14:20:00',
    reviewed: false,
    description: 'Corporate counsel focused on SaaS commercial contracts, privacy compliance, and cross-border vendor negotiations.'
  },
  {
    name: 'Elena Vargas',
    years_exp: 6,
    status: 'accepted',
    date_applied: '2018-05-28 09:10:00',
    reviewed: true,
    description: 'Employment litigation associate with jury trial experience and a track record advising HR on disciplinary investigations.'
  },
  {
    name: 'Noah Bergman',
    years_exp: 4,
    status: 'rejected',
    date_applied: '2018-05-18 16:45:00',
    reviewed: true,
    description: 'IP associate specializing in trademark prosecution and brand enforcement for consumer goods clients.'
  },
  {
    name: 'Priya Shah',
    years_exp: 11,
    status: 'pending',
    date_applied: '2018-06-10 08:30:00',
    reviewed: false,
    description: 'Healthcare regulatory attorney advising hospitals and device manufacturers on HIPAA, Stark, and Anti-Kickback compliance.'
  },
  {
    name: 'Jordan Blake',
    years_exp: 3,
    status: 'pending',
    date_applied: '2018-04-12 12:00:00',
    reviewed: false,
    description: ''
  },
  {
    name: 'Sofia Almeida',
    years_exp: 9,
    status: 'accepted',
    date_applied: '2018-03-22 10:15:00',
    reviewed: true,
    description: 'M&A counsel with mid-market private equity deal experience, including diligence coordination and SPA negotiation.'
  },
  {
    name: 'Derek Okonkwo',
    years_exp: 7,
    status: 'pending',
    date_applied: '2018-06-01 18:05:00',
    reviewed: false,
    description: 'Criminal defense attorney transitioning to civil litigation; strong oral advocacy and motion practice.'
  },
  {
    name: 'Hannah Weiss',
    years_exp: 5,
    status: 'rejected',
    date_applied: '2018-05-01 11:40:00',
    reviewed: true,
    description: 'Family law practitioner seeking a broader commercial litigation role; mediation certified.'
  },
  {
    name: 'Luis Romero',
    years_exp: 12,
    status: 'pending',
    date_applied: '2018-02-14 09:00:00',
    reviewed: false,
    description: 'Senior associate in complex commercial disputes; bilingual Spanish/English; federal court experience.'
  },
  {
    name: 'Amelia Grant',
    years_exp: 2,
    status: 'pending',
    date_applied: '2018-06-11 13:25:00',
    reviewed: false,
    description: 'Recent clerkship alumnus with strong research skills and interest in employment defense.'
  }
].each { |attrs| Candidate.create!(attrs) }

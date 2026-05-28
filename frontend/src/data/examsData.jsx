import React from 'react';
import { BookOpen, GraduationCap, Building2, Calculator, Users } from 'lucide-react';

const makeSubtopic = (id, name) => ({
  id,
  name,
  status: 'pending',
  completion: 0,
  prepStages: {
    theory: { done: false, resource: '' },
    videos: { done: false, resource: '' },
    notes: { done: false, resource: '' },
    practice: { done: false, resource: '' },
    notesRevision: { done: false, resource: '' },
    mockTest: { done: false, resource: '' },
    shortNotes: { done: false, resource: '' },
    completed: { done: false, resource: '' }
  }
});

export const staticExamOptions = [
  {
    id: 'upsc',
    title: 'UPSC CSE',
    desc: 'Civil Services Examination',
    icon: <Building2 size={24} className="text-blue-500" />,
    color: 'bg-blue-50 border-blue-200 hover:border-blue-500',
    defaultDDay: '2026-10-12',
    defaultTargetScore: 0,
    syllabus: [
      {
        id: 'u1', name: 'Prelims Paper I & II (Aptitude & GS)', emoji: '📝', round: 'Prelims',
        topics: [
          {
            id: 'u1t1', name: 'Paper I: General Studies', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u1t1s1', '1. Current events of national and international importance'),
              makeSubtopic('u1t1s2', '2. History of India and Indian National Movement'),
              makeSubtopic('u1t1s3', '3. Indian and World Geography - Physical, Social, Economic Geography'),
              makeSubtopic('u1t1s4', '4. Indian Polity and Governance - Constitution, Panchayati Raj, Public Policy'),
              makeSubtopic('u1t1s5', '5. Economic and Social Development - Sustainable Dev, Poverty, Demographics'),
              makeSubtopic('u1t1s6', '6. General issues on Environmental ecology, Bio-diversity and Climate Change'),
              makeSubtopic('u1t1s7', '7. General Science')
            ]
          },
          {
            id: 'u1t2', name: 'Paper II: CSAT (Aptitude)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u1t2s1', '1. Comprehension & Interpersonal skills including communication skills'),
              makeSubtopic('u1t2s2', '2. Logical reasoning and analytical ability'),
              makeSubtopic('u1t2s3', '3. Decision making and problem solving'),
              makeSubtopic('u1t2s4', '4. General mental ability'),
              makeSubtopic('u1t2s5', '5. Basic numeracy & Data interpretation (Class X level)')
            ]
          }
        ]
      },
      {
        id: 'u2', name: 'Mains: Qualifying Language Papers & Essay', emoji: '✍️', round: 'Mains',
        topics: [
          {
            id: 'u2t1', name: 'Qualifying Indian Languages & English', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u2t1s1', 'Comprehension of given passages & Precis Writing'),
              makeSubtopic('u2t1s2', 'Usage and Vocabulary & Short Essays'),
              makeSubtopic('u2t1s3', 'Translation from English to Indian Language and vice-versa')
            ]
          },
          {
            id: 'u2t2', name: 'Paper-I: Essay writing', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u2t2s1', 'Writing essays on multiple topics in orderly, concise fashion with exact expression')
            ]
          }
        ]
      },
      {
        id: 'u3', name: 'GS-I: Culture, History, Society & Geography', emoji: '🏛️', round: 'Mains',
        topics: [
          {
            id: 'u3t1', name: 'Indian Culture & Modern Indian History', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u3t1s1', '1. Indian culture: salient Art Forms, Literature & Architecture'),
              makeSubtopic('u3t1s2', '2. Modern Indian history (mid-18th century to present): events, personalities, issues'),
              makeSubtopic('u3t1s3', '3. Freedom Struggle: stages and contributors from different parts'),
              makeSubtopic('u3t1s4', '4. Post-independence consolidation and reorganization within the country')
            ]
          },
          {
            id: 'u3t2', name: 'World History & Indian Society', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u3t2s1', '5. World History from 18th century (Industrial rev, world wars, philosophies like communism, socialism)'),
              makeSubtopic('u3t2s2', '6. Salient features of Indian Society and Diversity of India'),
              makeSubtopic('u3t2s3', '7. Role of women, organizations, poverty, urbanization and remedies'),
              makeSubtopic('u3t2s4', '8. Effects of globalization on Indian society'),
              makeSubtopic('u3t2s5', '9. Social empowerment, communalism, regionalism & secularism')
            ]
          },
          {
            id: 'u3t3', name: 'Physical & Economic Geography', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u3t3s1', '10. Salient features of world\'s physical geography'),
              makeSubtopic('u3t3s2', '11. Distribution of key natural resources; industrial location factors (India & World)'),
              makeSubtopic('u3t3s3', '12. Geophysical phenomena (earthquakes, Tsunami, Volcano, Cyclone) & critical feature changes')
            ]
          }
        ]
      },
      {
        id: 'u4', name: 'GS-II: Governance, Constitution, Polity & IR', emoji: '⚖️', round: 'Mains',
        topics: [
          {
            id: 'u4t1', name: 'Constitution, Polity & Separation of Powers', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u4t1s1', '1. Indian Constitution: historical underpinnings, evolution, basic structure'),
              makeSubtopic('u4t1s2', '2. Functions & responsibilities of Union and States: federal structure challenges'),
              makeSubtopic('u4t1s3', '3. Separation of powers between organs; dispute redressal mechanisms (ADR)'),
              makeSubtopic('u4t1s4', '4. Comparison of Indian constitutional scheme with other countries')
            ]
          },
          {
            id: 'u4t2', name: 'Organs of State & Constitutional Bodies', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u4t2s1', '5. Parliament and State legislatures structure, conduct & privileges'),
              makeSubtopic('u4t2s2', '6. Executive & Judiciary structure; pressure groups & associations role'),
              makeSubtopic('u4t2s3', '7. Salient features of Representation of People\'s Act'),
              makeSubtopic('u4t2s4', '8. Constitutional posts appointment, powers & responsibilities of Bodies'),
              makeSubtopic('u4t2s5', '9. Statutory, regulatory and quasi-judicial bodies')
            ]
          },
          {
            id: 'u4t3', name: 'Governance, Schemes & Social Sector', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u4t3s1', '10. Government policies, development interventions & implementation issues'),
              makeSubtopic('u4t3s2', '11. Development processes: role of NGOs, SHGs, donors and stakeholders'),
              makeSubtopic('u4t3s3', '12. Welfare schemes for vulnerable sections; protection & betterment bodies'),
              makeSubtopic('u4t3s4', '13. Social Sector services management (Health, Education, HR)'),
              makeSubtopic('u4t3s5', '14. Issues relating to poverty and hunger')
            ]
          },
          {
            id: 'u4t4', name: 'Public Administration & International Relations', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u4t4s1', '15. Governance aspects: transparency, accountability, e-governance & charters'),
              makeSubtopic('u4t4s2', '16. Role of civil services in a democracy'),
              makeSubtopic('u4t4s3', '17. India and its neighborhood relations'),
              makeSubtopic('u4t4s4', '18. Bilateral, regional and global groupings/agreements affecting India'),
              makeSubtopic('u4t4s5', '19. Developed/developing country policies impact on India & Indian diaspora'),
              makeSubtopic('u4t4s6', '20. Important International institutions structure & mandate')
            ]
          }
        ]
      },
      {
        id: 'u5', name: 'GS-III: Technology, Economy, Security & Environment', emoji: '📈', round: 'Mains',
        topics: [
          {
            id: 'u5t1', name: 'Economy, Infrastructure & Agriculture', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u5t1s1', '1. Indian Economy: planning, resource mobilization, growth & employment'),
              makeSubtopic('u5t1s2', '2. Inclusive growth and issues arising from it'),
              makeSubtopic('u5t1s3', '3. Government Budgeting'),
              makeSubtopic('u5t1s4', '4. Major crops, cropping patterns, irrigation, storage & marketing'),
              makeSubtopic('u5t1s5', '5. Direct/indirect farm subsidies, MSP, PDS, food security, buffer stocks'),
              makeSubtopic('u5t1s6', '6. Food processing scope, location, supply chain & requirements'),
              makeSubtopic('u5t1s7', '7. Land reforms in India'),
              makeSubtopic('u5t1s8', '8. Liberalization effects on industrial policy & growth'),
              makeSubtopic('u5t1s9', '9. Infrastructure: Energy, Ports, Roads, Airports, Railways'),
              makeSubtopic('u5t1s10', '10. Investment models')
            ]
          },
          {
            id: 'u5t2', name: 'Science & Technology, Environment & Security', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u5t2s1', '11. S&T developments, applications and everyday life effects'),
              makeSubtopic('u5t2s2', '12. Achievements of Indians in S&T; indigenization & developing new tech'),
              makeSubtopic('u5t2s3', '13. IT, Space, Computers, robotics, nano-tech, bio-tech & IPR issues'),
              makeSubtopic('u5t2s4', '14. Conservation, environmental pollution, degradation & EIA'),
              makeSubtopic('u5t2s5', '15. Disaster and disaster management'),
              makeSubtopic('u5t2s6', '16. Linkages between development and spread of extremism'),
              makeSubtopic('u5t2s7', '17. External state and non-state actors challenges to internal security'),
              makeSubtopic('u5t2s8', '18. Security challenges in communication networks, media, cyber security & money-laundering'),
              makeSubtopic('u5t2s9', '19. Security management in border areas & organized crime/terrorism linkages'),
              makeSubtopic('u5t2s10', '20. Various Security forces and agencies and their mandate')
            ]
          }
        ]
      },
      {
        id: 'u6', name: 'GS-IV: Ethics, Integrity & Aptitude', emoji: '🧠', round: 'Mains',
        topics: [
          {
            id: 'u6t1', name: 'Ethics, Attitude & Foundational Values', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u6t1s1', '1. Ethics Essence, determinants & consequences; private/public relationship ethics'),
              makeSubtopic('u6t1s2', '2. Human Values lessons from great leaders, family, educational institutions'),
              makeSubtopic('u6t1s3', '3. Attitude: content, structure, moral/political attitudes, persuasion'),
              makeSubtopic('u6t1s4', '4. Aptitude & foundational values for Civil Service (integrity, empathy, compassion)')
            ]
          },
          {
            id: 'u6t2', name: 'Emotional Intelligence & Thinkers', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u6t2s1', '5. Emotional intelligence concepts, utilities & administrative applications'),
              makeSubtopic('u6t2s2', '6. Contributions of moral thinkers and philosophers (India & World)')
            ]
          },
          {
            id: 'u6t3', name: 'Public Service values, Probity & Case Studies', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u6t3s1', '7. Civil service values, ethical concerns, rules, ethical governance'),
              makeSubtopic('u6t3s2', '8. Probity in Governance: transparency, RTI, citizen charter, corruption'),
              makeSubtopic('u6t3s3', '9. Case Studies on above issues')
            ]
          }
        ]
      },
      {
        id: 'u7', name: 'Paper VI & VII: Optional Subjects', emoji: '📚', round: 'Mains',
        topics: [
          {
            id: 'u7t1', name: 'Optional Subject Specialization', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('u7t1s1', 'Optional Subject Paper I syllabus'),
              makeSubtopic('u7t1s2', 'Optional Subject Paper II syllabus')
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'uppsc_pcs',
    title: 'UPPSC PCS',
    desc: 'Uttar Pradesh Civil Services',
    icon: <GraduationCap size={24} className="text-rose-500" />,
    color: 'bg-rose-50 border-rose-200 hover:border-rose-500',
    defaultDDay: '2026-11-08',
    defaultTargetScore: 0,
    syllabus: [
      {
        id: 'up0', name: 'UPPSC Prelims (GS-I & CSAT)', emoji: '📝', round: 'Prelims',
        topics: [
          {
            id: 'up0t1', name: 'Paper I: General Studies', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up0t1s1', 'Current events of National & International importance'),
              makeSubtopic('up0t1s2', 'History of India & Indian National Movement'),
              makeSubtopic('up0t1s3', 'India & World Geography - Physical, Social & Economic Geography'),
              makeSubtopic('up0t1s4', 'Indian Polity and Governance - Constitution, Panchayati Raj, Public Policy'),
              makeSubtopic('up0t1s5', 'Economic & Social Development - Sustainable Development, Poverty, Inclusion'),
              makeSubtopic('up0t1s6', 'General issues on Environmental ecology & Climate Change'),
              makeSubtopic('up0t1s7', 'General Science')
            ]
          },
          {
            id: 'up0t2', name: 'Paper II: CSAT (Aptitude)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up0t2s1', 'Comprehension & Interpersonal skills'),
              makeSubtopic('up0t2s2', 'Logical reasoning and analytical ability'),
              makeSubtopic('up0t2s3', 'Decision making and problem solving'),
              makeSubtopic('up0t2s4', 'General mental ability'),
              makeSubtopic('up0t2s5', 'Elementary Mathematics (Arithmetic, Algebra, Geometry, Statistics)'),
              makeSubtopic('up0t2s6', 'General English & General Hindi (Class X level)')
            ]
          }
        ]
      },
      {
        id: 'up1', name: 'GS-I: Indian Heritage, Culture, History & Geography', emoji: '🏛️', round: 'Mains',
        topics: [
          {
            id: 'up1t1', name: 'Art Forms, History & Freedom Struggle', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up1t1s1', '1. History of Indian Culture: Salient Art Forms, Literature & Architecture'),
              makeSubtopic('up1t1s2', '2. Modern Indian History (1757 to 1947): Significant events, personalities, issues'),
              makeSubtopic('up1t1s3', '3. Freedom Struggle: stages and contributors from different parts'),
              makeSubtopic('up1t1s4', '4. Post-independence consolidation & reorganization (till 1965 AD)')
            ]
          },
          {
            id: 'up1t2', name: 'World History & Indian Society', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up1t2s1', '5. World History (18th to mid-20th century: French & Industrial Revolutions, World Wars)'),
              makeSubtopic('up1t2s2', '6. Salient features of Indian Society and Culture'),
              makeSubtopic('up1t2s3', '7. Role of Women, organizations, poverty, urbanization and remedies'),
              makeSubtopic('up1t2s4', '8. Liberalization, privatization, globalization effects on economy, polity & society'),
              makeSubtopic('up1t2s5', '9. Social empowerment, communalism, regionalism & secularism')
            ]
          },
          {
            id: 'up1t3', name: 'Geography & Natural Resources', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up1t3s1', '10. Salient features of world\'s physical geography'),
              makeSubtopic('up1t3s2', '11. Distribution of key natural resources; primary/secondary/tertiary industries factors'),
              makeSubtopic('up1t3s3', '12. Geophysical phenomena: earthquakes, Tsunamis, Volcanic activity, cyclones')
            ]
          }
        ]
      },
      {
        id: 'up2', name: 'GS-II: Governance, Law, Polity, Social Justice & IR', emoji: '⚖️', round: 'Mains',
        topics: [
          {
            id: 'up2t1', name: 'Indian Constitution & Federal Structure', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up2t1s1', '1. Constitution: historical underpinnings, evolution, basic structure'),
              makeSubtopic('up2t1s2', '2. Union & States responsibilities and challenges in federal structure'),
              makeSubtopic('up2t1s3', '3. Separation of powers: dispute redressal mechanisms'),
              makeSubtopic('up2t1s4', '4. Comparison of Indian constitutional scheme with other countries')
            ]
          },
          {
            id: 'up2t2', name: 'State Organs, Representation & Bodies', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up2t2s1', '5. Parliament & State legislatures: structure, conduct of business, privileges'),
              makeSubtopic('up2t2s2', '6. Executive & Judiciary: structure, departments, pressure groups'),
              makeSubtopic('up2t2s3', '7. Salient features of the Representation of People\'s Act'),
              makeSubtopic('up2t2s4', '8. Appointment to Constitutional posts, powers, functions & bodies'),
              makeSubtopic('up2t2s5', '9. Statutory, regulatory and quasi-judicial bodies')
            ]
          },
          {
            id: 'up2t3', name: 'Welfare, Social Sectors & Global Affairs', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up2t3s1', '10. Government policies & developmental interventions design issues'),
              makeSubtopic('up2t3s2', '11. Development processes: role of NGOs, SHGs, and stakeholders'),
              makeSubtopic('up2t3s3', '13. Welfare schemes for vulnerable sections by Centre/States & performance'),
              makeSubtopic('up2t3s4', '14. Social Sector issues (Health, Education, HR)'),
              makeSubtopic('up2t3s5', '15. Poverty and hunger issues & implications'),
              makeSubtopic('up2t3s6', '16. Governance aspects: transparency, accountability, e-governance & charters'),
              makeSubtopic('up2t3s7', '17. Civil Services role in democracy in emerging trends'),
              makeSubtopic('up2t3s8', '18. India and its relationship with neighbouring countries'),
              makeSubtopic('up2t3s9', '19. Bilateral, Regional & Global groupings involving India'),
              makeSubtopic('up2t3s10', '20. Developed/developing countries policy impacts & Indian diaspora'),
              makeSubtopic('up2t3s11', '21. Important International Institutions mandate'),
              makeSubtopic('up2t3s12', '22. Current affairs of Regional, National and International importance')
            ]
          }
        ]
      },
      {
        id: 'up3', name: 'GS-III: Economy, Agriculture, Science, Security & Environment', emoji: '📈', round: 'Mains',
        topics: [
          {
            id: 'up3t1', name: 'Economic Planning, Budgets & Infrastructure', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up3t1s1', '1. Economic planning in India, NITI Aayog role, SDG pursuit'),
              makeSubtopic('up3t1s2', '2. Poverty, Unemployment, Social justice and inclusive growth'),
              makeSubtopic('up3t1s3', '3. Components of Government Budgets and Financial System'),
              makeSubtopic('up3t1s4', '8. Liberalization, globalization effects on industrial policy & growth'),
              makeSubtopic('up3t1s5', '9. Infrastructure: Energy, Ports, Roads, Airports, Railways')
            ]
          },
          {
            id: 'up3t2', name: 'Agriculture & Food Processing', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up3t2s1', '4. Major Crops, irrigation systems, storage, transport & marketing'),
              makeSubtopic('up3t2s2', '5. Direct/indirect farm subsidies, MSP, PDS, food security, buffer stocks'),
              makeSubtopic('up3t2s3', '6. Food processing scope, supply chain & location in India'),
              makeSubtopic('up3t2s4', '7. Land reforms in India since independence'),
              makeSubtopic('up3t2s5', '18. Issues in Agriculture, Horticulture, Forestry and Animal Husbandry')
            ]
          },
          {
            id: 'up3t3', name: 'Science & Technology, Environment & Security', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up3t3s1', '10. S&T developments in everyday life and National Security'),
              makeSubtopic('up3t3s2', '11. Indigenization, new technologies & transfer of technology'),
              makeSubtopic('up3t3s3', '12. ICT, Space Technology, Energy, Nano-tech, Bio-tech & IPR/digital rights'),
              makeSubtopic('up3t3s4', '13. Environmental security, conservation, biodiversity, pollution & EIA'),
              makeSubtopic('up3t3s5', '14. Disaster mitigation and management'),
              makeSubtopic('up3t3s6', '15. International Security challenges: Cyber security, money laundering, extremism'),
              makeSubtopic('up3t3s7', '16. Internal security: Terrorism, corruption, insurgency & crime linkages'),
              makeSubtopic('up3t3s8', '17. Security forces kind, mandate & defence organizations')
            ]
          }
        ]
      },
      {
        id: 'up4', name: 'GS-IV: Ethics, Integrity, Aptitude & Case Studies', emoji: '🧠', round: 'Mains',
        topics: [
          {
            id: 'up4t1', name: 'Ethics, Attitude & Values', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up4t1s1', '1. Ethics Essence, determinants & consequences; private/public relationship ethics'),
              makeSubtopic('up4t1s2', '2. Attitude: structure, function, moral/political attitudes, persuasion'),
              makeSubtopic('up4t1s3', '3. Foundational values for Civil Service: integrity, impartiality, empathy')
            ]
          },
          {
            id: 'up4t2', name: 'Emotional Intelligence & Thinkers', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up4t2s1', '4. Emotional Intelligence concept and application in governance'),
              makeSubtopic('up4t2s2', '5. Contributions of moral thinkers and philosophers (India & World)')
            ]
          },
          {
            id: 'up4t3', name: 'Public Service Values, Probity & Case Studies', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up4t3s1', '6. Civil service values status, ethical concerns, rules, ethical governance'),
              makeSubtopic('up4t3s2', '7. Probity in Governance: transparency, RTI, citizen charter, corruption'),
              makeSubtopic('up4t3s3', '8. Case studies on ethics and administrative issues')
            ]
          }
        ]
      },
      {
        id: 'up5', name: 'GS-V: Uttar Pradesh Special - History, Culture & Governance', emoji: '🏢', round: 'Mains',
        topics: [
          {
            id: 'up5t1', name: 'UP History & Culture', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up5t1s1', '1. History, Civilization, Culture and Ancient Cities of UP'),
              makeSubtopic('up5t1s2', '2. UP Architecture, significance, museums, archives & archaeology'),
              makeSubtopic('up5t1s3', '3. Contributions of UP in pre & post-1857 freedom struggle'),
              makeSubtopic('up5t1s4', '4. Eminent freedom fighters and personalities of UP'),
              makeSubtopic('up5t1s5', '5. Rural, Urban & Tribal issues: festivals, languages, folk dance & customs')
            ]
          },
          {
            id: 'up5t2', name: 'UP Political System & Local Government', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up5t2s1', '6. Political System of UP: Governance, Governor, CM, Assembly'),
              makeSubtopic('up5t2s2', '7. Public Service, Advocate General, UPPSC & High Court jurisdiction'),
              makeSubtopic('up5t2s3', '8. Selection criteria, official language, consolidated & contingency funds'),
              makeSubtopic('up5t2s4', '9. Local Self Government: Urban & Panchayati Raj in UP'),
              makeSubtopic('up5t2s5', '10. Good Governance, Lokayukta, citizen charters, RTI, E-governance')
            ]
          },
          {
            id: 'up5t3', name: 'UP Security, Welfare & Development', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up5t3s1', '11. Land Reforms and its impact in UP'),
              makeSubtopic('up5t3s2', '12. Security issues in UP, extremism linkage, cyber security & border management'),
              makeSubtopic('up5t3s3', '13. Law and Order and Civil Defense in UP'),
              makeSubtopic('up5t3s4', '14. Medical and Health issues in UP'),
              makeSubtopic('up5t3s5', '15. State Education System of UP'),
              makeSubtopic('up5t3s6', '16. UP Contribution in development of India'),
              makeSubtopic('up5t3s7', '17. Current Affairs of UP'),
              makeSubtopic('up5t3s8', '18. Jal Shakti Mission & central welfare schemes in UP'),
              makeSubtopic('up5t3s9', '19. NGOs in UP: Issues, contribution and impact'),
              makeSubtopic('up5t3s10', '20. Tourism in UP: Issues and prospects'),
              makeSubtopic('up5t3s11', '21. Innovation in various fields: impact on employment & socio-economics')
            ]
          }
        ]
      },
      {
        id: 'up6', name: 'GS-VI: Uttar Pradesh Special - Economy & Geography', emoji: '🌳', round: 'Mains',
        topics: [
          {
            id: 'up6t1', name: 'UP Economy & Finance', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up6t1s1', '1. UP Economy overview: budgets, infrastructure & physical resources'),
              makeSubtopic('up6t1s2', '2. Trade, Commerce and industries of UP'),
              makeSubtopic('up6t1s3', '3. UP Govt schemes, projects & planned development (welfare, skill dev)'),
              makeSubtopic('up6t1s4', '4. Investment in UP: Issues and Impact'),
              makeSubtopic('up6t1s5', '5. Public Finance, fiscal policy, tax reforms & One District One Product (ODOP)'),
              makeSubtopic('up6t1s6', '6. Planning & management of renewable/non-renewable energy resources'),
              makeSubtopic('up6t1s7', '7. Demography, Population and Censuses of UP')
            ]
          },
          {
            id: 'up6t2', name: 'UP Agriculture & Forestry', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up6t2s1', '8. Commercialization of agriculture & crop production in UP'),
              makeSubtopic('up6t2s2', '9. UP New Forest Policy'),
              makeSubtopic('up6t2s3', '10. Agro and Social Forestry in U.P'),
              makeSubtopic('up6t2s4', '11. Agricultural diversity & solutions in UP'),
              makeSubtopic('up6t2s5', '12. Developmental Indices of UP in various fields')
            ]
          },
          {
            id: 'up6t3', name: 'UP Geography & Environment', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('up6t3s1', '13. Geography of UP: location, relief, climate, irrigation, minerals, drainage & vegetation'),
              makeSubtopic('up6t3s2', '14. National Parks and Wild Life Sanctuaries in UP'),
              makeSubtopic('up6t3s3', '15. Transport Network in UP'),
              makeSubtopic('up6t3s4', '16. Power Resources, infrastructure & industrial development'),
              makeSubtopic('up6t3s5', '17. Pollution, environmental issues & UP Pollution Control Board functions'),
              makeSubtopic('up6t3s6', '18. Natural Resources of UP: Soil, Water, Air, Forests, Grasslands, Wetlands'),
              makeSubtopic('up6t3s7', '19. Climate Change & Weather Forecasting issues in UP'),
              makeSubtopic('up6t3s8', '20. Habitat, Ecosystem, adjust flora & fauna reference to UP'),
              makeSubtopic('up6t3s9', '21. Science and Technology: issues, advancements & efforts in UP'),
              makeSubtopic('up6t3s10', '22. Aquaculture, viticulture, sericulture, floriculture, horticulture in UP'),
              makeSubtopic('up6t3s11', '23. Public-Private Partnership (PPP) evolvement for UP development')
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ssc_cgl',
    title: 'SSC CGL',
    desc: 'Combined Graduate Level',
    icon: <BookOpen size={24} className="text-emerald-500" />,
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-500',
    defaultDDay: '2026-09-15',
    defaultTargetScore: 0,
    syllabus: [
      {
        id: 's1', name: 'Tier-I: General Intelligence & Reasoning', emoji: '🧩', round: 'Tier-I',
        topics: [
          {
            id: 's1t1', name: 'Verbal & Non-verbal Reasoning', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s1t1s1', 'Analogies, Semantic Analogy, Figural Analogy'),
              makeSubtopic('s1t1s2', 'Symbolic/Number Analogy, Semantic & Figural Classification'),
              makeSubtopic('s1t1s3', 'Semantic Series, Number Series, Figural Series'),
              makeSubtopic('s1t1s4', 'Space Orientation & Space Visualization'),
              makeSubtopic('s1t1s5', 'Venn Diagrams & Drawing Inferences'),
              makeSubtopic('s1t1s6', 'Punched hole/pattern-folding & un-folding, Figural pattern-folding'),
              makeSubtopic('s1t1s7', 'Embedded Figures, Critical Thinking, Emotional & Social Intelligence')
            ]
          }
        ]
      },
      {
        id: 's2', name: 'Tier-I: General Awareness', emoji: '🌍', round: 'Tier-I',
        topics: [
          {
            id: 's2t1', name: 'Environment & Application to Society', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s2t1s1', 'General awareness of environment & everyday observations'),
              makeSubtopic('s2t1s2', 'India and neighboring countries history & culture'),
              makeSubtopic('s2t1s3', 'Geography, Economic Scene, General Policy & Scientific Research')
            ]
          }
        ]
      },
      {
        id: 's3', name: 'Tier-I: Quantitative Aptitude', emoji: '🔢', round: 'Tier-I',
        topics: [
          {
            id: 's3t1', name: 'Arithmetic Core', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s3t1s1', 'Whole numbers computation, decimals & fractions'),
              makeSubtopic('s3t1s2', 'Percentage, Ratio & Proportion, Square Roots, Averages'),
              makeSubtopic('s3t1s3', 'Interest (Simple & Compound), Profit & Loss, Discount'),
              makeSubtopic('s3t1s4', 'Partnership Business, Mixture and Alligation, Time & Work, Time & Distance')
            ]
          },
          {
            id: 's3t2', name: 'Algebra, Geometry & Mensuration', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s3t2s1', 'Basic algebraic identities of School Algebra & elementary surds'),
              makeSubtopic('s3t2s2', 'Linear equations graphs, triangles congruence & similarity'),
              makeSubtopic('s3t2s3', 'Circle, chords, tangents, angles subtended by chords'),
              makeSubtopic('s3t2s4', 'Right Prism, Cone, Cylinder, Sphere, Hemispheres, Parallelepiped'),
              makeSubtopic('s3t2s5', 'Trigonometric ratio, complementary angles, heights and distances'),
              makeSubtopic('s3t2s6', 'Histogram, Frequency polygon, Bar diagram & Pie chart')
            ]
          }
        ]
      },
      {
        id: 's4', name: 'Tier-I: English Comprehension', emoji: '📚', round: 'Tier-I',
        topics: [
          {
            id: 's4t1', name: 'English Basics & Writing', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s4t1s1', 'Correct English usage, grammar & vocabulary'),
              makeSubtopic('s4t1s2', 'Basic comprehension passages & writing ability')
            ]
          }
        ]
      },
      {
        id: 's5', name: 'Tier-II Paper-I Sec-I: Mathematical Abilities', emoji: '📐', round: 'Tier-II',
        topics: [
          {
            id: 's5t1', name: 'Number Systems & Arithmetic Operations', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s5t1s1', 'Whole Numbers, decimals, fractions & relationships'),
              makeSubtopic('s5t1s2', 'Percentages, Ratio & Proportion, Averages, Interest, Profit & Loss'),
              makeSubtopic('s5t1s3', 'Discount, Partnership, Mixture & Alligation, Time, Work, Speed & Distance')
            ]
          },
          {
            id: 's5t2', name: 'Algebra, Geometry & Mensuration', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s5t2s1', 'School algebra basic identities, elementary surds, linear equations graphs'),
              makeSubtopic('s5t2s2', 'Triangles centres, congruence, similarity; Circle chords/tangents'),
              makeSubtopic('s5t2s3', 'Regular Polygons, Right Prism, Cone, Cylinder, Sphere, Hemispheres, Pyramids')
            ]
          },
          {
            id: 's5t3', name: 'Trigonometry & Statistics', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s5t3s1', 'Trigonometric ratios, complementary angles, height & distances (simple)'),
              makeSubtopic('s5t3s2', 'Tables & Graphs: Histogram, Frequency polygon, Bar chart, Pie chart'),
              makeSubtopic('s5t3s3', 'Measures of central tendency: mean, median, mode, standard deviation; simple probability')
            ]
          }
        ]
      },
      {
        id: 's6', name: 'Tier-II Paper-I Sec-I: Reasoning & General Intelligence', emoji: '🧠', round: 'Tier-II',
        topics: [
          {
            id: 's6t1', name: 'Reasoning and Intelligence', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s6t1s1', 'Semantic Analogy, Symbolic/Number Analogy, Figural Analogy'),
              makeSubtopic('s6t1s2', 'Semantic & Figural Classification, Symbolic/Number Classification'),
              makeSubtopic('s6t1s3', 'Venn Diagrams, Drawing inferences, Punched hole/pattern folding'),
              makeSubtopic('s6t1s4', 'Critical Thinking, Problem Solving, Social & Emotional Intelligence'),
              makeSubtopic('s6t1s5', 'Word Building, Coding-decoding, Numerical & Symbolic Operations')
            ]
          }
        ]
      },
      {
        id: 's7', name: 'Tier-II Paper-I Sec-II: English Language & Comprehension', emoji: '📖', round: 'Tier-II',
        topics: [
          {
            id: 's7t1', name: 'Vocabulary & Grammar Usage', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s7t1s1', 'Vocabulary, grammar, sentence structure, synonyms, antonyms & correct usage'),
              makeSubtopic('s7t1s2', 'Spot the Error, Fill in the Blanks, Spellings/Detecting mis-spelt words'),
              makeSubtopic('s7t1s3', 'Idioms & Phrases, One word substitution, Improvement of Sentences'),
              makeSubtopic('s7t1s4', 'Active/Passive Voice of Verbs, Conversion into Direct/Indirect narration')
            ]
          },
          {
            id: 's7t2', name: 'Comprehension & Text Arrangement', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s7t2s1', 'Shuffling of Sentence parts, Shuffling of Sentences in a passage'),
              makeSubtopic('s7t2s2', 'Cloze Passage & Comprehension passages (simple story & current affairs/editorial)')
            ]
          }
        ]
      },
      {
        id: 's8', name: 'Tier-II Paper-I Sec-II: General Awareness', emoji: '🌎', round: 'Tier-II',
        topics: [
          {
            id: 's8t1', name: 'General Awareness Core', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s8t1s1', 'Environment around them & its application to society'),
              makeSubtopic('s8t1s2', 'Knowledge of current events & everyday scientific observations'),
              makeSubtopic('s8t1s3', 'India and its neighboring countries especially History, Culture, Geography, Economic Scene & Scientific Research')
            ]
          }
        ]
      },
      {
        id: 's9', name: 'Tier-II Paper-I Sec-III: Computer Knowledge Test', emoji: '💻', round: 'Tier-II',
        topics: [
          {
            id: 's9t1', name: 'Computer Basics & Software', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s9t1s1', 'Organization of CPU, input/output devices, computer memory, backup devices & ports'),
              makeSubtopic('s9t1s2', 'Windows Operating system, keyboard shortcuts & Windows Explorer'),
              makeSubtopic('s9t1s3', 'Microsoft Office basics: MS Word, MS Excel, MS PowerPoint')
            ]
          },
          {
            id: 's9t2', name: 'Internet & Cyber Security', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s9t2s1', 'Web Browsing, searching, downloading & uploading, e-mail accounts & e-banking'),
              makeSubtopic('s9t2s2', 'Networking devices and protocols; cyber security threats (hacking, virus, worms, Trojan) & prevention')
            ]
          }
        ]
      },
      {
        id: 's10', name: 'Tier-II: DEST & Statistics', emoji: '📊', round: 'Tier-II',
        topics: [
          {
            id: 's10t1', name: 'Section-IV: DEST Speed Test', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s10t1s1', 'Data Entry Speed Test skill test: passage of 2000 key depressions in 15 minutes')
            ]
          },
          {
            id: 's10t2', name: 'Paper-II: Statistics Specialization', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('s10t2s1', 'Collection, Classification and Presentation of Statistical Data'),
              makeSubtopic('s10t2s2', 'Measures of Central Tendency (mean, median, mode) & Partition values (quartiles, deciles, percentiles)'),
              makeSubtopic('s10t2s3', 'Measures of Dispersion (range, quartile/mean/standard deviation) & relative dispersion'),
              makeSubtopic('s10t2s4', 'Moments, Skewness and Kurtosis relationships & measures'),
              makeSubtopic('s10t2s5', 'Correlation and Regression lines, scatter diagrams, Spearman rank correlation'),
              makeSubtopic('s10t2s6', 'Probability Theory, conditional probability & Bayes theorem'),
              makeSubtopic('s10t2s7', 'Random Variables expectation/variance & Distributions (Binomial, Poisson, Normal, Exponential)'),
              makeSubtopic('s10t2s8', 'Sampling Theory parameter/statistic, techniques, Z/t/Chi-square/F tests, ANOVA, Time Series & Index Numbers')
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ssc_chsl',
    title: 'SSC CHSL',
    desc: 'Combined Higher Secondary Level',
    icon: <Users size={24} className="text-emerald-500" />,
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-500',
    defaultDDay: '2026-08-20',
    defaultTargetScore: 0,
    syllabus: [
      {
        id: 'ch1', name: 'Tier-I: General Intelligence & Reasoning', emoji: '🧠', round: 'Tier-I',
        topics: [
          {
            id: 'ch1t1', name: 'Verbal Reasoning', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch1t1s1', 'Semantic Analogy, Classification & Series'),
              makeSubtopic('ch1t1s2', 'Word Building & Drawing Inferences'),
              makeSubtopic('ch1t1s3', 'Problem Solving & Coding-Decoding'),
              makeSubtopic('ch1t1s4', 'Number Series & Numerical Operations')
            ]
          },
          {
            id: 'ch1t2', name: 'Non-Verbal Reasoning', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch1t2s1', 'Figural Analogy, Classification & Series'),
              makeSubtopic('ch1t2s2', 'Embedded Figures & Pattern Folding/Unfolding'),
              makeSubtopic('ch1t2s3', 'Figural Pattern Folding & Completion')
            ]
          },
          {
            id: 'ch1t3', name: 'Mixed/Other & Advanced Topics', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch1t3s1', 'Symbolic Operations & Symbolic/Number Analogy'),
              makeSubtopic('ch1t3s2', 'Symbolic/Number Classification & Trends'),
              makeSubtopic('ch1t3s3', 'Venn Diagrams & Space Orientation'),
              makeSubtopic('ch1t3s4', 'Critical Thinking, Emotional & Social Intelligence')
            ]
          }
        ]
      },
      {
        id: 'ch2', name: 'Tier-I: Quantitative Aptitude', emoji: '🧮', round: 'Tier-I',
        topics: [
          {
            id: 'ch2t1', name: 'Number Systems & Arithmetic Operations', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch2t1s1', 'Computation of whole numbers, decimals & fractions'),
              makeSubtopic('ch2t1s2', 'Percentages, Ratio & Proportion, Square roots & Averages'),
              makeSubtopic('ch2t1s3', 'Simple & Compound Interest, Profit & Loss & Discount'),
              makeSubtopic('ch2t1s4', 'Partnership Business, Mixture & Alligation'),
              makeSubtopic('ch2t1s5', 'Time & Distance, Time & Work')
            ]
          },
          {
            id: 'ch2t2', name: 'Algebra, Geometry & Mensuration', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch2t2s1', 'Basic algebraic identities & elementary surds'),
              makeSubtopic('ch2t2s2', 'Graphs of linear equations'),
              makeSubtopic('ch2t2s3', 'Geometric figures, triangle centres, congruence & similarity'),
              makeSubtopic('ch2t2s4', 'Circle chords, tangents, angles & common tangents'),
              makeSubtopic('ch2t2s5', 'Areas & volumes: Triangles, Quadrilaterals, Polygons, Circles, Prisms, Cones, Cylinders, Spheres, Hemispheres & Pyramids')
            ]
          },
          {
            id: 'ch2t3', name: 'Trigonometry & Statistical Charts', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch2t3s1', 'Trigonometric ratios & complementary angles'),
              makeSubtopic('ch2t3s2', 'Heights & distances (simple problems) & standard identities'),
              makeSubtopic('ch2t3s3', 'Tables & Graphs: Histogram, Frequency polygon, Bar diagram & Pie chart')
            ]
          }
        ]
      },
      {
        id: 'ch3', name: 'Tier-I: General Awareness', emoji: '🌍', round: 'Tier-I',
        topics: [
          {
            id: 'ch3t1', name: 'History & Geography Core', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch3t1s1', 'Environment and its Societal Applications, current events & everyday observations'),
              makeSubtopic('ch3t1s2', 'India & neighbors: Indus Valley, Buddhism/Jainism, Magadha, Gupta, Delhi Sultanate, Mughal & Independence'),
              makeSubtopic('ch3t1s3', 'Geography: Solar system, Earth, Mountains & Rivers, Atmosphere, Cyclones, Vegetation & Soil')
            ]
          },
          {
            id: 'ch3t2', name: 'Economics, Polity & General Science', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch3t2s1', 'Economics: General economics, Planning, National Income, Budget, Market, Demand & Supply, Unemployment'),
              makeSubtopic('ch3t2s2', 'Polity: Constitutional development, rights, DPSP, Executive/Legislature/Judiciary'),
              makeSubtopic('ch3t2s3', 'General Science: Basic Chemistry, Physics & Biology topics')
            ]
          }
        ]
      },
      {
        id: 'ch4', name: 'Tier-I: English Comprehension', emoji: '📝', round: 'Tier-I',
        topics: [
          {
            id: 'ch4t1', name: 'Grammar, Error & Vocabulary', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch4t1s1', 'Spot the Error & Fill in the Blanks'),
              makeSubtopic('ch4t1s2', 'Synonyms, Homonyms & Antonyms'),
              makeSubtopic('ch4t1s3', 'Spelling & Detecting Mis-spelt Words'),
              makeSubtopic('ch4t1s4', 'Idioms & Phrases & One Word Substitution')
            ]
          },
          {
            id: 'ch4t2', name: 'Sentence Shuffling & Comprehension', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch4t2s1', 'Improvement of sentences'),
              makeSubtopic('ch4t2s2', 'Active/Passive Voice & Direct/Indirect Speech'),
              makeSubtopic('ch4t2s3', 'Shuffling of Sentence Parts & Passages'),
              makeSubtopic('ch4t2s4', 'Cloze Test & Comprehension Passage')
            ]
          }
        ]
      },
      {
        id: 'ch5', name: 'Tier-II: Mathematical Abilities', emoji: '📐', round: 'Tier-II',
        topics: [
          {
            id: 'ch5t1', name: 'Number Systems & Arithmetic Operations (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch5t1s1', 'Computation of whole numbers, decimals & fractions'),
              makeSubtopic('ch5t1s2', 'Percentages, Ratio & Proportion, Square roots & Averages'),
              makeSubtopic('ch5t1s3', 'Interest (Simple/Compound), Profit/Loss & Discount'),
              makeSubtopic('ch5t1s4', 'Partnership Business, Mixture & Alligations, Time/Distance & Time/Work')
            ]
          },
          {
            id: 'ch5t2', name: 'Algebra, Geometry & Mensuration (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch5t2s1', 'Basic algebraic identities, surds & graphs of linear equations'),
              makeSubtopic('ch5t2s2', 'Geometric figures, triangle centers, congruence/similarity & circle tangents'),
              makeSubtopic('ch5t2s3', 'Mensuration: Areas & volumes of regular polygons, prisms, cones, cylinders, spheres & hemispheres')
            ]
          },
          {
            id: 'ch5t3', name: 'Trigonometry & Statistics/Probability (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch5t3s1', 'Trigonometric ratios, complementary angles & heights/distances'),
              makeSubtopic('ch5t3s2', 'Standard identities like sin²θ + cos²θ = 1'),
              makeSubtopic('ch5t3s3', 'Tables & Graphs: Histogram, Frequency polygon, Bar-diagram, Pie-chart'),
              makeSubtopic('ch5t3s4', 'Measures of central tendency: mean, median, mode, standard deviation & simple probability calculations')
            ]
          }
        ]
      },
      {
        id: 'ch6', name: 'Tier-II: Reasoning & General Intelligence', emoji: '🧠', round: 'Tier-II',
        topics: [
          {
            id: 'ch6t1', name: 'Reasoning Modules (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch6t1s1', 'Semantic Analogy, Classification & Series'),
              makeSubtopic('ch6t1s2', 'Symbolic Operations & Symbolic/Number Analogy'),
              makeSubtopic('ch6t1s3', 'Trends, Venn Diagrams & Space Orientation'),
              makeSubtopic('ch6t1s4', 'Drawing Inferences, Word Building, coding & decoding & numerical operations')
            ]
          },
          {
            id: 'ch6t2', name: 'Figural & Advanced Intelligence (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch6t2s1', 'Figural Analogy, Classification & Series'),
              makeSubtopic('ch6t2s2', 'Punched Hole pattern-folding, unfolding & completion'),
              makeSubtopic('ch6t2s3', 'Critical Thinking, Problem Solving, Emotional & Social Intelligence')
            ]
          }
        ]
      },
      {
        id: 'ch7', name: 'Tier-II: English Language & Comprehension', emoji: '📖', round: 'Tier-II',
        topics: [
          {
            id: 'ch7t1', name: 'Language & Voice (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch7t1s1', 'Vocabulary, Grammar, Sentence structure & synonym/antonym usage'),
              makeSubtopic('ch7t1s2', 'Spot the Error, Fill in the Blanks, Idioms & Phrases & One-word substitution'),
              makeSubtopic('ch7t1s3', 'Active/Passive Voice of verbs & Conversion to Direct/Indirect narration')
            ]
          },
          {
            id: 'ch7t2', name: 'Passage & Cloze Tests (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch7t2s1', 'Shuffling of Sentence parts & passage sentences'),
              makeSubtopic('ch7t2s2', 'Cloze Passage & reading comprehension passages')
            ]
          }
        ]
      },
      {
        id: 'ch8', name: 'Tier-II: General Awareness', emoji: '🌟', round: 'Tier-II',
        topics: [
          {
            id: 'ch8t1', name: 'GA Modules (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch8t1s1', 'Environment conservation, societal applications & current events'),
              makeSubtopic('ch8t1s2', 'History & Culture of India and neighboring countries'),
              makeSubtopic('ch8t1s3', 'Geography physical features & regional economic scenes'),
              makeSubtopic('ch8t1s4', 'General Policy & Constitutional Development (Rights, DPSP, executive/legislative)')
            ]
          },
          {
            id: 'ch8t2', name: 'Core Sciences (Tier-II)', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch8t2s1', 'Physics: Units, waves, motion, light, work, energy, heat'),
              makeSubtopic('ch8t2s2', 'Chemistry: Symbols, atomic structure, periodic classification, bonding, acids/bases, metals'),
              makeSubtopic('ch8t2s3', 'Biology: Cell structure, genetics, evolution, plant morphology, nitrogen cycle, diseases')
            ]
          }
        ]
      },
      {
        id: 'ch9', name: 'Tier-II: Computer Proficiency Test', emoji: '💻', round: 'Tier-II',
        topics: [
          {
            id: 'ch9t1', name: 'Computer Basics & Software Modules', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch9t1s1', 'Computer organization, CPU, input/output & memory organization'),
              makeSubtopic('ch9t1s2', 'Backup devices, PORTs, Windows Explorer & keyboard shortcuts'),
              makeSubtopic('ch9t1s3', 'Windows OS & MS Office (Word, Excel, PowerPoint)')
            ]
          },
          {
            id: 'ch9t2', name: 'Internet, Networking & Cyber Security', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('ch9t2s1', 'Web Browsing, downloading/uploading, e-mail management & e-banking'),
              makeSubtopic('ch9t2s2', 'Networking devices, protocols & cyber security threats/prevention')
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'jee',
    title: 'IIT JEE',
    desc: 'Joint Entrance Examination',
    icon: <Calculator size={24} className="text-purple-500" />,
    color: 'bg-purple-50 border-purple-200 hover:border-purple-500',
    defaultDDay: '2026-12-15',
    defaultTargetScore: 0,
    syllabus: [
      {
        id: 'j1', name: 'Physics Core', emoji: '⚡', round: 'JEE Main',
        topics: [
          {
            id: 'j1t1', name: 'Mechanics', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('j1t1s1', "Newton's Laws of Motion & Friction systems"),
              makeSubtopic('j1t1s2', 'Work, Energy, Power & Centre of Mass collision'),
              makeSubtopic('j1t1s3', 'Rotational Motion & Moment of Inertia calculations')
            ]
          },
          {
            id: 'j1t2', name: 'Electromagnetism', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('j1t2s1', "Coulomb's Law, Gauss' Law & Capacitor circuits"),
              makeSubtopic('j1t2s2', "Kirchhoff's Rules & Magnetic Force on current wires"),
              makeSubtopic('j1t2s3', "Faraday's Induction law & Alternating Currents (AC)")
            ]
          }
        ]
      },
      {
        id: 'j2', name: 'Mathematics Core', emoji: '📐', round: 'JEE Main',
        topics: [
          {
            id: 'j2t1', name: 'Calculus', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('j2t1s1', 'Limits, continuity, differentiability & derivatives'),
              makeSubtopic('j2t1s2', 'Definite & Indefinite integrals & Area under curve')
            ]
          },
          {
            id: 'j2t2', name: 'Algebra, Vector & 3D', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('j2t2s1', 'Matrices, Determinants & System of Equations'),
              makeSubtopic('j2t2s2', 'Vector algebra and 3D Lines and Planes equations')
            ]
          }
        ]
      },
      {
        id: 'j3', name: 'Chemistry Core', emoji: '🧪', round: 'JEE Main',
        topics: [
          {
            id: 'j3t1', name: 'Physical & Organic Chemistry', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('j3t1s1', 'Chemical Equilibrium, Kinetics & Thermodynamics'),
              makeSubtopic('j3t1s2', 'Hydrocarbons, Alcohols & Carbonyl Compounds reactions'),
              makeSubtopic('j3t1s3', 'Periodic Properties, Chemical Bonding & Coordination complexes')
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'gate',
    title: 'GATE',
    desc: 'Graduate Aptitude Test in Engg.',
    icon: <GraduationCap size={24} className="text-orange-500" />,
    color: 'bg-orange-50 border-orange-200 hover:border-orange-500',
    defaultDDay: '2027-02-14',
    defaultTargetScore: 0,
    syllabus: [
      {
        id: 'g1', name: 'General Aptitude', emoji: '🧮', round: 'Aptitude',
        topics: [
          {
            id: 'g1t1', name: 'Verbal & Quantitative Aptitude', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('g1t1s1', 'English grammar, vocabulary & comprehension passages'),
              makeSubtopic('g1t1s2', 'Numerical reasoning, data interpretation & analytical patterns')
            ]
          }
        ]
      },
      {
        id: 'g2', name: 'Technical Core (CS/IT/ECE Focus)', emoji: '⚙️', round: 'Technical',
        topics: [
          {
            id: 'g2t1', name: 'Core Computer Science', stage: 'Foundation', completion: 0, confidence: 'Low',
            subtopics: [
              makeSubtopic('g2t1s1', 'Asymptotic notation, Sorting & Divide and conquer algorithms'),
              makeSubtopic('g2t1s2', 'Process Synchronization, Deadlocks & Virtual memory tables'),
              makeSubtopic('g2t1s3', 'Linear algebra eigenvalues/eigenvectors & Calculus limits/continuity')
            ]
          }
        ]
      }
    ]
  }
];

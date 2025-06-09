import { NewsArticle } from '@/generated/prisma'
import {
  FaCalendarAlt,
  FaCrosshairs,
  FaCrown,
  FaDragon,
  FaGamepad,
  FaGem,
  FaHeart,
  FaMap,
  FaNewspaper,
  FaServer,
  FaShieldAlt,
  FaStore,
  FaTicketAlt,
  FaUsers,
} from 'react-icons/fa'

export const serverStatus = [
  {
    label: 'Game Server',
    value: 'Online',
    icon: <FaServer />,
    status: 'online' as const,
  },
  {
    label: 'Login Server',
    value: 'Online',
    icon: <FaUsers />,
    status: 'online' as const,
  },
  {
    label: 'Players Online',
    value: '1,234',
    icon: <FaUsers />,
    status: 'online' as const,
  },
  {
    label: 'Server Version',
    value: 'Interlude',
    icon: <FaGamepad />,
    status: 'online' as const,
  },
  {
    label: 'Custom Features',
    value: '50+',
    icon: <FaGamepad />,
  },
  {
    label: 'Security Systems',
    value: '100%',
    icon: <FaShieldAlt />,
  },
]

export const newsItems: NewsArticle[] = [
  {
    title: 'Spring Festival Event Announced',
    publishedAt: new Date('2024-04-10'),
    summary:
      'Join our Spring Festival! Participate in special quests, collect event items, and win exclusive costumes and mounts. The event runs from April 15th to May 1st.',
    content: '',
    isPublished: true,
    image: null,
    author: 'Admin',
    tags: JSON.stringify(['Event']),
    id: '4',
    updatedAt: null,
  },
  {
    title: 'Server Maintenance Scheduled',
    publishedAt: new Date('2024-04-05'),
    summary:
      'Routine server maintenance will take place on April 8th at 02:00 UTC. Expected downtime is 1 hour. Please plan your gameplay accordingly.',
    content: '',
    isPublished: true,
    image: null,
    author: 'Admin',
    tags: JSON.stringify(['Maintenance']),
    id: '5',
    updatedAt: null,
  },
  {
    title: 'Community Discord Launched',
    publishedAt: new Date('2024-03-28'),
    summary:
      'We have launched our official Discord server! Join to chat with other players, get support, and participate in community events.',
    content: '',
    isPublished: true,
    image: null,
    author: 'Admin',
    tags: JSON.stringify(['Community']),
    id: '6',
    updatedAt: null,
  },
  {
    title: 'VIP System Update',
    publishedAt: new Date('2024-03-20'),
    isPublished: true,
    summary:
      'We have implemented a new VIP system with four levels, offering various benefits including increased offline shop duration, additional buff slots, expanded inventory space, and more. Check out the documentation for full details.',
    content: '',
    image: null,
    author: 'Admin',
    tags: JSON.stringify(['System Update', 'Event']),
    id: '1',
    updatedAt: null,
  },
  {
    title: 'New Raid Bosses Added',
    publishedAt: new Date('2024-03-15'),
    summary:
      'Several new raid bosses have been added to the game, including Baylor, Erigon, Dark Dragon, and more. These bosses offer unique challenges and valuable rewards for players.',
    content: '',
    isPublished: true,
    image: null,
    author: 'Admin',
    tags: JSON.stringify(['Content Update']),
    id: '2',
    updatedAt: null,
  },
  {
    title: 'PvP System Improvements',
    publishedAt: new Date('2024-03-10'),
    summary:
      'The PvP system has been enhanced with new features including the PvP Color system, PvP Chat, and improved clan war mechanics. The Rank PvP System is now available with the /pvpinfo command.',
    content: '',
    isPublished: true,
    image: null,
    author: 'Admin',
    tags: JSON.stringify(['Gameplay Update', 'System Update']),
    id: '3',
    updatedAt: null,
  },
]

export const features = [
  {
    title: 'Buff Shop',
    description:
      'Purchase essential buffs from the in-game Buff Shop for Adena or event tokens. Save time and jump straight into the action!',
    icon: <FaGem />,
  },
  {
    title: 'Remote Class Master',
    description: 'Change your class remotely without visiting an NPC. Available for all players with a simple command.',
    icon: <FaGamepad />,
  },
  {
    title: 'Balanced Economy',
    description: 'Carefully tuned drop rates and Adena sinks to ensure a stable and fair in-game economy.',
    icon: <FaStore />,
  },
  {
    title: 'Active Staff',
    description: 'Our team is available daily to assist players, enforce rules, and organize events.',
    icon: <FaCrown />,
  },
  {
    title: 'VIP System',
    description:
      'Four-tier VIP system with benefits including increased offline shop duration (3h-12h), additional buff slots, expanded inventory space, and exclusive features like auto-loot and VIP chat.',
    icon: <FaCrown />,
  },
  {
    title: 'Enhanced PvP',
    description:
      'Improved PvP system with color indicators, dedicated chat, clan war mechanics, and Rank PvP System. Includes Capture The Flag, Team vs Team, and Deathmatch events.',
    icon: <FaCrosshairs />,
  },
  {
    title: 'Custom Content',
    description:
      'New raid bosses (Baylor, Erigon, Dark Dragon, etc.), custom zones, and item sets including Vesper, Dynasty, and Goddess Infinity Weapons.',
    icon: <FaMap />,
  },
  {
    title: 'Security Features',
    description:
      'Advanced protection against exploits, cheats, and unauthorized modifications. Includes anti-cheat, packet protection, and enchant protection systems.',
    icon: <FaShieldAlt />,
  },
  {
    title: 'Raid System',
    description:
      'Enhanced raid boss system with custom spawn times, improved drops, and new raid bosses. Includes Raid Engine and custom raid information display.',
    icon: <FaDragon />,
  },
  {
    title: 'Item System',
    description:
      'Expanded item system with new armor sets, weapons, and consumables. Includes Vesper recipes, Enhanced Boss Jewels, and custom class icons.',
    icon: <FaGem />,
  },
  {
    title: 'Event System',
    description:
      'Regular events including Saturday Double XP, Trivia Events, Seven Signs Festival, and custom PvP events. All events are balanced and rewarding.',
    icon: <FaCalendarAlt />,
  },
  {
    title: 'Trade System',
    description:
      'Enhanced trading system with offline trade support, increased store slots for VIPs, and improved trade protection against exploits.',
    icon: <FaStore />,
  },
]

export const serverInfo = {
  version: 'Interlude',
  rates: {
    exp: 'x5',
    sp: 'x5',
    adena: 'x5',
    drop: 'x3',
    spoil: 'x3',
    quest: 'x5',
    saturday_exp: 'x10',
    saturday_sp: 'x10',
  },
  features: [
    'Offline Trade System',
    'Custom Item Sets',
    'Buff Shop',
    'Olympiad System',
    'Clan Level System (up to 10)',
    'Saturday Double XP',
    'Trivia Events',
    'Custom Raid Bosses',
    'Capture The Flag',
    'Team vs Team Events',
    'Deathmatch Events',
    'Seven Signs Festival',
    'Wedding System',
    'Lottery System',
    'Siege System',
    'Fortress System',
  ],
}

export const systems = [
  {
    title: 'Remote Class Master',
    icon: <FaGamepad />,
    details: [
      'Change class from anywhere',
      'No quest required for 2nd/3rd class',
      'Requires class change item or Adena',
      'Up to 3 classes per character',
    ],
  },
  {
    title: 'Clan Level System',
    icon: <FaUsers />,
    details: [
      'Max clan level: 10',
      'Clan skills unlocked at higher levels',
      'Clan reputation from events and raids',
      'Clan level from events and raids',
    ],
  },
  {
    title: 'Wedding System',
    icon: <FaHeart />,
    details: [
      'Wedding Price: 15M Adena',
      'Free Couple Teleport',
      '120s Teleport Cooldown',
      '20% Divorce Cost',
      'Required Formal Wear',
      'Infidelity Protection',
    ],
  },
  {
    title: 'Lottery System',
    icon: <FaTicketAlt />,
    details: [
      'Initial Prize: 7.5M Adena',
      'Ticket Price: 100K Adena',
      '5 Numbers: 60% of Jackpot',
      '4 Numbers: 40% of Jackpot',
      '3 Numbers: 20% of Jackpot',
      '2/1 Numbers: 200K Adena',
    ],
  },
  {
    title: 'Buff Shop',
    icon: <FaGem />,
    details: [
      'All major buffs available',
      'Buff duration: 60 minutes',
      'Accessible in all towns',
      'VIPs receive bonus buffs slots',
      'VIPs receive bonus buffs duration',
      'VIPs receive bonus buffs price',
    ],
  },
]

export const tabGrids = {
  experience: {
    title: 'Experience & Drop Rates',
    description: 'Base rates for experience, SP, adena, and item drops',
    stats: [
      {
        label: 'Experience Rate',
        value: 'x5',
        description: 'Base experience gain multiplier',
      },
      {
        label: 'SP Rate',
        value: 'x5',
        description: 'Base skill points gain multiplier',
      },
      {
        label: 'Adena Rate',
        value: 'x5',
        description: 'Base adena drop multiplier',
      },
      {
        label: 'Drop Rate',
        value: 'x3',
        description: 'Base item drop chance multiplier',
      },
      {
        label: 'Spoil Rate',
        value: 'x3',
        description: 'Base spoil chance multiplier',
      },
      {
        label: 'Quest Reward Rate',
        value: 'x5',
        description: 'Multiplier for quest rewards',
      },
      {
        label: 'Saturday XP Rate',
        value: 'x10',
        description: 'Double experience on Saturdays',
      },
      {
        label: 'Saturday SP Rate',
        value: 'x10',
        description: 'Double skill points on Saturdays',
      },
      {
        label: 'Party XP Rate',
        value: 'x1',
        description: 'Party experience multiplier',
      },
      {
        label: 'Party SP Rate',
        value: 'x1',
        description: 'Party skill points multiplier',
      },
    ],
  },
  olympiad: {
    title: 'Olympiad System',
    description: 'Olympiad competition settings and rewards',
    stats: [
      {
        label: 'Competition Period',
        value: '1 Month',
        description: 'Duration of each Olympiad cycle',
      },
      {
        label: 'Minimum Level',
        value: '55',
        description: 'Required level to participate',
      },
      {
        label: 'Points per Win',
        value: '3',
        description: 'Points awarded for winning a match',
      },
      {
        label: 'Points per Loss',
        value: '0',
        description: 'Points awarded for losing a match',
      },
      {
        label: 'Daily Matches',
        value: '15',
        description: 'Maximum matches per day',
      },
      {
        label: 'Hero Duration',
        value: '30 Days',
        description: 'Duration of hero status',
      },
      {
        label: 'Hero Skills',
        value: 'Enabled',
        description: 'Hero skills available to winners',
      },
      {
        label: 'Hero Items',
        value: 'Enabled',
        description: 'Special hero items available',
      },
    ],
  },
  pvp: {
    title: 'PvP & Karma System',
    description: 'PvP settings and features',
    stats: [
      {
        label: 'Karma Protection',
        value: 'Level 20',
        description: 'Level below which players are protected from karma',
      },
      {
        label: 'Karma Loss Rate',
        value: 'x1',
        description: 'Rate at which karma is reduced',
      },
      {
        label: 'PK Drop Rate',
        value: 'x1',
        description: 'Rate of items dropped on death for PK',
      },
      {
        label: 'PvP Drop Rate',
        value: 'x1',
        description: 'Rate of items dropped in PvP',
      },
      {
        label: 'PvP Duration',
        value: '20s',
        description: 'Duration of PvP status',
      },
      {
        label: 'PvP Flag Duration',
        value: '5m',
        description: 'Duration of PvP flag after attacking',
      },
      {
        label: 'Karma Drop Limit',
        value: '10%',
        description: 'Maximum items that can drop from karma',
      },
      {
        label: 'Karma Drop Rate',
        value: '40%',
        description: 'Chance of items dropping from karma',
      },
    ],
  },
  events: {
    title: 'Server Events',
    description: 'Regular events and their schedules',
    stats: [
      {
        label: 'Double XP',
        value: 'Saturday',
        description: 'Double experience every Saturday',
      },
      {
        label: 'Trivia Event',
        value: 'Daily',
        description: 'Daily trivia with rewards',
      },
      {
        label: 'Raid Boss Spawn',
        value: 'Custom',
        description: 'Custom raid boss spawn times',
      },
      {
        label: 'Clan War Zone',
        value: 'Always Active',
        description: 'Dedicated zone for clan wars',
      },
      {
        label: 'Siege Events',
        value: 'Weekly',
        description: 'Regular castle and fortress sieges',
      },
      {
        label: 'Olympiad',
        value: 'Monthly',
        description: 'Monthly Olympiad competition',
      },
      {
        label: 'Capture The Flag',
        value: 'Enabled',
        description: 'Team-based CTF event with balanced teams',
      },
      {
        label: 'Team vs Team',
        value: 'Enabled',
        description: 'Balanced team PvP event',
      },
      {
        label: 'Deathmatch',
        value: 'Enabled',
        description: 'Free-for-all PvP event',
      },
      {
        label: 'Seven Signs',
        value: 'Enabled',
        description: 'Dawn vs Dusk competition',
      },
      {
        label: 'Festival Min Players',
        value: '5',
        description: 'Minimum players for Seven Signs Festival',
      },
      {
        label: 'Festival Duration',
        value: '18 min',
        description: 'Length of each Seven Signs Festival',
      },
    ],
  },
  vip: {
    title: 'VIP System',
    description: 'VIP system settings and features',
    stats: [
      {
        label: 'VIP Level 1',
        value: 'Basic',
        description: '3h offline shop, +1 buff slot, VIP buff',
      },
      {
        label: 'VIP Level 2',
        value: 'Standard',
        description: '5h offline shop, +1 buff slot, +20 inv/wh slots, +3 store slots, +10% sell price',
      },
      {
        label: 'VIP Level 3',
        value: 'Premium',
        description:
          '8h offline shop, +1 buff slot, +10 inv slots, +2 store slots, +30% SP, +10% CW drop, Strider rent',
      },
      {
        label: 'VIP Level 4',
        value: 'Elite',
        description: '12h offline shop, +1 buff slot, +5 inv slots, +1 store slot, Auto-loot, VIP chat',
      },
    ],
  },
  trade: {
    title: 'Trade & Shop Settings',
    description: 'Settings for trading and shops',
    stats: [
      {
        label: 'Offline Trade',
        value: 'Enabled',
        description: 'Players can trade while offline',
      },
      {
        label: 'Trade Distance',
        value: '150',
        description: 'Maximum distance for trading',
      },
      {
        label: 'Store Slots',
        value: '20',
        description: 'Base number of private store slots',
      },
      {
        label: 'Trade Protection',
        value: 'Enabled',
        description: 'Protection against trade exploits',
      },
      {
        label: 'Wear Price',
        value: '10 Adena',
        description: 'Cost to try on items in shop',
      },
      {
        label: 'Wear Delay',
        value: '10s',
        description: 'Delay between trying items',
      },
    ],
  },
  zones: {
    title: 'Zones & Instances',
    description: 'Custom zones and instance settings',
    stats: [
      {
        label: 'Kamaloka',
        value: '8 Players',
        description: 'Maximum players in Kamaloka instance',
      },
      {
        label: 'Custom Zones',
        value: '10+',
        description: 'Number of custom zones added',
      },
      {
        label: 'Raid Boss Zones',
        value: 'Custom',
        description: 'Custom raid boss spawn locations',
      },
      {
        label: 'PvP Zones',
        value: 'Multiple',
        description: 'Various PvP zones with different rules',
      },
      {
        label: 'Town Peace',
        value: 'Always',
        description: 'Towns are always peaceful zones',
      },
      {
        label: 'Siege Zones',
        value: 'PVP During Siege',
        description: 'PvP enabled during sieges for participants',
      },
    ],
  },
  security: {
    title: 'Security Features',
    description: 'Server security and protection systems',
    stats: [
      {
        label: 'Anti-Cheat',
        value: 'Enabled',
        description: 'Advanced anti-cheat protection',
      },
      {
        label: 'Packet Protection',
        value: 'Enabled',
        description: 'Protection against packet exploits',
      },
      {
        label: 'Enchant Protection',
        value: 'Enabled',
        description: 'Protection against enchant exploits',
      },
      {
        label: 'IP Filter',
        value: 'Enabled',
        description: 'IP-based protection system',
      },
      {
        label: 'GameGuard',
        value: 'Enabled',
        description: 'GameGuard protection system',
      },
      {
        label: 'Flood Protection',
        value: 'Enabled',
        description: 'Protection against chat and action flooding',
      },
    ],
  },
  clan: {
    title: 'Clan System',
    description: 'Clan system settings and rules',
    stats: [
      {
        label: 'Clan Creation',
        value: '2 Days',
        description: 'Wait time before creating a new clan',
      },
      {
        label: 'Clan Join',
        value: '1 Day',
        description: 'Wait time before joining another clan',
      },
      {
        label: 'Clan Dissolve',
        value: '7 Days',
        description: 'Time required to dissolve a clan',
      },
      {
        label: 'Max Ally Clans',
        value: '4',
        description: 'Maximum clans in an alliance',
      },
      {
        label: 'War Requirements',
        value: '15 Members',
        description: 'Minimum members needed for clan war',
      },
      {
        label: 'Clan Level',
        value: '10',
        description: 'Maximum clan level',
      },
    ],
  },
  quests: {
    title: 'Quest System',
    description: 'Quest and Skill settings',
    stats: [
      {
        label: 'Quest Reward Rate',
        value: 'x1',
        description: 'Multiplier for quest rewards',
      },
      {
        label: 'Quest Drop Rate',
        value: 'x1',
        description: 'Multiplier for quest item drops',
      },
      {
        label: 'Skill Reuse',
        value: 'Enabled',
        description: 'Skill reuse system',
      },
      {
        label: 'Chance Skills',
        value: 'Enabled',
        description: 'Skills with chance to trigger',
      },
      {
        label: 'SP Scrolls',
        value: 'Enabled',
        description: 'SP scroll system',
      },
      {
        label: 'Remote Class Master',
        value: 'Enabled',
        description: 'Remote class change system',
      },
    ],
  },
  wedding: {
    title: 'Wedding System',
    description: 'Marriage and couple features',
    stats: [
      {
        label: 'Wedding Price',
        value: '15M Adena',
        description: 'Cost to get married',
      },
      {
        label: 'Teleport Price',
        value: 'Free',
        description: 'Cost for couple teleport',
      },
      {
        label: 'Teleport Cooldown',
        value: '120s',
        description: 'Time between couple teleports',
      },
      {
        label: 'Divorce Cost',
        value: '20%',
        description: 'Percentage of wedding price',
      },
      {
        label: 'Formal Wear',
        value: 'Required',
        description: 'Wedding formal wear requirement',
      },
      {
        label: 'Infidelity Punishment',
        value: 'Enabled',
        description: 'Punishment for breaking marriage',
      },
    ],
  },
  lottery: {
    title: 'Lottery System',
    description: 'Server lottery and rewards',
    stats: [
      {
        label: 'Initial Prize',
        value: '7.5M Adena',
        description: 'Starting lottery jackpot',
      },
      {
        label: 'Ticket Price',
        value: '100K Adena',
        description: 'Cost per lottery ticket',
      },
      {
        label: '5 Numbers Prize',
        value: '60%',
        description: 'Share of jackpot for 5 numbers',
      },
      {
        label: '4 Numbers Prize',
        value: '40%',
        description: 'Share of jackpot for 4 numbers',
      },
      {
        label: '3 Numbers Prize',
        value: '20%',
        description: 'Share of jackpot for 3 numbers',
      },
      {
        label: '2/1 Numbers Prize',
        value: '200K Adena',
        description: 'Fixed prize for 2 or 1 numbers',
      },
    ],
  },
  siege: {
    title: 'Siege System',
    description: 'Castle siege settings and features',
    stats: [
      {
        label: 'Max Attackers',
        value: '4',
        description: 'Maximum attacking clans per siege',
      },
      {
        label: 'Castle Control',
        value: 'Clan Based',
        description: 'Castle ownership determined by clan',
      },
      {
        label: 'Dawn Requirements',
        value: 'No Castle Required',
        description: 'Castle ownership not required for Dawn',
      },
      {
        label: 'Control Towers',
        value: 'Multiple',
        description: 'Strategic siege control points',
      },
      {
        label: 'Artefacts',
        value: 'Multiple',
        description: 'Castle control points',
      },
      {
        label: 'Siege Duration',
        value: '2 Hours',
        description: 'Length of each siege',
      },
    ],
  },
  raid: {
    title: 'Raid System',
    description: 'Raid system settings and features',
    stats: [
      {
        label: 'Boss Drop Rate',
        value: 'x3',
        description: 'Drop rate for regular bosses',
      },
      {
        label: 'Raid Drop Rate',
        value: 'x3',
        description: 'Drop rate for raid bosses',
      },
      {
        label: 'Boss Adena',
        value: 'x1',
        description: 'Adena drop rate for bosses',
      },
      {
        label: 'Raid Adena',
        value: 'x1',
        description: 'Adena drop rate for raids',
      },
      {
        label: 'Jewel Drop Rate',
        value: 'x1',
        description: 'Drop rate for jewels',
      },
      {
        label: 'Custom Raids',
        value: 'Enabled',
        description: 'Custom raid boss system',
      },
    ],
  },
  item: {
    title: 'Item System',
    description: 'Item system settings and drops',
    stats: [
      {
        label: 'Common Herbs',
        value: 'x3',
        description: 'Drop rate for common herbs',
      },
      {
        label: 'HP/MP Herbs',
        value: 'x5',
        description: 'Drop rate for HP/MP herbs',
      },
      {
        label: 'Greater Herbs',
        value: 'x2',
        description: 'Drop rate for greater herbs',
      },
      {
        label: 'Superior Herbs',
        value: 'x0.8',
        description: 'Drop rate for superior herbs',
      },
      {
        label: 'Special Herbs',
        value: 'x0.2',
        description: 'Drop rate for special herbs',
      },
      {
        label: 'Multiple Drops',
        value: 'Enabled',
        description: 'Multiple items can drop at once',
      },
    ],
  },
}

export const communityLinks = [
  {
    label: 'Rules',
    url: '/rules',
    description: 'Rules and guidance for the server',
    icon: <FaShieldAlt />,
  },
  {
    label: 'Join our Discord',
    url: 'https://discord.gg/extalia',
    description: 'Chat, get support, and join events',
    icon: <FaUsers />,
  },
  {
    label: 'Forum',
    url: 'https://forum.extalia.com',
    description: 'Discuss strategies, report bugs, and suggest features',
    icon: <FaMap />,
  },
  {
    label: 'Support',
    url: 'mailto:support@extalia.com',
    description: 'Contact our staff for help',
    icon: <FaHeart />,
  },
  {
    label: 'News',
    url: '/news',
    description: 'Latest news from server',
    icon: <FaNewspaper />,
  },
]

export const faq = [
  {
    question: 'How do I start playing?',
    answer: 'Register an account, download the client from our website, and log in using your credentials.',
  },
  {
    question: 'Is the server pay-to-win?',
    answer: 'No. All items and features are accessible through gameplay. VIP status offers convenience, not power.',
  },
  {
    question: 'How can I report a bug or player?',
    answer: 'Use the in-game report command or contact staff via Discord or our support email.',
  },
  {
    question: 'What are the server rules?',
    answer:
      'Read our full rules on the website or in the Discord #rules channel. Cheating, exploiting, and toxic behavior are not tolerated.',
  },
]

export const gettingStarted = [
  'Register your account on our website.',
  'Download and install the game client.',
  'Join our Discord for updates and support.',
  'Create your character and complete the tutorial.',
  'Check out the Buff Shop and VIP System for a head start.',
  'Participate in daily events and join a clan for bonuses!',
]

export const highlights = [
  'Stable and lag-free servers with 24/7 uptime.',
  'Active and friendly community.',
  'Regular updates and new content.',
  'Unique events and custom features.',
  'Fair and balanced gameplay for all.',
]

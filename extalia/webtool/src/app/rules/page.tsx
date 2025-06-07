'use client'

import { motion } from 'framer-motion'
import {
  FaGavel,
  FaUserShield,
  FaGamepad,
  FaUsers,
  FaExclamationTriangle,
  FaHandshake,
  FaComments,
  FaStore,
  FaShieldAlt,
} from 'react-icons/fa'

const rules = {
  general: {
    title: 'General Rules',
    icon: <FaGavel />,
    items: [
      'All players must be at least 13 years old to play on the server.',
      'One account per person. Multiple accounts are not allowed.',
      'Account sharing is strictly prohibited.',
      'Using VPNs or proxies to bypass restrictions is not allowed.',
      'All players must follow Discord Terms of Service and Community Guidelines.',
      'Staff decisions are final. Arguing with staff will result in penalties.',
      'English is the primary language for communication.',
      'Players must maintain appropriate behavior in all game channels.',
    ],
  },
  gameplay: {
    title: 'Gameplay Rules',
    icon: <FaGamepad />,
    items: [
      'No use of third-party software, bots, or macros.',
      'No exploiting bugs or glitches. Report them to staff immediately.',
      'No AFK farming or auto-farming methods.',
      'No intentional server disruption or DDoS threats.',
      'No use of packet editors or similar tools.',
      'No speed hacks or movement exploits.',
      'No use of auto-clickers or similar automation tools.',
      'No use of modified game clients.',
    ],
  },
  trading: {
    title: 'Trading & Economy',
    icon: <FaStore />,
    items: [
      'No real money trading (RMT) of any kind.',
      'No selling or buying accounts.',
      'No advertising other servers or services.',
      'No scamming or misleading other players in trades.',
      'No exploiting the market system.',
      'No price manipulation or market abuse.',
      'Trades must be fair and transparent.',
      'Report suspicious trading activities to staff.',
    ],
  },
  pvp: {
    title: 'PvP & Combat',
    icon: <FaUserShield />,
    items: [
      'No spawn camping or excessive griefing.',
      'No exploiting PvP mechanics or bugs.',
      'No intentional team killing in events.',
      'No use of PvP exploits or glitches.',
      'Respect PvP zones and their rules.',
      'No harassment through PvP actions.',
      'No use of unfair PvP advantages.',
      'Report PvP-related issues to staff.',
    ],
  },
  chat: {
    title: 'Chat & Communication',
    icon: <FaComments />,
    items: [
      'No spamming in any chat channels.',
      'No offensive, racist, or discriminatory language.',
      'No advertising or self-promotion.',
      'No harassment or bullying of other players.',
      'No sharing of personal information.',
      'No excessive use of caps or special characters.',
      'No political or religious discussions.',
      'Keep chat family-friendly and respectful.',
    ],
  },
  community: {
    title: 'Community Guidelines',
    icon: <FaUsers />,
    items: [
      'Be respectful to all players and staff.',
      'Help new players when possible.',
      'Report rule violations to staff.',
      'Participate in community events.',
      'Share knowledge and strategies.',
      'Maintain a positive gaming environment.',
      'Respect different playstyles.',
      'Contribute to the community in a positive way.',
    ],
  },
  penalties: {
    title: 'Penalties & Enforcement',
    icon: <FaExclamationTriangle />,
    items: [
      'First offense: Warning and temporary mute/ban.',
      'Second offense: Longer temporary ban.',
      'Third offense: Permanent ban.',
      'Severe violations may result in immediate permanent ban.',
      'Ban evasion will result in permanent IP ban.',
      'Staff reserves the right to modify penalties.',
      'Appeals can be made through Discord.',
      'False reports will result in penalties.',
    ],
  },
  fairplay: {
    title: 'Fair Play Guidelines',
    icon: <FaHandshake />,
    items: [
      'Play the game as intended.',
      "Respect other players' gaming experience.",
      'No exploiting game mechanics.',
      'No use of unfair advantages.',
      'Report cheaters and exploiters.',
      'Help maintain game balance.',
      'Follow the spirit of the rules.',
      'Be a good sport in all situations.',
    ],
  },
  security: {
    title: 'Account Security',
    icon: <FaShieldAlt />,
    items: [
      'Use strong, unique passwords.',
      'Enable two-factor authentication if available.',
      'Never share account credentials.',
      'Report suspicious account activity.',
      'Keep email and contact info updated.',
      'Use secure devices to access the game.',
      'Be cautious of phishing attempts.',
      'Regularly check account security settings.',
    ],
  },
}

export default function Rules() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-4xl mx-auto'
      >
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Server Rules & Guidelines</h1>
          <p className='text-xl text-gray-600'>
            Please read and follow these rules to ensure a fair and enjoyable gaming experience for everyone.
          </p>
        </div>

        {/* Rules Sections */}
        <div className='space-y-8'>
          {Object.entries(rules).map(([key, section], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='bg-white rounded-lg shadow-lg overflow-hidden'
            >
              <div className='bg-gray-800 text-white p-4 flex items-center'>
                <span className='text-2xl mr-3'>{section.icon}</span>
                <h2 className='text-xl font-semibold'>{section.title}</h2>
              </div>
              <div className='p-6'>
                <ul className='space-y-3'>
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + itemIndex * 0.05 }}
                      className='flex items-start space-x-3 text-gray-700'
                    >
                      <span className='flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold'>
                        {itemIndex + 1}
                      </span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='mt-12 text-center text-gray-600'
        >
          <p className='text-sm'>
            These rules are subject to change. Staff reserves the right to modify or update these rules at any time.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

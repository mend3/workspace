'use client'

import { motion } from 'framer-motion'
import Tabs from '@/components/ui/Tabs'
import StatsGrid from '@/components/ui/StatsGrid'
import {
  FaGamepad,
  FaUsers,
  FaShieldAlt,
  FaTrophy,
  FaCalendarAlt,
  FaSkull,
  FaStore,
  FaMap,
  FaGem,
  FaCrown,
  FaScroll,
  FaDragon,
} from 'react-icons/fa'
import { tabGrids } from '../../sources/app'

const tabs = [
  { id: 'rates', label: 'Server Rates', icon: <FaGamepad /> },
  { id: 'olympiad', label: 'Olympiad', icon: <FaTrophy /> },
  { id: 'pvp', label: 'PvP & Karma', icon: <FaSkull /> },
  { id: 'events', label: 'Events', icon: <FaCalendarAlt /> },
  { id: 'vip', label: 'VIP System', icon: <FaUsers /> },
  { id: 'shops', label: 'Shops & Trade', icon: <FaStore /> },
  { id: 'zones', label: 'Zones & Instances', icon: <FaMap /> },
  { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
  { id: 'clans', label: 'Clan System', icon: <FaCrown /> },
  { id: 'items', label: 'Items & Drops', icon: <FaGem /> },
  { id: 'quests', label: 'Quests & Skills', icon: <FaScroll /> },
  { id: 'bosses', label: 'Raid Bosses', icon: <FaDragon /> },
]

export default function ServerStats() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-7xl mx-auto'
      >
        <h1 className='text-4xl font-bold mb-4'>Server Statistics</h1>
        <p className='text-xl text-gray-600 mb-8'>
          Detailed information about server rates, features, and configurations
        </p>

        <Tabs tabs={tabs}>
          {/* Server Rates Tab */}
          <StatsGrid {...tabGrids.experience} />

          {/* Olympiad Tab */}
          <StatsGrid {...tabGrids.olympiad} />

          {/* PvP & Karma Tab */}
          <StatsGrid {...tabGrids.pvp} />

          {/* Events Tab */}
          <StatsGrid {...tabGrids.events} />

          {/* VIP System Tab */}
          <StatsGrid {...tabGrids.vip} />

          {/* Shops & Trade Tab */}
          <StatsGrid {...tabGrids.trade} />

          {/* Zones & Instances Tab */}
          <StatsGrid {...tabGrids.zones} />

          {/* Security Tab */}
          <StatsGrid {...tabGrids.security} />

          {/* Clan System Tab */}
          <StatsGrid {...tabGrids.clan} />

          {/* Items & Drops Tab */}
          <StatsGrid {...tabGrids.item} />

          {/* Quests & Skills Tab */}
          <StatsGrid {...tabGrids.quests} />

          {/* Wedding System Tab */}
          <StatsGrid {...tabGrids.wedding} />

          {/* Lottery System Tab */}
          <StatsGrid {...tabGrids.lottery} />

          {/* Siege System Tab */}
          <StatsGrid {...tabGrids.siege} />

          {/* Raid Bosses Tab */}
          <StatsGrid {...tabGrids.raid} />
        </Tabs>
      </motion.div>
    </div>
  )
}

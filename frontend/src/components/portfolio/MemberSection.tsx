
import { Users } from 'lucide-react'

import { portfolioData } from '../../data/portfolioData'
import MemberCard from './MemberCard'

function MemberSection() {
  const { members } = portfolioData

  return (
    <section
      id="members"
      aria-labelledby="members-heading"
      className="relative px-5 py-20 sm:py-28 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-96 -translate-x-1/2 rounded-full bg-brand-500/5 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold tracking-[0.15em] text-brand-300">
            <Users size={14} />
            THE PEOPLE BEHIND THE WORK
          </div>

          <h2
            id="members-heading"
            className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            Meet our
            <span className="block text-brand-300">
              team members.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
            Different skills, complementary perspectives,
            and one shared vision. Get to know the people
            behind our work.
          </p>

          <p className="mt-4 text-xs font-medium text-slate-500">
            {members.length} team members · One shared direction
          </p>

        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">

          {members.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
            />
          ))}

        </div>

      </div>

    </section>
  )
}

export default MemberSection

import { FilePlus2, Filter, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { ConcernUpdate } from '@/components/features/concern/Concern-update'
import { ConcernTable } from '@/components/features/concern/ConcernTable'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/section'
import { StatusBadge } from '@/components/ui/tag'
import { useApp } from '@/context/AppContext'
import { formatRichText } from '@/lib/richText'

export function Concerns() {
  const { role, concerns, addConcern, user } = useApp()
  const [showForm, setShowForm] = useState(false)
  const isStudent = role === 'Student'
  const ownConcerns = concerns.filter((item) => item.student === user.name)

  async function addUpdate(concern: FormData) {
    await addConcern(concern)
    setShowForm(false)
  }

  return <div className="space-y-5">
    <PageHeader
      eyebrow={isStudent ? 'Private student support' : `${role} workspace`}
      title={isStudent ? 'My concerns' : 'Concern intake'}
      description={isStudent ? 'Review your private requests and send a new concern to the Guidance Office.' : 'Receive, triage, and resolve incoming student support requests.'}
      action={isStudent ? <Button onClick={() => setShowForm((value) => !value)}><FilePlus2 size={17} /> Submit concern</Button> : <span className="flex items-center gap-2 rounded-full bg-[#ECFDF6] px-3 py-2 text-sm font-bold text-[#047860]"><ShieldCheck size={15} /> Staff intake queue</span>}
    />
    {isStudent && showForm && <ConcernUpdate onSubmit={addUpdate} />}
    {isStudent ? (
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-semibold text-[#022C25]">Your request history</h2>
          <p className="mt-1 text-sm text-slate-400">Only you and authorized guidance staff can view these concerns.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {ownConcerns.map((item) => (
            <div className="flex flex-wrap items-center justify-between gap-3 p-5" key={item.id}>
              <div>
                <strong className="block text-sm text-slate-700">{item.title}</strong>
                <p className="mt-1 max-w-2xl text-sm text-slate-500" dangerouslySetInnerHTML={{ __html: formatRichText(item.content) }} />
                <span className="text-sm text-slate-400">{item.category} - {item.course || "Course not provided"} - {item.section || "Section not provided"} - {item.submitted}</span>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </section>
    ) : (
      <>
        <div className="flex gap-3">
          <div className="flex max-w-sm flex-1 items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
            <Search size={17} className="text-slate-400" />
            <input className="w-full py-2.5 text-sm outline-none" placeholder="Search all student concerns" />
          </div>
          <Button variant="secondary"><Filter size={16} /> Filter queue</Button>
        </div>
        <ConcernTable />
      </>
    )}
  </div>
}

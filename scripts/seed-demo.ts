import 'dotenv/config'
import { prisma } from '../lib/db'
import bcrypt from 'bcrypt'

const DEMO_USERNAME = 'demo'
const DEMO_PASSWORD = 'demo123'
const YEARS = [2025, 2026, 2027]

function date(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day)
}

function datetime(year: number, month: number, day: number, hour: number, minute: number): Date {
  return new Date(year, month - 1, day, hour, minute, 0, 0)
}

function getFirstWeekday(year: number, month: number, weekday: number): Date {
  const d = date(year, month, 1)
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1)
  return d
}

function getLastWeekday(year: number, month: number, weekday: number): Date {
  const d = date(year, month + 1, 0)
  while (d.getDay() !== weekday) d.setDate(d.getDate() - 1)
  return d
}

function getWeekdayDates(year: number, month: number, weekday: number): Date[] {
  const results: Date[] = []
  const d = date(year, month, 1)
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1)
  while (d.getMonth() + 1 === month) {
    results.push(new Date(d))
    d.setDate(d.getDate() + 7)
  }
  return results
}

interface EventInput {
  title: string
  startDate: Date
  startTime?: Date
  endDate?: Date
  endTime?: Date
  location?: string
  description?: string
}

async function main() {
  console.log('Seeding demo account...')

  const existingUser = await prisma.users.findUnique({ where: { username: DEMO_USERNAME } })
  if (existingUser) {
    console.log('Demo user exists, clearing existing events...')
    await prisma.events.deleteMany({ where: { user_id: existingUser.id } })
  }

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10)
  const user = existingUser ?? await prisma.users.create({
    data: { username: DEMO_USERNAME, password: hashedPassword },
  })
  console.log(`Demo user id: ${user.id}`)

  const events: EventInput[] = []

  for (const year of YEARS) {
    // --- Weekly Standup: every Monday, 9:00-9:30 ---
    for (const d of getWeekdayDates(year, 1, 1)) {
      let month = d.getMonth() + 1
      while (month <= 12) {
        for (const day of getWeekdayDates(year, month, 1)) {
          events.push({
            title: 'Weekly Standup',
            startDate: day,
            startTime: datetime(year, month, day.getDate(), 9, 0),
            endTime: datetime(year, month, day.getDate(), 9, 30),
            location: 'Conference Room A',
            description: 'Quick team sync — discuss blockers, progress, and priorities for the week.',
          })
        }
        month++
      }
      break
    }

    // --- Design Review: every Wednesday, 14:00-15:00 ---
    for (const d of getWeekdayDates(year, 1, 3)) {
      let month = d.getMonth() + 1
      while (month <= 12) {
        for (const day of getWeekdayDates(year, month, 3)) {
          events.push({
            title: 'Design Review',
            startDate: day,
            startTime: datetime(year, month, day.getDate(), 14, 0),
            endTime: datetime(year, month, day.getDate(), 15, 0),
            location: 'Virtual',
            description: 'Review new designs and prototypes. Stakeholders provide feedback.',
          })
        }
        month++
      }
      break
    }

    // --- Sprint Planning: biweekly Wednesday (even week #), 10:00-11:00 ---
    const sprintPlanningDays: Date[] = []
    for (const d of getWeekdayDates(year, 1, 3)) {
      const weekNum = Math.ceil(d.getDate() / 7)
      if (weekNum % 2 === 0) sprintPlanningDays.push(d)
    }
    let month = 1
    while (month <= 12) {
      for (const day of getWeekdayDates(year, month, 3)) {
        const weekNum = Math.ceil(day.getDate() / 7)
        if (weekNum % 2 === 0) {
          events.push({
            title: 'Sprint Planning',
            startDate: day,
            startTime: datetime(year, month, day.getDate(), 10, 0),
            endTime: datetime(year, month, day.getDate(), 11, 0),
            location: 'Conference Room B',
            description: 'Plan next sprint: assign tasks, estimate effort, set goals.',
          })
        }
      }
      month++
    }

    // --- Sprint Demo & Retro: biweekly Friday (even week #), 15:00-16:00 ---
    month = 1
    while (month <= 12) {
      for (const day of getWeekdayDates(year, month, 5)) {
        const weekNum = Math.ceil(day.getDate() / 7)
        if (weekNum % 2 === 0) {
          events.push({
            title: 'Sprint Demo & Retrospective',
            startDate: day,
            startTime: datetime(year, month, day.getDate(), 15, 0),
            endTime: datetime(year, month, day.getDate(), 16, 0),
            location: 'Conference Room A',
            description: 'Demo completed work and discuss what went well / what to improve.',
          })
        }
      }
      month++
    }

    // --- Monthly Business Review: 1st Monday, 14:00-15:00 ---
    for (let m = 1; m <= 12; m++) {
      const day = getFirstWeekday(year, m, 1)
      events.push({
        title: 'Monthly Business Review',
        startDate: day,
        startTime: datetime(year, m, day.getDate(), 14, 0),
        endTime: datetime(year, m, day.getDate(), 15, 0),
        location: 'Boardroom',
        description: 'Monthly performance review: metrics, goals, and strategic discussions.',
      })
    }

    // --- All-Hands Meeting: last Friday, 13:00-14:00 ---
    for (let m = 1; m <= 12; m++) {
      const day = getLastWeekday(year, m, 5)
      events.push({
        title: 'All-Hands Meeting',
        startDate: day,
        startTime: datetime(year, m, day.getDate(), 13, 0),
        endTime: datetime(year, m, day.getDate(), 14, 0),
        location: 'Auditorium',
        description: 'Company-wide updates, announcements, and Q&A session.',
      })
    }

    // --- Team Lunch: 15th (or nearest weekday), 12:00-13:00 ---
    for (let m = 1; m <= 12; m++) {
      const d = date(year, m, 15)
      while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1)
      events.push({
        title: 'Team Lunch',
        startDate: d,
        startTime: datetime(year, m, d.getDate(), 12, 0),
        endTime: datetime(year, m, d.getDate(), 13, 0),
        location: 'Downtown Bistro',
        description: 'Monthly team lunch — casual get-together.',
      })
    }

    // --- Quarterly Planning ---
    const quarters = [
      { month: 1, desc: 'Q1 planning and goal setting for the year ahead.' },
      { month: 4, desc: 'Q2 planning: adjust priorities and resource allocation.' },
      { month: 7, desc: 'Q3 planning: mid-year review and roadmap refinement.' },
      { month: 10, desc: 'Q4 planning: final push and year-end strategy.' },
    ]
    for (const q of quarters) {
      const day = getFirstWeekday(year, q.month, 1)
      events.push({
        title: `Quarterly Planning (Q${Math.ceil(q.month / 3)})`,
        startDate: day,
        startTime: datetime(year, q.month, day.getDate(), 9, 0),
        endTime: datetime(year, q.month, day.getDate() + 1, 17, 0),
        endDate: date(year, q.month, day.getDate() + 1),
        location: 'Boardroom',
        description: q.desc,
      })
    }

    // --- Performance Reviews (February & August) ---
    for (const m of [2, 8]) {
      const d = getFirstWeekday(year, m, 2)
      events.push({
        title: 'Performance Review Cycle',
        startDate: d,
        startTime: datetime(year, m, d.getDate(), 9, 0),
        endDate: date(year, m, d.getDate() + 4),
        endTime: datetime(year, m, d.getDate() + 4, 17, 0),
        location: 'Boardroom',
        description: 'Bi-annual performance review cycle. Managers meet with team members individually.',
      })
    }

    // --- Annual Conference (May) ---
    {
      const start = getFirstWeekday(year, 5, 2)
      events.push({
        title: 'Annual Industry Conference',
        startDate: start,
        startTime: datetime(year, 5, start.getDate(), 8, 0),
        endDate: date(year, 5, start.getDate() + 3),
        endTime: datetime(year, 5, start.getDate() + 3, 18, 0),
        location: 'Convention Center',
        description: 'Annual industry conference with keynotes, workshops, and networking.',
      })
    }

    // --- Summer Team Retreat (August) ---
    {
      const start = getFirstWeekday(year, 8, 2)
      events.push({
        title: 'Summer Team Retreat',
        startDate: start,
        startTime: datetime(year, 8, start.getDate(), 9, 0),
        endDate: date(year, 8, start.getDate() + 2),
        endTime: datetime(year, 8, start.getDate() + 2, 17, 0),
        location: 'Mountain Lodge',
        description: 'Annual team retreat with workshops, team-building activities, and social events.',
      })
    }

    // --- Holidays (all-day events) ---
    const holidays: Array<{ month: number; day: number; title: string }> = [
      { month: 1, day: 1, title: "New Year's Day" },
      { month: 1, day: 20, title: 'Martin Luther King Jr. Day' },
      { month: 2, day: 14, title: "Valentine's Day" },
      { month: 3, day: 17, title: "St. Patrick's Day" },
      { month: 5, day: 26, title: 'Memorial Day' },
      { month: 6, day: 19, title: 'Juneteenth' },
      { month: 7, day: 4, title: 'Independence Day' },
      { month: 9, day: 1, title: 'Labor Day' },
      { month: 10, day: 31, title: 'Halloween' },
      { month: 11, day: 27, title: 'Thanksgiving' },
      { month: 11, day: 28, title: 'Thanksgiving Friday' },
      { month: 12, day: 24, title: 'Christmas Eve' },
      { month: 12, day: 25, title: 'Christmas Day' },
      { month: 12, day: 31, title: "New Year's Eve" },
    ]
    for (const h of holidays) {
      events.push({
        title: h.title,
        startDate: date(year, h.month, h.day),
        description: 'Company holiday — office closed.',
      })
    }

    // --- One-off events ---
    const oneoffs = [
      {
        month: 2,
        day: 10,
        title: 'Dental Checkup',
        startHour: 10,
        startMin: 0,
        endHour: 11,
        endMin: 0,
        location: 'Downtown Dental',
        desc: 'Regular dental cleaning and checkup.',
      },
      {
        month: 3,
        day: 22,
        title: 'Client Onboarding Session',
        startHour: 13,
        startMin: 0,
        endHour: 15,
        endMin: 0,
        location: 'Main Office',
        desc: 'Onboard new client — walk through platform and set up integrations.',
      },
      {
        month: 4,
        day: 18,
        title: 'Team Building Workshop',
        startHour: 9,
        startMin: 0,
        endHour: 17,
        endMin: 0,
        location: 'Adventure Park',
        desc: 'Full-day team building event with outdoor activities.',
      },
      {
        month: 6,
        day: 15,
        title: 'Mid-Year Review Prep',
        startHour: 14,
        startMin: 0,
        endHour: 15,
        endMin: 30,
        location: 'Conference Room C',
        desc: 'Prepare mid-year performance review materials.',
      },
      {
        month: 9,
        day: 12,
        title: 'Product Launch Planning',
        startHour: 10,
        startMin: 0,
        endHour: 12,
        endMin: 0,
        location: 'Boardroom',
        desc: 'Planning session for upcoming product launch.',
      },
      {
        month: 10,
        day: 8,
        title: 'Wellness Check-In',
        startHour: 11,
        startMin: 0,
        endHour: 11,
        endMin: 30,
        location: 'HR Office',
        desc: 'Quarterly wellness check-in with HR.',
      },
      {
        month: 11,
        day: 5,
        title: 'Budget Planning Meeting',
        startHour: 9,
        startMin: 0,
        endHour: 11,
        endMin: 0,
        location: 'Boardroom',
        desc: 'Annual budget planning for the upcoming year.',
      },
      {
        month: 12,
        day: 12,
        title: 'Holiday Party',
        startHour: 18,
        startMin: 0,
        endHour: 22,
        endMin: 0,
        location: 'Grand Ballroom',
        desc: 'Annual company holiday party — festive celebration.',
      },
    ]
    for (const ev of oneoffs) {
      events.push({
        title: ev.title,
        startDate: date(year, ev.month, ev.day),
        startTime: datetime(year, ev.month, ev.day, ev.startHour, ev.startMin),
        endTime: datetime(year, ev.month, ev.day, ev.endHour, ev.endMin),
        location: ev.location,
        description: ev.desc,
      })
    }

    // --- Personal events / reminders ---
    const personal = [
      {
        month: 1,
        day: 15,
        title: 'Health Insurance Renewal Deadline',
        allDay: true,
        desc: 'Last day to update health insurance selections.',
      },
      {
        month: 5,
        day: 10,
        title: 'Flu Shot Clinic',
        startHour: 10,
        startMin: 0,
        endHour: 16,
        endMin: 0,
        location: 'HR Office',
        desc: 'Annual flu shot clinic — walk-ins welcome.',
      },
      {
        month: 8,
        day: 1,
        title: '401(k) Contribution Review',
        startHour: 14,
        startMin: 0,
        endHour: 14,
        endMin: 30,
        location: 'Virtual',
        desc: 'Review and adjust retirement contributions.',
      },
      {
        month: 9,
        day: 15,
        title: 'Volunteer Day',
        startHour: 9,
        startMin: 0,
        endHour: 15,
        endMin: 0,
        location: 'Community Center',
        desc: 'Company volunteer day — give back to the community.',
      },
    ]
    for (const ev of personal) {
      events.push({
        title: ev.title,
        startDate: date(year, ev.month, ev.day),
        ...(ev.allDay
          ? {}
          : {
              startTime: datetime(year, ev.month, ev.day, ev.startHour!, ev.startMin!),
              endTime: datetime(year, ev.month, ev.day, ev.endHour!, ev.endMin!),
            }),
        ...('location' in ev ? { location: ev.location } : {}),
        description: ev.desc,
      })
    }
  }

  await prisma.events.createMany({
    data: events.map((e) => ({
      user_id: user.id,
      title: e.title,
      start_date: e.startDate,
      start_time: e.startTime ?? null,
      end_date: e.endDate ?? null,
      end_time: e.endTime ?? null,
      location: e.location ?? null,
      description: e.description ?? null,
    })),
  })

  console.log(`Seeded ${events.length} events for demo user across ${YEARS.join(', ')}`)
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

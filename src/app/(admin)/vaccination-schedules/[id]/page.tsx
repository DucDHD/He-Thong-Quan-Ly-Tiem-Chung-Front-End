import ScheduleDetail from '@/components/vaccination-schedules/ScheduleDetail'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

const ScheduleDetailPage = async ({ params }: PageProps) => {
  const { id } = await params

  return <ScheduleDetail scheduleId={id} />
}

export default ScheduleDetailPage

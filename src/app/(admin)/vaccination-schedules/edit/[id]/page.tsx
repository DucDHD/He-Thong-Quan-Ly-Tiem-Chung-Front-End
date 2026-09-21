import ScheduleUpdate from '@/components/vaccination-schedules/ScheduleUpdate'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

const EditVaccinationSchedulePage = async ({ params }: PageProps) => {
  const { id } = await params

  return <ScheduleUpdate id={id} />
}

export default EditVaccinationSchedulePage

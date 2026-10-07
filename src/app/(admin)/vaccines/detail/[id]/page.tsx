import VaccineDetail from '@/components/vaccines/VaccineDetail'

type VaccineDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function VaccineDetailPage({
  params
}: VaccineDetailPageProps) {
  const { id } = await params
  return <VaccineDetail vaccineId={id} />
}

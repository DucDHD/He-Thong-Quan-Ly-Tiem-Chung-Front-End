import DiseaseSituationUpdate from '@/components/disease-situation/DiseaseSituationUpdate'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

const EditDiseaseSituationPage = async ({ params }: PageProps) => {
  const { id } = await params

  return <DiseaseSituationUpdate id={id} />
}

export default EditDiseaseSituationPage

import UserUpdate from '@/components/users/UserUpdate'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

const EditUserPage = async ({ params }: PageProps) => {
  const { id } = await params

  return <UserUpdate userId={id} />
}

export default EditUserPage

import UserDetail from '@/components/users/UserDetail'

type Props = {
  params: Promise<{
    id: string
  }>
}

const UserDetailPage = async ({ params }: Props) => {
  const { id } = await params

  return <UserDetail userId={id} />
}

export default UserDetailPage

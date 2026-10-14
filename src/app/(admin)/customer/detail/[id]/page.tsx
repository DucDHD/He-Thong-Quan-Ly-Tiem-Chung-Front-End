import CustomerDetail from '@/components/customer/CustomerDetail'

type CustomerPageProps = {
  params: Promise<{
    id: string
  }>
}

const CustomerPage = async ({ params }: CustomerPageProps) => {
  const { id } = await params

  return <CustomerDetail userId={id} />
}

export default CustomerPage

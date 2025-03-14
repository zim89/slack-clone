interface Props {
  params: {
    id: string
  }
}

export default function Page({ params }: Props) {
  return <div>Workspace Page with ID: {params.id}</div>
}

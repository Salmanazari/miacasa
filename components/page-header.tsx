interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      {description && <p className="text-lg text-gray-600 max-w-3xl">{description}</p>}
    </div>
  )
}


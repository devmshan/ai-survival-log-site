import { NewsletterForm } from '@/components/newsletter/NewsletterForm'

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 max-w-4xl py-6">
        <NewsletterForm />
        <p className="text-center text-sm text-muted-foreground mt-4">
          © devsurvivallog
        </p>
      </div>
    </footer>
  )
}

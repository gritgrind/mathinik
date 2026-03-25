import { type ErrorComponentProps, Link } from '@tanstack/react-router'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : 'Unknown error'

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center px-4 py-10 md:px-6">
      <Card className="w-full border-destructive/30 bg-card/95 shadow-2xl shadow-destructive/10">
        <CardHeader>
          <CardTitle className="text-3xl font-black tracking-tight">
            Something in the shell broke.
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground md:text-base">
          <p>{message}</p>
          <Link className={buttonVariants()} to="/">
            Back to home
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}

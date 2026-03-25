import { Link } from '@tanstack/react-router'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center px-4 py-10 md:px-6">
      <Card className="w-full border-border/60 bg-card/95 shadow-2xl shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-3xl font-black tracking-tight">
            This path is not on the map yet.
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground md:text-base">
          <p>
            The requested route does not exist in the current Mathinik shell.
          </p>
          <Link className={buttonVariants()} to="/">
            Return home
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}

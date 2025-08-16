import { Footer } from '@/components/elements/footer'
import { Header } from '@/components/elements/header'
import { Logo } from '@/components/elements/logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex  flex-1 items-center justify-center w-full">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center justify-center flex flex-col items-center">
            <Logo />
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
